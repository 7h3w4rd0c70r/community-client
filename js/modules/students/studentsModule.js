/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("StudentModule", function (StudentModule, Lampa, Backbone, Marionette, $, _) {
    StudentModule.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "students": "showListView",
            "student/add": "addItem",
            "student/:id": "showItem",
            "student/edit/:id": "editItem",
            "homework": "showHomework"
        }
    });

    var API = {
        before: function () {
            Lampa.trigger("page:show");
            Lampa.trigger("header:show");
        },
        showListView: function () {
            this.before();
            Lampa.request("page:title", "List of Students");
            Lampa.StudentModule.List.Controller.main();
        },
        addItem: function () {
            this.before();
            Lampa.request("page:title", "New Student");
            Lampa.StudentModule.Add.Controller.main(Lampa.request("student:new"));
        },
        showItem: function (id) {
            this.before();
            Lampa.request("page:title", "Student");

            $.when(Lampa.request("student:entity", id)).done(function (model) {
                Lampa.StudentModule.Show.Controller.main(model);
            });
        },
        showItemModel: function (model) {
            this.before();
            Lampa.request("page:title", "Student");
            Lampa.StudentModule.Show.Controller.main(model);
        },
        editItem: function (id) {
            Lampa.request("page:title", "Student - edit");
            this.before();
            $.when(Lampa.request("student:entity", id)).done(function (model) {
                Lampa.StudentModule.Edit.Controller.main(model);
            });
        },
        editItemModel: function (model) {
            Lampa.request("page:title", "Student - edit");
            this.before();
            Lampa.StudentModule.Edit.Controller.main(model);
        },
        showHomework: function () {
            Lampa.request("page:title", "Homework");
            this.before();
            Lampa.StudentModule.Homework.Controller.main();
        }
    };

    Lampa.on("student:default", function () {
        Lampa.trigger("student:list");
    });

    Lampa.on("student:list", function () {
        Lampa.navigate("students");
        API.showListView();
    });

    Lampa.on("student:add", function () {
        Lampa.navigate("student/add");
        API.addItem();
    });

    Lampa.on("student:show", function (param) {
        if (_.isNumber(param)) {
            Lampa.navigate("student/" + param);
            API.showItem(param);
        } else {
            Lampa.navigate("student/" + param.get("personID"));
            API.showItem(param.get("personID"));
        }
    });

    Lampa.on("student:edit", function (param) {
        if (_.isNumber(param)) {
            Lampa.navigate("student/edit/" + param);
            API.editItem(param);
        } else {
            Lampa.navigate("student/edit/" + param.get("personID"));
            API.editItemModel(param);
        }
    });

    Lampa.on("student:homework", function () {
        Lampa.navigate("homework");
        API.showHomework();
    });

    Lampa.addInitializer(function () {
        new StudentModule.Router({controller: API});
    });
});