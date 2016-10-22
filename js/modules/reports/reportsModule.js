/**
 * Created by Roman on 17.12.14.
 */
Lampa.module("ReportsModule", function (ReportsModule, Lampa, Backbone, Marionette, $, _) {
    ReportsModule.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "reports/attendance": "showAttendance",
            "reports/lessons": "showLessons"
        }
    });

    var API = {
        before: function () {
            Lampa.trigger("page:show");
            Lampa.trigger("header:show");
        },
        showAttendance: function () {
            this.before();
            ReportsModule.GroupAttendance.Controller.main();
        },
        showLessons: function () {
            this.before();
            ReportsModule.TeacherLessons.Controller.main();
        }
    };

    Lampa.on("reports:default", function () {
        Lampa.trigger("reports:attendance");
    });

    Lampa.on("reports:attendance", function () {
        Lampa.navigate("reports/attendance");
        API.showAttendance();
    });

    Lampa.on("reports:lessons", function () {
        Lampa.navigate("reports/lessons");
        API.showLessons();
    });

    Lampa.addInitializer(function () {
        new ReportsModule.Router({
            controller: API
        })
    });
});