/**
 * Created by Roman on 23.5.14.
 */
Lampa.module("LessonsModule.Grid", function (Grid, Lampa, Backbone, Marionette, $) {
    Grid.Layout = Marionette.LayoutView.extend({
        hours: null,
        days: null,
        template: "lesson/grid",
        regions: {
            daysRegion: "#days",
            addLessonRegion: "#add-lesson",
            buttonRegion: "#buttons"
        },
        events: {
            "click #back": "goBack"
        },
        goBack: function () {
            window.history.back();
        },
        onShow: function () {
            if (Lampa.request("helper:isAdmin")) {
                this.addLessonRegion.show(new Grid.AddLesson(this.model));
            }
        },
        behaviors: {
            CourseIcons: {show: false, icon: false},
            GroupIcons: {show: false},
            LocationIcons: {show: false},
            TeacherIcons: {show: false}
        }
    });

    Grid.Lesson = Marionette.ItemView.extend({
        template: "lesson/grid-item",
        tagName: "span",
        className: function () {
            return "clickable lesson " +
                Lampa.request("helper:getStatusClass",
                    this.model.get("status"), // lesson status
                    Lampa.request("helper:getUserRole"), // role
                    Lampa.request("helper:getDateFromJSON", this.model.get("start") // day
                    ));
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
        },
        attributes: function () {
            var a = {};
            if (this.model) {
                var start = Lampa.request("helper:getDateFromJSON", this.model.get("start"));
                var end = Lampa.request("helper:getDateFromJSON", this.model.get("end"));
                var startTime = Lampa.request("school:startTime");
                var endTime = Lampa.request("school:endTime");
                a.style = "left:" + Lampa.request("helper:getLessonPosition", start, startTime, endTime) + "%;"
                    + "width:" + Lampa.request("helper:getLessonWidth", start, end, startTime, endTime) + "%;";
            }
            return a;
        }
    });

    Grid.Lessons = Marionette.CollectionView.extend({
        childView: Grid.Lesson,
        childViewContainer: "ul"
    });

    Grid.Group = Marionette.ItemView.extend({
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

    Grid.Groups = Marionette.CollectionView.extend({
        tagName: "select",
        className: "form-control",
        childView: Grid.Group,
        childViewContainer: "select",
        attributes: {id: "groupID"}
    });

    Grid.Location = Marionette.ItemView.extend({
        template: "location/option",
        tagName: "option",
        attributes: function () {
            var attr = {};
            attr.value = null;
            if (this.model.get("locationID")) {
                attr.value = this.model.get("locationID");
            }
            return attr;
        }
    });

    Grid.Locations = Marionette.CollectionView.extend({
        tagName: "select",
        className: "form-control",
        childView: Grid.Location,
        childViewContainer: "select",
        attributes: {id: "locationID"}
    });

    Grid.Teacher = Marionette.ItemView.extend({
        template: "teacher/option",
        tagName: "option",
        attributes: function () {
            try {
                var attr = {};
                attr.value = null;

                if (this.model.get("personID")) {
                    attr.value = this.model.get("personID");
                }

                return attr;
            } catch (ex) {
                return "";
            }
        }
    });

    Grid.Teachers = Marionette.CollectionView.extend({
        tagName: "select",
        className: "form-control",
        attributes: function () {
            return {"id": "teacherID", "required": "true"};
        },
        childView: Grid.Teacher,
        childViewContainer: "select"
    });

    Grid.AddLesson = Marionette.LayoutView.extend({
        template: "lesson/addOne",
        className: "modal-dialog",
        ui: {
            "add": "#button-add",
            "group": "#group",
            "location": "#location",
            "duration": "#duration",
            "lessonDay": "#lesson-day",
            "lessonTime": "#lesson-time",
            "teacher": "#teacher"
        },
        behaviors: {
            DateTimePicker: {serialize: this.serialize}
        },
        regions: {
            groupRegion: "#group",
            locationRegion: "#location",
            courseRegion: "#course",
            teacherRegion: "#teacher"
        },
        events: {
            "click @ui.add": "saveLesson",
            "click @ui.addGroup": "addGroup"
        },
        parent: null,
        onShow: function () {
            this.model = Lampa.request("lesson:new");
            this.setGroupSelection();
            this.setLocationSelection();
            this.setTeacherSelection();
        },
        setGroupSelection: function () {
            var _this = this;
            $.when(Lampa.request("group:entities")).done(function (collection) {
                var selection = collection.clone();
                if (selection.length === 1) {
                    _this.model.set("groupID", selection.models[0].get("groupID"));
                }
                _this.groupRegion.show(new Grid.Groups({collection: selection}));
            });
        },
        setLocationSelection: function () {
            var _this = this;
            $.when(Lampa.request("location:entities")).done(function (collection) {
                var selection = collection.clone();
                if (selection.length === 1) {
                    _this.model.set("locationID", selection.models[0].get("locationID"));
                }
                _this.locationRegion.show(new Grid.Locations({collection: selection}));
            });
        },
        setTeacherSelection: function () {
            var _this = this;
            $.when(Lampa.request("teacher:entities")).done(function (collection) {
                var selection = collection.clone();
                if (selection.length === 1) {
                    _this.model.set("teacherID", selection.models[0].get("teacherID"));
                }
                _this.teacherRegion.show(new Grid.Teachers({collection: selection}));
            });
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
        getDuration: function () {
            return this.ui.duration.val();
        },
        getLessonDay: function () {
            return this.ui.lessonDay.val();
        },
        getLessonTime: function () {
            return this.ui.lessonTime.val();
        },
        saveLesson: function () {
            var parent = this;
            var model = this.model.clone();

            var groupID = this.getGroupID();
            model.set("groupID", groupID);
            model.set("locationID", this.getLocationID());
            model.set("teachers", [{personID: this.getTeachersID()}]);

            var lessonTime = this.getLessonTime();
            var lessonDay = this.getLessonDay();

            model.set("start", lessonDay + " " + lessonTime);
            model.set("end", Lampa.request("helper:getEnd", lessonDay, lessonTime, this.getDuration()));

            $.when(Lampa.request("group:entity", groupID)).done(function (group) {
                model.set("courseID", group.get("courseID"));
                $.when(Lampa.request("lesson:save", model)).done(function (lesson) {
                    Lampa.trigger("lesson:show", lesson.id);
                });
            });
        }
    });

    Grid.Day = Marionette.LayoutView.extend({
        template: "lesson/grid-day",
        className: "item",
        events: {
            "click": "addLesson"
        },
        addLesson: function (e) {
            if (Lampa.request("helper:isAdmin")) {
                // console.log(e.offsetX, e.screenX);
                $("#lesson-day").val(this.model.get("day"));
                $("#lesson-time").val(Lampa.request("helper:getTimeFromClickPosition", e.offsetX, e.screenX, 6, 20));
                $("#duration").val("60");
                $("#add-lesson").modal("show");
            }
        }
    });

    Grid.Days = Marionette.CollectionView.extend({
        childView: Grid.Day,
        childViewContainer: "span",
        afterRender: function () {
            $(".history").last().focus();
            //$(".now").focus();
        }
    });

    Grid.Hour = Marionette.ItemView.extend({
        tagName: "span",
        template: "lesson/grid-hour",
        className: "hour",
        attributes: function () {
            var a = {};
            if (this.model) {
                var start = Lampa.request("helper:getDateFromJSON", "2000-01-01 " + this.model.get("hour_start") + ":00");
                var end = Lampa.request("helper:getDateFromJSON", "2000-01-01 " + this.model.get("hour_end") + ":00");
                var startTime = Lampa.request("school:startTime");
                var endTime = Lampa.request("school:endTime");

                a.style = "left:" + Lampa.request("helper:getLessonPosition", start, startTime, endTime) + "%;" +
                    "width:" + Lampa.request("helper:getLessonWidth", start, end, startTime, endTime) + "%;";
            }
            return a;
        }
    });

    Grid.Hours = Marionette.CollectionView.extend({
        childView: Grid.Hour,
        childViewContainer: "span",
        className: "time-line"
    });
});