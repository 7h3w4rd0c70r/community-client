/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("LocationsModule.Edit", function (Edit, Lampa, Backbone, Marionette, $) {
    Edit.Location = Lampa.EditableItemView.extend({
        template: "location/edit",
        className: "container",
        regions: {
            lessonsRegion: "#lessons"
        },
        saveModelRequest: "location:save",
        ui: {
            name: "#name",
            abbr: "#abbr",
            capacity: "#capacity",
            description: "#description",
            scheduleCross: "#scheduleCross",
            start: "#start",
            end: "#end",
            icon: "#icon"
        },
        behaviors: {
            DateTimePicker: {serialize: this.serialize},
            Tooltips: {},
            Icon: {},
            ElasticTextArea: {}
        },
        events: {
            "click .icon": "changeIcon",
            "click #save": "saveEntity",
            "click #back": "goBack",
            "change": "serialize"
        },
        modelEvents: {
            "change:icon": "render updateIcon",
            "change:locationID": "render"
        },
        onBeforeDestroy: function () {
            Lampa.request("location:clean");
            Lampa.request("locations:refresh");
        },
        onRender: function () {
            Lampa.trigger("progressBar:show");
            var _this = this;
            var locationID = _this.model.get('locationID') || null;
            if (locationID == null) {
                this.ui.start.trigger('change');
                this.ui.end.trigger('change');
                Lampa.trigger("progressBar:hide");
            } else {
                Lampa.trigger("progressBar:show");
                $.when(Lampa.request("location:lessons", locationID).done(function (collection) {
                        if (_this.lessonsRegion) {
                            _this.lessonsRegion.show(new Edit.Lessons({collection: collection}));
                        }
                        Lampa.trigger("progressBar:hide");
                    })
                );
            }
        },
        updateIcon: function (e) {
            if ((this.model.id !== null)) {
                $.when(this.saveModel()).done(function () {
                    Lampa.request('locations:refresh');
                });
            }
        },
        saveEntity: function (e) {
            var _this = this, isNewItem = (this.model.id === null);
            $.when(this.saveModel()).done(function () {
                Lampa.request('locations:refresh');
                if (isNewItem) {
                    Lampa.trigger('location:list');
                }
            });
        }
    });

    Edit.Lesson = Marionette.ItemView.extend({
        template: "location/lesson",
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
        template: "location/lessons",
        childViewContainer: "tbody",
        childView: Edit.Lesson,
        emptyView: Edit.NoLessons,
        ui: {
            "add": "#add-lessons"
        },
        events: {
            "click @ui.add": "addLesson"
        },
        behaviors: {
            GroupDetails: {},
            TeacherDetails: {},
            CourseDetails: {}
        },
        addLesson: function (e) {
            Lampa.trigger("lesson:add", this.model);
        }
    });
});