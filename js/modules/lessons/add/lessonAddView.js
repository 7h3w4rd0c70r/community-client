/**
 * Created by Roman on 26.8.14.
 */
Lampa.module("LessonsModule.Add", function (Add, Lampa, Backbone, Marionette, $, _) {
    Add.Layout = Marionette.LayoutView.extend({
        template: "lesson/add",
        className: "container",
        regions: {
            batchHead: "#batchHead",
            batchesRegion: "#batches",
            batchLessonsRegion: "#lessons",
            groupRegion: "#group",
            lessonRegion: "#lessons"
        },
        ui: {
            "group": "#group",
            "add": "#add",
            "run": "#run",
            "addTeacher": "#add-teacher",
            "addLocation": "#add-location",
            "saveLessons": "#saveLessons",
            "cleanLessons": "#cleanLessons",
            "cleanSelectedLessons": "#remove-selected-lessons"
        },
        events: {
            "change": "serialize",
            "click #add-group": "goAddGroup",
            "click #back": "goBack",
            "click @ui.run": "runBatch",
            "click @ui.saveLessons": "saveBatch",
            "click @ui.cleanLessons": "cleanLessons",
            "click @ui.cleanSelectedLessons": "cleanSelectedLessons",
            "click @ui.add": "addBatch",
            "click @ui.addTeacher": "goAddTeacher",
            "click @ui.addLocation": "goAddLocation"
        },
        goAddTeacher: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("teacher:add");
        },
        goAddLocation: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("location:add");
        },
        batches: null,
        onShow: function () {
            Lampa.trigger("progressBar:show");
            var parent = this;
            $.when(Lampa.request("group:entities")).done(function (collection) {
                var selection = collection.clone();
                if (selection.length === 1) {
                    parent.model.set("groupID", selection.models[0].get("groupID"));
                }
                parent.groupRegion.show(new Add.Groups({collection: selection}));
            });

            this.batches = Lampa.request("batch:entities", Lampa.request("batch:entity"));
            this.batchesRegion.show(new Add.Batches({collection: this.batches}));
            Lampa.trigger("progressBar:hide");
        },
        getGroupID: function () {
            var id = this.ui.group.find("select :selected").val();
            return (id === "--- select ---") ? null : id * 1;
        },
        getLocationID: function () {
            var id = this.ui.location.find("select :selected").val();
            return (id === "--- select ---") ? null : id * 1;
        },
        getTeachersID: function () {
            return this.ui.teacher.find(":selected").val();
        },
        addBatch: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.batches.add(Lampa.request("batch:entity"));
        },
        runBatch: function (e) {
            try {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                var _this = this;
                Lampa.trigger("progressBar:show");
                $.when(Lampa.request("batches:run", this.batches))
                    .then(function (lessons) {
                        _this.batchLessonsRegion.show(new Add.BatchLessons({collection: lessons}));
                    })
                    .then(function () {
                        Lampa.trigger("progressBar:hide");
                    });
            } catch (ex) {
                Lampa.trigger("progressBar:hide");
                console.log();
            }
        },
        saveBatch: function (e) {
            try {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                var lessons = this.batchLessonsRegion.currentView.collection;
                if (lessons) {
                    Lampa.trigger("progressBar:show");
                    $.when(Lampa.request("lessons:add", lessons)).then(function (result) {
                        Lampa.trigger("progressBar:hide");
                        Lampa.request("alert", result ? "Lessons successfully added." : "error occurred");
                    });
                } else {
                    Lampa.request("alert", "error occurred", "red", "Error");
                }

            } catch (ex) {
                console.log(ex.message);
            }
        },
        cleanLessons: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            this.batchLessonsRegion.currentView.collection.reset();
        },
        cleanSelectedLessons: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            var collection = this.batchLessonsRegion.currentView.collection;
            collection.each(function (lesson) {
                if (lesson.get("isSelected")) {
                    collection.remove(lesson);
                }
            });
        },
        goBack: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            window.history.back();
        },
        goAddGroup: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("group:add");
        }
    });

    Add.Batch = Marionette.LayoutView.extend({
        template: "lesson/batch",
        tagName: "tr",
        behaviors: {
            DateTimePicker: {serialize: this.serialize},
            Tooltips: {}
        },
        regions: {
            locationsRegion: ".location",
            teachersRegion: ".teacher"
        },
        onShow: function () {
            Lampa.trigger("progressBar:show");
            var parent = this;

            $.when(Lampa.request("teacher:entities")).done(function (collection) {
                var selection = collection.clone();
                if (selection.length > 1) {
                    selection.add(Lampa.request("teacher:empty"));
                }
                selection.sort();
                parent.teachersRegion.show(new Add.Teachers({collection: selection}));
            });

            $.when(Lampa.request("location:entities")).done(function (collection) {
                var selection = collection.clone();
                if (selection.length > 1) {
                    selection.add(Lampa.request("location:empty"));
                }
                selection.sort();
                parent.locationsRegion.show(new Add.Locations({collection: selection}));
            });
        },
        ui: {
            "day": ".day-of-week",
            "location": ".location",
            "person": ".teacher",
            "duration": ".duration",
            "start": ".start-day",
            "end": ".end-day",
            "time": ".start-time",
            "frequency": ".frequency"
        },
        events: {
            "click button": "delete",
            "change": "serialize"
        },
        delete: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.model.destroy();
        },
        serialize: function () {
            this.model.set("groupID", Number($("#groupID").val()));
            this.model.set("dayOfWeek", Number(this.ui.day.val()));

            var startTime = this.ui.time.val();
            var duration = Number(this.ui.duration.val());
            var endTime = Lampa.request("helper:toTime", 0, Lampa.request("helper:toMinutes", startTime) + duration);

            this.model.set("startTime", startTime);
            this.model.set("endTime", endTime);
            this.model.set("startDate", this.ui.start.val());
            this.model.set("endDate", this.ui.end.val());
            this.model.set("frequency", Number(this.ui.frequency.val()));
            this.model.set("locationID", Number(this.locationsRegion.currentView.el.value));
            this.model.set("teacherID", Number(this.teachersRegion.currentView.el.value));
        }
    });

    Add.Batches = Marionette.CompositeView.extend({
        template: "lesson/batches",
        childView: Add.Batch,
        childViewContainer: "tbody"
    });

    Add.Group = Marionette.ItemView.extend({
        template: "group/option",
        tagName: "option",
        attributes: function () {
            var attr = {};
            attr.value = null;
            if (this.model.get("groupID")) {
                attr.value = this.model.get("groupID");
            }
            return attr;
        }
    });

    Add.Groups = Marionette.CollectionView.extend({
        tagName: "select",
        className: "form-control",
        childView: Add.Group,
        childViewContainer: "select",
        attributes: {id: "groupID"}
    });

    Add.Location = Marionette.ItemView.extend({
        template: "location/option",
        tagName: "option",
        attributes: function () {
            var attr = {};
            attr.value = null;
            if (this.model.get("locationID")) {
                attr.value = this.model.get("locationID");
            }
            if (this.model.get("isSelected")) {
                attr.selected = "selected";
            }
            return attr;
        }
    });

    Add.Locations = Marionette.CollectionView.extend({
        tagName: "select",
        className: "form-control locationID",
        childView: Add.Location,
        childViewContainer: "select",
        ui: {
            "location": ".locationID"
        }
    });

    Add.Teacher = Marionette.ItemView.extend({
        template: "teacher/option",
        tagName: "option",
        attributes: function () {
            try {
                var attr = {};
                attr.value = null;

                if (this.model.get("personID")) {
                    attr.value = this.model.get("personID");
                }

                if (this.model.get("isSelected")) {
                    attr.selected = "selected";
                }

                return attr;
            } catch (ex) {
                return "";
            }
        }
    });

    Add.Teachers = Marionette.CollectionView.extend({
        tagName: "select",
        className: "form-control teacherID",
        attributes: {"required": "true"},
        childView: Add.Teacher,
        childViewContainer: "select"
    });

    Add.BatchDay = Marionette.ItemView.extend({
        template: "lesson/day-edit-template",
        tagName: "div",
        min: null,
        max: null
    });

    Add.Time = Marionette.ItemView.extend({
        template: "lesson/time-edit-template",
        min: null,
        max: null
    });

    Add.Lesson = Marionette.ItemView.extend({
        tagName: "span",
        className: function () {
            try {
                var r = "lesson ";
                r += " " + Lampa.request("helper:getStatusClass", this.model.get("status"),
                        Lampa.request("helper:getUserRole"),
                        Lampa.request("helper:getDateFromJSON", this.model.get("start")));
                return r;
            } catch (ex) {
                console.log(ex.message);
            }

            return "lesson";
        },
        template: "lesson/grid-item",
        events: {
            "click": "showItem"
        },
        showItem: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("lesson:show", this.model.get("lessonID"));
        },
        attributes: function () {
            var a = {};
            if (this.model) {
                var start = Lampa.request("helper:getDateFromJSON", this.model.get("start"));
                var end = Lampa.request("helper:getDateFromJSON", this.model.get("end"));
                var startTime = Lampa.request("school:startTime");
                var endTime = Lampa.request("school:endTime");

                a.style = "left:" + Lampa.request("helper:getLessonPosition", start, startTime, endTime) + "%;";
                a.style += "width:" + Lampa.request("helper:getLessonWidth", start, end, startTime, endTime) + "%;";
            }
            return a;
        }
    });

    Add.Lessons = Marionette.CollectionView.extend({
        tagName: "div",
        template: "lesson/lesson-grid-day-lessons-template",
        childView: Add.Lesson,
        childViewContainer: "table"
    });

    Add.ConflictedGroupLesson = Marionette.ItemView.extend({
        template: "lesson/conflict-group",
        tagName: "span",
        class: "clickable",
        events: {
            "click": "open"
        },
        open: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("lesson:show", this.model.id);
        }
    });

    Add.ConflictedGroupLessons = Marionette.CollectionView.extend({
        childView: Add.ConflictedGroupLesson,
        tagName: "span"
    });

    Add.ConflictedLocationLesson = Marionette.ItemView.extend({
        template: "lesson/conflict-location",
        tagName: "span",
        class: "clickable",
        events: {
            "click": "open"
        },
        open: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("lesson:show", this.model.id);
        }
    });

    Add.ConflictedLocationLessons = Marionette.CollectionView.extend({
        childView: Add.ConflictedLocationLesson,
        tagName: "span"
    });

    Add.ConflictedTeacherLesson = Marionette.ItemView.extend({
        template: "lesson/conflict-teacher",
        tagName: "span",
        class: "clicable",
        events: {
            "click": "open"
        },
        open: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("lesson:show", this.model.id);
        }
    });

    Add.ConflictedTeacherLessons = Marionette.CollectionView.extend({
        childView: Add.ConflictedTeacherLesson,
        tagName: "span",
        behaviors: {
            CourseIcons: {horizontal: true},
            GroupIcons: {horizontal: true},
            LocationIcons: {horizontal: true},
            TeacherIcons: {horizontal: true}
        }
    });

    Add.BatchLesson = Marionette.LayoutView.extend({
        tagName: "tr",
        template: "lesson/new-list-item",
        events: {
            "click .delete": "deleteBatch",
            "click .open": "showItem"
        },
        modelEvents: {
            "change:lessonID": "render"
        },
        regions: {
            groupRegion: ".group-conflicts",
            locationRegion: ".location-conflicts",
            teachersRegion: ".teachers-conflicts"
        },
        deleteBatch: function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (this.model.get("lessonID")) {
                this.model.destroy();
            }
        },
        showItem: function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (this.model.get("lessonID")) {
                Lampa.trigger("lesson:show", this.model.get("lessonID"));
            }
        },
        onRender: function () {
            var _this = this;
            var lessonID = this.model.get("lessonID");

            $.when(Lampa.request("lesson:conflict:group", lessonID, this.model.get("groupID"), this.model.get("start"), this.model.get("end"))).done(function (conflicts) {
                _this.groupRegion.show(new Add.ConflictedGroupLessons({collection: conflicts}));
            });
            $.when(Lampa.request("lesson:conflict:location", lessonID, this.model.get("locationID"), this.model.get("start"), this.model.get("end"))).done(function (conflicts) {
                _this.locationRegion.show(new Add.ConflictedLocationLessons({collection: conflicts}));
            });

            _.forEach(this.model.get("teachers"), function (teacher) {
                $.when(Lampa.request("lesson:conflict:teachers", lessonID, teacher.personID, _this.model.get("start"), _this.model.get("end"))).done(function (conflicts) {
                    _this.teachersRegion.show(new Add.ConflictedTeacherLessons({collection: conflicts}));
                });
            });
        }
    });

    Add.BatchLessons = Marionette.CompositeView.extend({
        childView: Add.BatchLesson,
        childViewContainer: "tbody",
        template: "lesson/new-list",
        className: "numbered",
        behaviors: {
            CourseIcons: {show: false, horizontal: true},
            GroupIcons: {show: false},
            LocationIcons: {show: false},
            TeacherIcons: {show: false}
        },
        collectionEvents: {
            "add": "showIcons"
        },
        showIcons: function () {
            this.triggerMethod("ShowAllIcons");
        }
    });

    Add.Day = Marionette.ItemView.extend({
        tagName: "div",
        template: "lesson/lesson-grid-day-template",
        className: "item"
    });

    Add.Days = Marionette.CollectionView.extend({
        template: "lesson/lesson-grid-days-template",
        childView: Add.Day,
        childViewContainer: "div",
        initialize: function () {
            try {
                if (this.collection !== undefined) {
                    this.listenTo(this.collection, "new", this.alert, this);
                    this.listenTo(this.collection, "change", this.alert, this);
                    this.listenTo(this.collection, "reset", this.alert, this);
                    this.listenTo(this.collection, "add", this.alert, this);
                    this.listenTo(this.collection, "remove", this.alert, this);
                }
            } catch (ex) {
                console.log(ex.message);
            }
        }
    });

    Add.Hour = Marionette.ItemView.extend({
        tagName: "span",
        template: "lesson/lesson-grid-hour-template",
        className: "hour",
        attributes: function () {
            var a = {};
            if (this.model !== undefined) {
                var start = Lampa.request("helper:getDateFromJSON", "2000-01-01 " + this.toTime(this.model.get("hour_start"), 0));
                var end = Lampa.request("helper:getDateFromJSON", "2000-01-01 " + this.toTime(this.model.get("hour_end"), 0));
                var startTime = Lampa.request("period:startTime");
                var endTime = Lampa.request("period:endTime");

                a.style = "left:" + Lampa.request("helper:getLessonPosition", start, startTime, endTime) + "%;";
                a.style += "width:" + Lampa.request("helper:getLessonWidth", start, end, startTime, endTime) + "%;";
            }
            return a;
        }
    });

    Add.Hours = Marionette.CollectionView.extend({
        template: "lesson/lesson-grid-hours-template",
        childView: Add.Hour,
        childViewContainer: "span"
    });
});