/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("TeachersModule", function (TeachersModule, Lampa, Backbone, Marionette, $, _) {
    TeachersModule.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "teachers": "showListView",
            "teacher/add": "addItem",
            "teacher/:id": "showItem",
            "teacher/edit/:id": "editItem"
        }
    });

    var API = {
        before: function () {
            Lampa.trigger("page:show");
            Lampa.trigger("header:show");
        },
        showListView: function () {
            this.before();
            Lampa.request("page:title", "Teacher List");
            Lampa.TeachersModule.List.Controller.main();
        },
        addItem: function () {
            this.before();
            Lampa.request("page:title", "New Teacher");
            Lampa.TeachersModule.Edit.Controller.main(Lampa.request("teacher:new"));
        },
        showItem: function (id) {
            this.before();
            Lampa.request("page:title", "Teacher");
            $.when(Lampa.request("teacher:entity", id)).done(
                function (model) {
                    Lampa.TeachersModule.Show.Controller.main(model);
                }
            );
        },
        showItemModel: function (model) {
            this.before();
            Lampa.request("page:title", "Teacher");
            Lampa.TeachersModule.Show.Controller.main(model);
        },

        editItem: function (id) {
            Lampa.request("page:title", "Teacher - edit");
            this.before();
            $.when(Lampa.request("teacher:entity", id)).done(
                function (model) {
                    Lampa.TeachersModule.Edit.Controller.main(model);
                }
            );
        },
        editItemModel: function (model) {
            Lampa.request("page:title", "Teacher - edit");
            this.before();
            Lampa.TeachersModule.Edit.Controller.main(model);
        }
    };

    Lampa.on("teacher:default", function () {
        Lampa.trigger("teacher:list");
    });

    Lampa.on("teacher:add", function () {
        Lampa.navigate("teacher/add");
        API.addItem();
    });

    Lampa.on("teacher:list", function () {
        Lampa.navigate("teachers");
        API.showListView();
    });

    Lampa.on("teacher:show", function (param) {
        try {
            if (_.isNumber(param)) {
                Lampa.navigate("teacher/" + param);
                API.showItem(param);
            } else {
                Lampa.navigate("teacher/" + param.get("personID"));
                API.showItemModel(param);
            }
        } catch (ex) {
            console.log(ex.message);
        }
    });

    Lampa.on("teacher:edit", function (param) {
        try {
            if (_.isNumber(param)) {
                Lampa.navigate("teacher/edit/" + param);
                API.editItem(param);
            } else {
                Lampa.navigate("teacher/edit/" + param.get("personID"));
                API.editItemModel(param);
            }
        } catch (ex) {
            console.log(ex.message);
        }
    });

    Lampa.addInitializer(function () {
        new TeachersModule.Router({
            controller: API
        });
    });
});