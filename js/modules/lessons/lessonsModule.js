/**
 * Created by Roman on 2.6.14.
 */

Lampa.module("LessonsModule", function (LessonsModule, Lampa, Backbone, Marionette, $, _) {
    LessonsModule.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "lesson/list": "showList",
            "lesson/grid": "showGrid",
            "lesson/find": "findLessons",
            "lesson/timetable": "showTimetable",
            "lesson/timetable-teacher": "showTimetableTeacher",
            "lesson/timetable-location": "showTimetableLocation",
            "lesson/daily-groups-timetable": "showDailyGroupsTimetable",
            "lesson/daily-teachers-timetable": "showDailyTeachersTimetable",
            "lesson/daily-locations-timetable": "showDailyLocationsTimetable",
            "lesson/add": "addItem",
            "lesson/:id": "viewItem",
            "lesson/show/:id": "showItem",
            "lesson/edit/:id": "editItem",
            "lesson/reschedule/:id": "rescheduleItem",
            "lesson/cancel/:id": "cancelItem",
            "lesson/:id/print": "lessonReport"
        }
    });

    var API = {
        before: function () {
            Lampa.trigger("header:show");
        },
        showList: function () {
            this.before();
            Lampa.request("page:title", "Lesson List");
            LessonsModule.List.Controller.main();
        },
        showGrid: function (params) {
            if (params !== null) {
                var attr = Lampa.request("helper:QueryStringToHash", params);
                Lampa.request("page:title", "Timetable");
                if (attr.teacher) {
                    $.when(Lampa.request("teacher:entity", attr.teacher)).done(function (teacher) {
                        var user = Lampa.request("helper:getFullUserName", teacher.get("name"), teacher.get('surname'), teacher.get('degree'));
                        Lampa.request("page:title", user + "'s Timetable");
                    });
                }
                if (attr.group) {
                    $.when(Lampa.request("group:entity", attr.group)).done(function (group) {
                        Lampa.request("page:title", group.get("name") + "'s Timetable");
                    });
                }
                if (attr.location) {
                    $.when(Lampa.request("location:entity", attr.location)).done(function (location) {
                        Lampa.request("page:title", location.get("name") + "'s Timetable");
                    });
                }
            } else {
                Lampa.request("page:title", "My Timetable");
            }

            arguments[0] = params;
            this.before();

            Lampa.LessonsModule.Grid.Controller.main(arguments);
        },
        showTimetable: function () {
            this.before();
            Lampa.request("page:title", "School Timetable");
            Lampa.LessonsModule.Timetable.Controller.main();
        },
        showTimetableTeacher: function () {
            this.before();
            Lampa.LessonsModule.TimetableTeacher.Controller.main();
        },
        showTimetableLocation: function () {
            this.before();
            Lampa.LessonsModule.TimetableLocation.Controller.main();
        },
        showTimetableGroup: function () {
            this.before();
            Lampa.LessonsModule.TimetableGroup.Controller.main();
        },
        showDailyGroupsTimetable: function () {
            this.before();
            Lampa.LessonsModule.DailyGroupsTimetable.Controller.main();
        },
        showDailyLocationsTimetable: function () {
            this.before();
            Lampa.LessonsModule.DailyLocationsTimetable.Controller.main();
        },
        showDailyTeachersTimetable: function () {
            this.before();
            Lampa.LessonsModule.DailyTeachersTimetable.Controller.main();
        },
        addItem: function () {
            this.before();
            Lampa.request("page:title", "New Lesson(s)");
            Lampa.LessonsModule.Add.Controller.main();
        },
        findItem: function () {
            this.before();
            Lampa.request("page:title", "Find Lesson(s)");
            Lampa.LessonsModule.Find.Controller.main();
        },
        showToStudent: function (id) {
            this.before();
            Lampa.request("page:title", "Lesson");
            Lampa.LessonsModule.Student.Controller.main(id);
        },
        showItem: function (id) {
            this.before();
            Lampa.request("page:title", "Lesson");
            Lampa.LessonsModule.Show.Controller.main(id);
        },
        editItem: function (id) {
            this.before();
            Lampa.request("page:title", "Lesson - edit");
            $.when(Lampa.request("lesson:entity", id)).done(function (model) {
                Lampa.LessonsModule.Edit.Controller.main(model);
            });
        },
        lessonReport: function (id) {
            try {
                this.before();
                Lampa.LessonsModule.LessonReport.Controller.main(id);
            } catch (ex) {
                console.log("error", ex.message);
            }
        },
        rescheduleItem: function (id) {
            try {
                this.before();
                Lampa.request("page:title", "Lesson - Reschedule");
                $.when(Lampa.request("lesson:entity", id))
                    .then(function (model) {
                        Lampa.LessonsModule.Reschedule.Controller.main(model);
                    });
            } catch (ex) {
                console.log(ex.message);
            }
        },
        cancelItem: function (id) {
            try {
                this.before();
                Lampa.request("page:title", "Lesson - Canceling");
                $.when(Lampa.request("lesson:entity", id)).done(function (model) {
                    Lampa.LessonsModule.Cancel.Controller.main(model);
                });
            } catch (ex) {
                console.log(ex.message);
            }
        },
        findLessons: function () {
            try {
                this.before();
                Lampa.request("page:title", "Lesson - Find");
                Lampa.LessonsModule.Find.Controller.main();
            } catch (ex) {
                console.log(ex.message);
            }
        },
        viewItem: function (lessonID) {
            var _this = this;
            $.when(Lampa.request("role:get")).then(function (model) {
                var role = "";
                if (typeof model === "string") {
                    role = model;
                } else {
                    role = model.get("role");
                }

                switch (role) {
                    case "s":
                        _this.showToStudent(lessonID);
                        break;
                    case "a":
                    case "t":
                        _this.editItem(lessonID);
                        break;
                    default:
                        _this.showItem(lessonID);
                }
            });
        },
        report: function (lessonID) {
            var _this = this;
            $.when(Lampa.request("role:get")).then(function (model) {
                var role = "";
                if (typeof model === "string") {
                    role = model;
                } else {
                    role = model.get("role");
                }

                switch (role) {
                    case "s":
                    case "c":
                        break;
                    case "a":
                    case "t":
                        _this.lessonReport(lessonID);
                        break;
                    default:
                        _this.lessonReport(lessonID);
                }
            });
        }
    };

    Lampa.on("lesson:default", function () {
        Lampa.trigger("lesson:timetable");
    });

    Lampa.on("lesson:timetable", function () {
        Lampa.navigate("lesson/timetable");
        API.showTimetable();
    });

    Lampa.on("lesson:timetable-teacher", function () {
        Lampa.navigate("lesson/timetable-teacher");
        API.showTimetableTeacher();
    });

    Lampa.on("lesson:timetable-location", function () {
        Lampa.navigate("lesson/timetable-location");
        API.showTimetableLocation();
    });

    Lampa.on("lesson:timetable-group", function () {
        Lampa.navigate("lesson/timetable-group");
        API.showTimetableGroup();
    });

    Lampa.on("lesson:daily-groups-timetable", function () {
        Lampa.navigate("lesson/daily-groups-timetable");
        API.showDailyGroupsTimetable();
    });

    Lampa.on("lesson:daily-locations-timetable", function () {
        Lampa.navigate("lesson/daily-locations-timetable");
        API.showDailyLocationsTimetable();
    });

    Lampa.on("lesson:daily-teachers-timetable", function () {
        Lampa.navigate("lesson/daily-teachers-timetable");
        API.showDailyTeachersTimetable();
    });

    Lampa.on("scheduler:default", function () {
        Lampa.trigger("lesson:add");
    });

    Lampa.on("lesson:list", function () {
        Lampa.navigate("lesson/list");
        API.showList();
    });

    Lampa.on("lesson:grid", function (params) {
        if (params) {
            Lampa.navigate("lesson/grid?" + params);
        } else {
            Lampa.navigate("lesson/grid");
        }
        API.showGrid(params);
    });

    Lampa.on("lesson:add", function () {
        Lampa.navigate("lesson/add");
        API.addItem();
    });

    Lampa.on("lesson:find", function () {
        Lampa.navigate("lesson/find");
        API.findItem();
    });

    Lampa.on("lesson:show", function (id) {
        Lampa.navigate("lesson/" + id);
        API.viewItem(id);
    });

    Lampa.on("lesson:show:student", function (id) {
        Lampa.navigate("lesson/show/" + id);
        API.showItem(id);
    });

    Lampa.on("lesson:edit", function (id) {
        Lampa.navigate("lesson/edit/" + id);
        API.editItem(id);
    });

    Lampa.on("lesson:show-edit", function (id) {
        switch (Lampa.request("account:type")) {
            case "admin":
                Lampa.trigger("lesson:edit", id);
                break;
            default :
                Lampa.trigger("lesson:show", id);
        }
    });

    Lampa.on("lesson:reschedule", function (id) {
        Lampa.navigate("lesson/reschedule/" + id);
        API.rescheduleItem(id);
    });

    Lampa.on("lesson:cancel", function (id) {
        Lampa.navigate("lesson/cancel/" + id);
        API.cancelItem(id);
    });

    Lampa.on("lesson:report", function (id) {
        Lampa.navigate("lesson/" + id + "/print");
        API.lessonReport(id);
    });

    Lampa.addInitializer(function () {
        new LessonsModule.Router({
            controller: API
        });
    });
});