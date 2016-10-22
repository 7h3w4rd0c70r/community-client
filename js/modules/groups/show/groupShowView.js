/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("GroupsModule.Show", function (Show, Lampa, Backbone, Marionette, $, _) {
    Show.Group = Marionette.LayoutView.extend({
        template: "group/show",
        className: "container",
        regions: {
            studentsRegion: "#students",
            lessonsRegion: "#lessons",
            addStudentRegion: "#add-student-modal"
        },
        events: {
            "click #edit": "editItem",
            "click #delete": "deleteItem",
            "click #back": "goBack"
        },
        goBack: function (e) {
            e.preventDefault();
            e.stopPropagation();
            window.history.back();
        },
        editItem: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("group:edit", this.model);
        },
        deleteItem: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.request("group:delete", this.model);
        },
        newStudent: null,
        onShow: function () {
            Lampa.trigger("progressBar:show");
            var _this = this;

            var groupID = _this.model.get('groupID');
            if (groupID) {
                $.when(Lampa.request('group:students', groupID))
                    .then(function (collection) {
                        _this.studentsRegion.show(new Show.Students({collection: collection}));

                        _this.newStudent = Lampa.request('group:student', groupID);
                        _this.newStudent.set('abbr', _this.model.get('abbr'));
                        _this.newStudent.set('name', _this.model.get('name'));

                        var addStudentView = new Show.AddStudent({
                            model: _this.newStudent.clone()
                        });

                        addStudentView.students = collection;
                        _this.addStudentRegion.show(addStudentView);
                    });

                $.when(Lampa.request("group:lessons", groupID))
                    .then(function (collection) {
                        _this.lessonsRegion.show(new Show.GroupLessons({collection: collection}));
                    });
            }
        }
    });

    Show.FoundedStudent = Marionette.ItemView.extend({
        template: "group/foundStudent",
        tagName: "tr",
        events: {
            "click ": "addStudentToGroup"
        },
        addStudentToGroup: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            $("#fullName").val(this.model.get("fullName"));
            $("#email").val(this.model.get("email"));
            $("#personID").val(this.model.get("personID"));
        }
    });

    Show.FoundedStudents = Marionette.CollectionView.extend({
        tagName: "tbody",
        className: 'clickable',
        childView: Show.FoundedStudent
    });

    Show.AddStudent = Marionette.LayoutView.extend({
        template: "group/addStudent",
        className: "modal-dialog",
        regions: {
            studentsRegion: "table"
        },
        behaviors: {
            DateTimePicker: {}
        },
        students: null,
        ui: {
            "personID": "#personID",
            "fullName": "#fullName",
            "email": "#email",
            "start": "#start",
            "end": "#end",
            "add": "#button-add"
        },
        events: {
            "click @ui.add": "addStudentToGroup",
            "change @ui.fullName": "searchStudent"
        },
        addStudentToGroup: function (e) {
            try {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                if (this.ui.fullName.val() == '' || this.ui.email.val() == '') {
                    return;
                }

                var model = this.model.clone();
                model.set('personID', this.ui.personID.val() * 1);
                model.set('fullName', this.ui.fullName.val());
                model.set('email', this.ui.email.val());
                model.set('start', this.ui.start.val());
                model.set('end', this.ui.end.val());
                model.unset('name');
                model.unset('abbr');

                if (this.students !== null) {
                    this.students.add(model);
                }
                model.save();
                this.ui.personID.val(null);
                this.ui.fullName.val('');
                this.ui.email.val('');

            } catch (ex) {
                Lampa.Error(ex);
            }
        },
        searchStudent: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            var parent = this;
            $.when(Lampa.request("student:search", this.collection, this.ui.fullName.val())).done(
                function (collection) {
                    if (collection) {
                        parent.studentsRegion.show(new Show.FoundedStudents({collection: collection}));
                    }
                }
            );
        }
    });

    Show.Student = Marionette.ItemView.extend({
        template: "group/student",
        tagName: "tr",
        className: 'clickable',
        events: {
            "click ": "showStudent",
            "click button": "deleteStudent"
        },
        showStudent: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("student:show", this.model);
        },
        deleteStudent: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            var _this = this;
            var message = 'Are You sure? <br/> You are removing student ' + this.model.get('fullName') + ' from group and all his or her attendance records?';
            Lampa.request('confirm', message, 'danger')
                .then(function (canDelete) {
                    if (canDelete) {
                        _this.model.destroy();
                    }
                });
        }
    });

    Show.NoStudents = Marionette.ItemView.extend({
        template: "group/students-none",
        tagName: "tr"
    });

    Show.Students = Marionette.CompositeView.extend({
        template: "group/students",
        className: "numbered",
        childViewContainer: "tbody",
        childView: Show.Student,
        emptyView: Show.NoStudents,
        ui: {
            "add": "#add"
        },
        events: {
            "click @ui.add": "addStudent"
        },
        addStudent: function (e) {
            e.preventDefault();
            e.stopPropagation();
            $("#add-student-modal").modal("show");
        }
    });

    Show.GroupLesson = Marionette.ItemView.extend({
        template: "group/lesson",
        tagName: "tr",
        className: function () {
            return "clickable ".concat(Lampa.request("helper:getStatusClass", this.model.get("status"), "admin", this.model.get("start")), "-row");
        },
        behaviors: {
            TeacherDetails: {},
            CourseDetails: {},
            LocationDetails: {}
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

    Show.NoLessons = Marionette.ItemView.extend({
        template: "group/lessons-none",
        tagName: "tr"
    });

    Show.GroupLessons = Marionette.CompositeView.extend({
        template: "group/lessons",
        childViewContainer: "tbody",
        childView: Show.GroupLesson,
        emptyView: Show.NoLessons,
        ui: {
            "add": "#add-lessons"
        },
        events: {
            "click @ui.add": "addLesson"
        },
        behaviors: {
            LocationIcons: {horizontal: true},
            CourseIcons: {horizontal: true},
            TeacherIcons: {horizontal: true}
        },
        addLesson: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("lesson:add", this.model);
        }
    });
});