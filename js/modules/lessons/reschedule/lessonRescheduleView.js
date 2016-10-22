/**
 * Created by Roman on 24.9.14.
 */

Lampa.module("LessonsModule.Reschedule", function (Reschedule, Lampa, Backbone, Marionette, $, _) {
    Reschedule.Layout = Lampa.EditableItemView.extend({
        template: "lesson/reschedule",
        className: "container",
        saveModelRequest: "lesson:save",
        regions: {
            statusTimeRegion: "#status-time",
            groupRegion: "#group",
            locationRegion: "#location",
            courseRegion: "#course",
            teacherRegion: "#teachers",
            newGroupRegion: "#new-group",
            newCourseRegion: "#new-course",
            newLocationRegion: "#new-location",
            newTeacherRegion: "#new-teacher",
            conflictsRegion: "#lessons-in-conflict"
        },
        ui: {
            "day": "#new-day",
            "start": "#new-start",
            "end": "#new-end",
            "group": "#new-group",
            "course": "#new-course",
            "location": "#new-location",
            "teacher": "#new-teacher"
        },
        events: {
            "click #save": "doReschedule",
            "click #back": "goBack"
        },
        doReschedule: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            var _this = this;
            this.model.set("action", "reschedule");
            this.serialize();
            Lampa.trigger("progressBar:show");
            $.when(this.saveModel()).then(function () {
                _this.render();
                Lampa.trigger("progressBar:hide");
            });
        },
        serialize: function () {
            try {
                Lampa.trigger("progressBar:show");
                this.model.set("start", this.ui.day.val() + " " + this.ui.start.val());
                this.model.set("end", this.ui.day.val() + " " + this.ui.end.val());
                this.model.set("groupID", this.ui.group.children("select").val());
                this.model.set("locationID", this.ui.location.children("select").val());

                var teachers = [];
                this.newTeacherRegion.currentView.collection.where({isChecked: true}).forEach(function (teacher) {
                    teachers.push({"personID": teacher.get("personID")});
                });

                this.model.set("teachers", teachers);
                Lampa.trigger("progressBar:hide");
            } catch (ex) {
                console.log(ex.message);
            }
        },
        onRender: function () {
            var _this = this;
            Lampa.trigger("progressBar:show");
            var lessonID = _this.model.get("lessonID");
            var groupID = _this.model.get("groupID");
            var locationID = _this.model.get("locationID");

            try {
                $.when(Lampa.request("lesson:neighbours", lessonID))
                    .then(function (model) {
                        _this.groupRegion.show(new Reschedule.LessonGroup({model: model}));
                    });

                $.when(Lampa.request("location:entity", _this.model.get("locationID")))
                    .then(function (model) {
                        _this.locationRegion.show(new Reschedule.LessonLocation({model: model}));
                    });

                $.when(Lampa.request("course:entity", _this.model.get("courseID")))
                    .then(function (model) {
                        _this.courseRegion.show(new Reschedule.LessonCourse({model: model}));
                    });

                $.when(Lampa.request("lesson:teachers", lessonID))
                    .then(function (collection) {
                        var lessonTeachers = collection.clone();
                        _this.teacherRegion.show(new Reschedule.LessonTeachers({collection: lessonTeachers}));
                        $.when(Lampa.request("teacher:entities"))
                            .then(function (allTeachers) {
                                try {
                                    lessonTeachers.each(function (model) {
                                        model.set("isChecked", false);
                                    });

                                    var isChecked;
                                    allTeachers.each(function (someTeacher) {
                                        isChecked = false;
                                        lessonTeachers.each(function (teacher) {
                                            if (someTeacher.get("personID") === teacher.get("personID")) {
                                                isChecked = true;
                                            }
                                        });
                                        someTeacher.set("isChecked", isChecked);
                                    });

                                    _this.newTeacherRegion.show(new Reschedule.Teachers({collection: allTeachers}));
                                } catch (ex) {
                                    console.log(ex.message);
                                }
                            });
                    });

                $.when(Lampa.request("group:entities")).done(function (collection) {
                    try {
                        var groups = collection.clone();
                        groups.each(function (model) {
                            if (groupID === model.get("groupID")) {
                                model.set("isSelected", true);
                            } else {
                                model.set("isSelected", false);
                            }
                        });

                        _this.newGroupRegion.show(new Reschedule.Groups({collection: groups}));
                    } catch (ex) {
                        console.log(ex.message);
                    }
                });

                $.when(Lampa.request("location:entities")).done(function (collection) {
                    try {
                        var locations = collection.clone();
                        locations.each(function (model) {
                            if (locationID === model.get("locationID")) {
                                model.set("isSelected", true);
                            } else {
                                model.set("isSelected", false);
                            }
                        });
                        _this.newLocationRegion.show(new Reschedule.Locations({collection: locations}));
                    } catch (ex) {
                        console.log(ex.message);
                    }
                });

                _this.statusTimeRegion.show(new Reschedule.LessonStatusTime({model: _this.model}));
                Lampa.trigger("progressBar:hide");
            } catch (ex) {
                console.log(ex.message);
            }
        }
    });

    Reschedule.LessonStatusTime = Marionette.ItemView.extend({
        template: "lesson/bar-status-time",
        className: "panel panel-default",
        modelEvents: {"change:status": "render"}
    });

    Reschedule.LessonGroup = Marionette.ItemView.extend({
        template: "lesson/bar-group",
        modelEvents: {"change:groupID": "render"},
        events: {
            "click .clickable": "show"
        },
        show: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            Lampa.trigger("group:show", this.model.get("groupID"));
        }
    });

    Reschedule.LessonLocation = Marionette.ItemView.extend({
        template: "lesson/bar-location",
        modelEvents: {"change:locationID": "render"},
        className: "clickable",
        events: {
            "click": "show"
        },
        show: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            Lampa.trigger("location:show", this.model.get("locationID"));
        }
    });

    Reschedule.LessonCourse = Marionette.ItemView.extend({
        template: "lesson/bar-course",
        className: "panel-default, clickable",
        events: {
            "click": "show"
        },
        show: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            Lampa.trigger("course:show", this.model.get("courseID"));
        },
        modelEvents: {"change:courseID": "render"}
    });

    Reschedule.LessonNeighbours = Marionette.ItemView.extend({
        template: "lesson/neighbours"
    });

    Reschedule.LessonTeacher = Marionette.ItemView.extend({
        template: "lesson/bar-teacher",
        className: "box last-box col-xs-6 col-sm-3",
        events: {
            "click .clickable": "show"
        },
        show: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            Lampa.trigger("teacher:show", this.model.get("personID"));
        }
    });

    Reschedule.LessonTeachers = Marionette.CollectionView.extend({
        childView: Reschedule.LessonTeacher,
        collectionEvents: {
            "change": "render"
        }
    });

    Reschedule.Course = Marionette.ItemView.extend({
        template: "course/option",
        tagName: "option",
        attributes: function () {
            var attr = {};
            if (this.model.get("courseID")) {
                attr.value = this.model.get("courseID");
            }
            if (this.model.get("isSelected") === true) {
                attr.selected = "selected";
            }
            return attr;
        }
    });

    Reschedule.Courses = Marionette.CollectionView.extend({
        tagName: "select",
        className: "form-control",
        childView: Reschedule.Course,
        childViewContainer: "select",
        itemSelected: null
    });

    Reschedule.Location = Marionette.ItemView.extend({
        template: "location/option",
        tagName: "option",
        attributes: function () {
            var attr = {};
            if (this.model.get("locationID")) {
                attr.value = this.model.get("locationID");
            }
            if (this.model.get("isSelected") === true) {
                attr.selected = "selected";
            }
            return attr;
        }
    });

    Reschedule.Locations = Marionette.CollectionView.extend({
        tagName: "select",
        className: "form-control",
        childView: Reschedule.Location,
        childViewContainer: "select"
    });

    Reschedule.Group = Marionette.ItemView.extend({
        template: "group/option",
        tagName: "option",
        attributes: function () {
            var attr = {};
            if (this.model.get("groupID")) {
                attr.value = this.model.get("groupID");
            }
            if (this.model.get("isSelected") === true) {
                attr.selected = "selected";
            }
            return attr;
        }
    });

    Reschedule.Groups = Marionette.CollectionView.extend({
        tagName: "select",
        className: "form-control",
        childView: Reschedule.Group,
        childViewContainer: "select"
    });

    Reschedule.Teacher = Marionette.ItemView.extend({
        template: "lesson/teacher-checkbox",
        className: "checkbox",
        events: {
            click: "checkTeacher"
        },
        checkTeacher: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            this.model.set("isChecked", Lampa.request("helper:getOppositeValue", this.model.get("isChecked")));
        },
        modelEvents: {
            change: "render"
        }
    });

    Reschedule.Teachers = Marionette.CollectionView.extend({
        template: "lesson/teacher-select-template",
        childView: Reschedule.Teacher,
        collectionEvents: {
            change: "render"
        }
    });

    Reschedule.NoConflicts = Marionette.ItemView.extend({
        template: "lesson/none"
    });

    Reschedule.ConflictedLesson = Marionette.ItemView.extend({
        template: "lesson/grid-item",
        className: "lesson",
        tagName: "span",
        events: {
            "click": "showItem"
        },
        showItem: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            Lampa.trigger("lesson:show", this.model.get("lessonID"));
        },
        attributes: function () {
            var a = {};
            if (this.model) {
                var start = Lampa.request("helper:getDateFromJSON", this.model.get("start"));
                var end = Lampa.request("helper:getDateFromJSON", this.model.get("end"));
                var startTime = Lampa.request("school:startTime");
                var endTime = Lampa.request("school:endTime");
                a.style = "left:" + Lampa.request("helper:getLessonPosition", start, startTime, endTime) + "%;" + "width:" + Lampa.request("helper:getLessonWidth", start, end, startTime, endTime) + "%;";
            }
            return a;
        }
    });

    Reschedule.ConflictedGroupLessons = Marionette.CollectionView.extend({
        childView: Reschedule.ConflictedLesson,
        className: "item-lessons"
    });

    Reschedule.ConflictedLocationLessons = Marionette.CollectionView.extend({
        childView: Reschedule.ConflictedLesson,
        className: "item-lessons"
    });

    Reschedule.ConflictedTeacherLessons = Marionette.CollectionView.extend({
        childView: Reschedule.ConflictedLesson,
        className: "item-lessons"
    });

    Reschedule.LessonConflicts = Marionette.LayoutView.extend({
        template: "lesson/conflicts",
        modelEvents: {
            "change": "render"
        },
        regions: {
            groupConflictRegion: ".group-conflicts",
            locationConflictRegion: ".location-conflicts",
            teachersConflictRegion: ".teachers-conflicts"
        },
        ui: {
            "group": ".group-conflicts",
            "location": ".location-conflicts",
            "teachers": ".teachers-conflicts"
        },
        onRender: function () {
            var _this = this;
            var lessonID = this.model.get("lessonID");
            $.when(Lampa.request("lesson:conflict:group", lessonID, this.model.get("groupID"), this.model.get("start"), this.model.get("end"))).done(function (conflicts) {
                _this.groupConflictRegion.show(new Reschedule.ConflictedGroupLessons({collection: conflicts}));
                if (conflicts.length === 0) {
                    _this.ui.group.fadeOut();
                }
            });
            $.when(Lampa.request("lesson:conflict:location", lessonID, this.model.get("locationID"), this.model.get("start"), this.model.get("end"))).done(function (conflicts) {
                var view = new Reschedule.ConflictedLocationLessons({collection: conflicts});
                _this.locationConflictRegion.show(view);
                if (conflicts.length === 0) {
                    _this.ui.group.fadeOut();
                }
            });
            _.forEach(this.model.get("teachers"), function (teacher) {
                $.when(Lampa.request("lesson:conflict:teachers", lessonID, teacher.personID, _this.model.get("start"), _this.model.get("end"))).done(function (conflicts) {
                    _this.teachersConflictRegion.show(new Reschedule.ConflictedTeacherLessons({collection: conflicts}));
                    if (conflicts.length === 0) {
                        _this.ui.group.fadeOut();
                    }
                });
            });
        }
    });
});
