/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("StudentModule.Edit", function (Edit, Lampa, Backbone, Marionette, $) {
    Edit.Layout = Lampa.EditableItemView.extend({
        template: "student/edit",
        className: "container",
        regions: {
            groupRegion: "#groups",
            addToGroupRegion: "#add-to-group",
            lessonsRegion: "#lessons"
        },
        saveModelRequest: "student:save",
        ui: {
            firstName: "#firstName",
            lastName: "#lastName",
            email: "#email"
        },
        behaviors: {
            Tooltips: {}
        },
        events: {
            "click #save": "saveEntity",
            "click #back": "goBack",
            "change @ui.firstName": "setFirstName",
            "change @ui.lastName": "setLastName",
            "change @ui.email": "setEmail"
        },
        setFirstName: function () {
            try {
                this.model.set('firstName', this.ui.firstName.val());
                this.model.set('fullName', String(this.model.get("firstName")) + ' ' + String(this.model.get("lastName")));

                if (this.model.id != null) {
                    this.saveModel();
                }
            }
            catch (ex) {
                console.log('error', ex.message);
            }
        },
        setLastName: function () {
            try {
                this.model.set('lastName', this.ui.lastName.val());
                this.model.set('fullName', String(this.model.get("firstName")) + ' ' + String(this.model.get("lastName")));
                if (this.model.id != null) {
                    this.saveModel();
                }
            }
            catch (ex) {
                console.log('error', ex.message);
            }
        },
        setEmail: function () {
            try {
                this.model.set('email', this.ui.email.val());
                if (this.model.id != null) {
                    this.saveModel();
                }
            }
            catch (ex) {
                console.log('error', ex.message);
            }
        },
        modelEvents: {
            "change:fullName": "render"
        },
        collectionEvents: {
            "change": "renderLessons"
        },
        onBeforeDestroy: function () {
            Lampa.request("student:clean");
            Lampa.request("students:refresh");
        },
        renderLessons: function () {
            Lampa.trigger("progressBar:show");
            var _this = this;
            var personID = _this.model.get('personID') || null;
            if (personID !== null) {
                $.when(Lampa.request("student:lessons", personID)
                    .then(
                        function (collection) {
                            _this.lessonsRegion.show(new Edit.Lessons({collection: collection}));
                            Lampa.trigger("progressBar:hide");
                        }
                    )
                );
            }
        },
        onRender: function () {
            Lampa.trigger("progressBar:show");
            var _this = this;
            var personID = _this.model.get('personID') || null;
            if (personID !== null) {
                this.renderLessons();
                $.when(Lampa.request("student:groups", personID), Lampa.request("group:entities")).done(function (inGroups, allGroups) {
                    _this.collection = inGroups;
                    _this.groupRegion.show(new Edit.StudentGroups({collection: _this.collection}));
                    var selection = allGroups.clone();
                    if (selection.length > 1) {
                        selection.add(Lampa.request("group:empty"));
                    }

                    var model = Lampa.request("student:group");
                    model.set('personID', personID);
                    var view = new Edit.AddToGroup({collection: selection, model: model});
                    view.groupPersons = inGroups;
                    _this.addToGroupRegion.show(view);
                });
                Lampa.trigger("progressBar:hide");
            }
        },
        saveEntity: function (e) {
            var _this = this;
            var isNewItem = (this.model.id === null);
            $.when(this.saveModel()).done(function () {
                Lampa.request('students:refresh');
                if (isNewItem) {
                    Lampa.trigger('student:list');
                }
            });
        }
    });

    Edit.Group = Marionette.ItemView.extend({
        template: "group/option",
        tagName: "option",
        attributes: function () {
            var attr = {};
            attr.value = null;
            if (this.model.get('groupID') !== undefined) {
                attr.value = this.model.get('groupID');
            }
            return attr;
        }
    });

    Edit.Groups = Marionette.CompositeView.extend({
        template: "group/select",
        childView: Edit.Group,
        childViewContainer: "select"
    });

    Edit.StudentGroup = Marionette.ItemView.extend({
        template: "student/group",
        tagName: "tr",
        events: {
            "click .delete": "deleteFromGroup",
            "change": "serialize"
        },
        behaviors: {
            DateTimePicker: {serialize: this.serialize}
        },
        ui: {
            start: ".start",
            end: ".end"
        },
        serialize: function () {
            try {
                this.model.set('type', 's');
                this.model.set('start', this.ui.start.val());
                this.model.set('end', this.ui.end.val());
                this.model.save();
            }
            catch (ex) {
                console.log('error', ex.message);
            }
        },
        deleteFromGroup: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.model.destroy();
        }
    });

    Edit.StudentNoGroups = Marionette.ItemView.extend({
        template: "student/noGroups",
        tagName: "tr",
        className: "warning"
    });

    Edit.StudentGroups = Marionette.CompositeView.extend({
        template: "student/groups",
        childView: Edit.StudentGroup,
        childViewContainer: "tbody",
        emptyView: Edit.StudentNoGroups
    });

    Edit.AddToGroup = Marionette.CompositeView.extend({
        template: "student/addToGroup",
        childView: Edit.Group,
        childViewContainer: "select",
        groupPersons: null,
        behaviors: {
            DateTimePicker: {}
        },
        ui: {
            start: "#from",
            end: "#to",
            button: "#add"
        },
        events: {
            "click @ui.button": "saveModel"
        },
        collectionEvents: {
            'change': 'render'
        },
        saveModel: function (e) {
            e.preventDefault();
            e.stopPropagation();
            try {
                if (this.model !== null) {
                    var model = this.model;
                    var parent = this;

                    model.set('groupID', $('#groupID').val());
                    model.set('type', 's');

                    var start = (this.ui.start.val() === "") ? null : this.ui.start.val();
                    var end = parent.ui.end.val();
                    if (end === "") {
                        end = null;
                    }
                    model.set('start', start);
                    model.set('end', end);
                    model.save();

                    console.log(' model.saved');
                    this.collection.add(model);

                    $.when(Lampa.request('group:entity', model.get('groupID'))).done(function (group) {
                        var clone = model.clone();
                        clone.set('abbr', group.get('abbr'));
                        clone.set('name', group.get('name'));

                        if (parent.groupPersons !== null) {
                            parent.groupPersons.push(clone);
                        }
                        parent.setNewModel();
                    });
                }
            }
            catch (ex) {
                console.log('error', ex.message);
            }
        },
        setNewModel: function () {
            this.model = Lampa.request("student:group", this.model.get('personID'));
        }
    });

    Edit.Lesson = Marionette.ItemView.extend({
        template: "student/lesson",
        tagName: "tr",
        className: function () {
            var value = 'clickable ';
            value += Lampa.request(
                'helper:getStatusClass',
                this.model.get('status'),
                'admin',
                this.model.get('start')
            );
            value += '-row';
            return value;
        },
        behaviors: {
            GroupDetails: {},
            LocationDetails: {},
            CourseDetails: {},
            TeacherDetails: {}
        },
        events: {
            "click": "showItem"
        },
        showItem: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("lesson:show", this.model.get("lessonID"));
        }
    });

    Edit.NoLessons = Marionette.ItemView.extend({
        template: "group/lessons-none",
        tagName: "tr"
    });

    Edit.Lessons = Marionette.CompositeView.extend({
        template: "student/lessons",
        childViewContainer: "tbody",
        childView: Edit.Lesson,
        emptyView: Edit.NoLessons,
        behaviors: {
            GroupIcons: {horizontal: true},
            LocationIcons: {horizontal: true},
            CourseIcons: {horizontal: true},
            TeacherIcons: {horizontal: true}
        }
    });
});