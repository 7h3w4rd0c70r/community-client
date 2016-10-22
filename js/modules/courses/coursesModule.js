/**
 * Created by Roman on 24.7.14.
 */
Lampa.module("CoursesModule", function (CoursesModule, Lampa, Backbone, Marionette, $, _) {
    CoursesModule.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "courses": "showListView",
            "course/add": "addItem",
            "course/:id": "showItem",
            "course/edit/:id": "editItem"
        }
    });

    var API = {
        before: function () {
            Lampa.trigger("page:show");
            Lampa.trigger("header:show");
        },

        showListView: function () {
            this.before();
            Lampa.request("page:title", 'Course List');
            CoursesModule.List.Controller.main();
        },

        addItem: function () {
            this.before();
            Lampa.request("page:title", 'New Course');
            CoursesModule.Edit.Controller.main(Lampa.request("course:new"));
        },

        showItem: function (id) {
            this.before();
            Lampa.request("page:title", 'Course');
            $.when(Lampa.request("course:entity", id).done(function (model) {
                CoursesModule.Show.Controller.main(model);
            }));
        },

        showItemModel: function (model) {
            this.before();
            Lampa.request("page:title", 'Course');
            CoursesModule.Show.Controller.main(model);
        },

        editItem: function (id) {
            Lampa.request("page:title", 'Course - edit');
            this.before();
            $.when(Lampa.request("course:entity", id).done(function (model) {
                CoursesModule.Edit.Controller.main(model);
            }));
        }
    };
    Lampa.on("course:default", function () {
        Lampa.trigger("course:list");
    });

    Lampa.on("course:list", function () {
        Lampa.navigate("courses");
        API.showListView();
    });

    Lampa.on("course:add", function () {
        Lampa.navigate("course/add");
        API.addItem();
    });

    Lampa.on("course:show", function (param) {
        try {
            if (_.isNumber(param)) {
                Lampa.navigate("course/" + param);
                API.showItem(param);
            } else {
                Lampa.navigate("course/" + param.get('courseID'));
                API.showItem( param.get('courseID'));
            }
        }
        catch (ex) {
            console.log(ex.message);
        }
    });

    Lampa.on("course:edit", function (param) {
        try {
            if (_.isNumber(param)) {
                Lampa.navigate("course/edit/" + param);
                API.editItem(param);
            }
        }
        catch (ex) {
            console.log(ex.message);
        }
    });

    Lampa.addInitializer(function () {
        new CoursesModule.Router({
            controller: API
        })
    });
});