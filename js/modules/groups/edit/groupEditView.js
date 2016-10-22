/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("GroupsModule.Edit", function (Edit, Lampa, Backbone, Marionette, $, _) {
    Edit.Group = Lampa.EditableItemView.extend({
        template: "group/edit",
        className: "container",
        saveModelRequest: "group:save",
        ui: {
            abbr: "#abbr",
            name: "#name",
            icon: "#icon",
            capacity: "#capacity",
            start: "#start",
            end: "#end",
            description: "#description"
        },
        regions: {
            courseRegion: "#courses",
            studentsRegion: "#students",
            addStudentRegion: "#add-student-modal",
            lessonsRegion: "#lessons"
        },
        events: {
            "click .icon": "changeIcon",
            "click #add-course": "addCourse",
            "change #courseID": "serialize",
            "click #save": "saveEntity",
            "click #back": "goBack",
            "change": "serialize"
        },
        modelEvents: {
            "change:icon": "render updateIcon",
            "change:groupID": "render"
        },
        addCourse: function () {
            Lampa.trigger('course:add');
        },
        changeIcon: function (e) {
            try {
                e.preventDefault();
                e.stopPropagation();
                this.model.set('icon', e.target.dataset['value']);
            }
            catch (ex) {
                console.log(ex.message);
            }
        },
        updateIcon: function () {
            if ((this.model.id !== null)) {
                $.when(this.saveModel()).done(function () {
                    Lampa.request('locations:refresh');
                });
            }
        },
        courses: null,
        setCourses: function (collection) {
            try {
                this.courses = collection;
                if (this.courses.length > 1) {
                    // this.courses.add(Lampa.request("course:empty"));

                    var _this = this;
                    _.forEach(this.courses.models, function (course) {
                        course.set('isSelected', _this.model.get('courseID') == course.get('courseID'));
                    })

                } else if (this.courses.length === 1) {
                    this.model.set('courseID', this.courses.models[0].get('courseID'));
                }
            }
            catch (ex) {
                console.log('error', ex.message);
            }
        },
        behaviors: {
            DateTimePicker: {
                serialize: this.serialize
            }
        },
        newStudent: null,
        onShow: function () {
            Lampa.trigger("progressBar:show");
            var _this = this;
            _this.setSerialisation(false);

            $.when(Lampa.request('course:entities')).done(function (courses) {
                var collection = courses.clone();

                _this.setCourses(collection);
                var coursesView = new Edit.Courses({collection: _this.courses});
                coursesView.courseID = _this.model.get('courseID');
                coursesView.setSelectedValue();
                _this.courseRegion.show(coursesView);
                Lampa.trigger("progressBar:hide");
            });

            var groupID = _this.model.get('groupID');
            if (groupID) {
                $.when(Lampa.request('group:students', groupID)).done(function (collection) {
                    _this.studentsRegion.show(new Edit.Students({collection: collection}));

                    _this.newStudent = Lampa.request('group:student', groupID);
                    _this.newStudent.set('abbr', _this.model.get('abbr'));
                    _this.newStudent.set('name', _this.model.get('name'));

                    var addStudentView = new Edit.AddStudent({
                        model: _this.newStudent.clone()
                    });
                    addStudentView.students = collection;
                    _this.addStudentRegion.show(addStudentView);
                });
                $.when(Lampa.request("group:lessons", groupID).done(function (collection) {
                    _this.lessonsRegion.show(new Edit.GroupLessons({collection: collection}));
                }));
            }
        },
        onRender: function () {
            if (this.courses !== null) {
                var coursesView = new Edit.Courses({
                    collection: this.courses
                });

                if (this.model.get('courseID') == null) {
                    this.ui.start.trigger('change');
                    this.ui.end.trigger('change');
                }

                coursesView.courseID = this.model.get('courseID');
                coursesView.setSelectedValue();
                this.courseRegion.show(coursesView);
            }
        },
        saveEntity: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            var _this = this, isNewItem = (this.model.id === null);

            $.when(this.saveModel()).done(function () {
                Lampa.request('groups:refresh');
                if (isNewItem) {
                    Lampa.trigger('group:list');
                }
            });
        },
        serialize: function () {
            this.model.set("courseID", $("#courseID").val() * 1 || null);
            this.model.set("abbr", this.ui.abbr.val() || '');
            this.model.set("name", this.ui.name.val() || '');
            this.model.set("description", this.ui.description.val() || '');
            this.model.set("capacity", this.ui.capacity.val() * 1 || '');
            this.model.set("start", this.ui.start.val() || null);
            this.model.set("end", this.ui.end.val() || null);
            this.model.set("icon", this.ui.icon.data().value * 1 || 0);

            if (this.model.id !== null) {
                this.saveModel();
                Lampa.request('groups:refresh');
            }
        },
        onBeforeDestroy: function () {
            Lampa.request("group:clean");
            Lampa.request("groups:refresh");
        }
    });

    Edit.Course = Marionette.ItemView.extend({
        template: "course/option",
        tagName: "option",
        attributes: function () {
            var attr = {};
            attr.value = null;
            if (this.model.get('courseID') !== undefined) {
                attr.value = this.model.get('courseID');
            }
            if (this.model.get('isSelected')) {
                attr.selected = 'selected';
            }
            return attr;
        }
    });

    Edit.Courses = Marionette.CollectionView.extend({
        tagName: "select",
        childView: Edit.Course,
        courseID: null,
        className: 'form-control',
        attributes: function () {
            return {'id': 'courseID', 'required': 'required'}
        },
        setSelectedValue: function () {
            try {
                var parent = this;
                _.forEach(this.collection.models, function (course) {
                    course.set('isSelected', parent.courseID == course.get('courseID'));
                })
            } catch (ex) {
                console.log('error', ex.message);
            }
        }
    });

    Edit.Student = Marionette.ItemView.extend({
        template: "group/student",
        tagName: "tr",
        className: "clickable",
        events: {
            "click": "showStudent",
            "click button": "deleteStudent"
        },
        showStudent: function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.target.textContent !== 'x') {
                Lampa.trigger("student:show", this.model);
            }
        },
        deleteStudent: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            var _this = this;
            var message = 'Are You sure? <br/> Remove student ' + this.model.get('fullName') + ' from and all his or her attendance records?';
            Lampa.request('confirm', message, 'danger')
                .then(function (canDelete) {
                    if (canDelete) {
                        _this.model.destroy();
                    }
                });
        }
    });

    Edit.NoStudents = Marionette.ItemView.extend({
        template: "group/students-none",
        tagName: "tr"
    });

    Edit.Students = Marionette.CompositeView.extend({
        template: "group/students",
        className: "numbered",
        childViewContainer: "tbody",
        childView: Edit.Student,
        emptyView: Edit.NoStudents,
        ui: {
            "add": "#add"
        },
        events: {
            "click @ui.add": "addStudent"
        },
        addStudent: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            $('#add-student-modal').modal('show');
        }
    });

    Edit.GroupLesson = Marionette.ItemView.extend({
        template: "group/lesson",
        tagName: "tr",
        className: "clickable",
        behaviors: {
            CourseDetails: {},
            LocationDetails: {},
            TeacherDetails: {}
        },
        events: {
            "click": "showItem"
        },
        showItem: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            Lampa.trigger("lesson:show", this.model.get("lessonID"));
        }
    });

    Edit.NoLessons = Marionette.ItemView.extend({
        template: "group/lessons-none",
        tagName: "tr"
    });

    Edit.GroupLessons = Marionette.CompositeView.extend({
        template: "group/lessons",
        className: "counted",
        childViewContainer: "tbody",
        childView: Edit.GroupLesson,
        emptyView: Edit.NoLessons,
        ui: {
            "add": "#add-lessons"
        },
        events: {
            "click @ui.add": "addLesson"
        },
        behaviors: {
            LocationIcons: {horizontal:true},
            CourseIcons: {horizontal:true},
            TeacherIcons: {horizontal:true}
        },
        addLesson: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            Lampa.trigger("lesson:add", this.model);
        }
    });

    Edit.FoundedStudent = Marionette.ItemView.extend({
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

    Edit.FoundedStudents = Marionette.CollectionView.extend({
        tagName: "tbody",
        className: 'clickable',
        childView: Edit.FoundedStudent
    });

    Edit.AddStudent = Marionette.LayoutView.extend({
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
                    parent.studentsRegion.show(new Edit.FoundedStudents({collection: collection}));
                }
            );
        }
    });
});