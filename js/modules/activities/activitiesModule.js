/**
 * Created by Roman on 2.6.14.
 */

Lampa.module("ActivitiesModule", function (ActivitiesModule, Lampa, Backbone, Marionette, $, _) {
    ActivitiesModule.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "activities/list": "showActivityListView",
            "activities/detailedList": "showDetailedListView",
            "activities/grid": "showGridView",
            "activity/add": "addActivity",
            "activity/:id": "showActivityId",
            "activity/edit/:id": "editActivityId"
        }
    });

    var API = {
        before: function () {
            $.when(Lampa.request("accounts:entities")).done(
                function () {
                    Lampa.trigger("header:show");
                    Lampa.trigger("page:show");
                }
            );
        },
        setAccountsCss: function () {
            $.when(Lampa.request("accounts:creators")).done(
                function (collection) {
                    try {
                        collection.each(function (model) {
                            var name = ".created-by-" + model.id;
                            $(name).addClass("name").text(model.get("fullName"));
                        }, this);
                    } catch (ex) {
                        console.log(ex.message);
                    }
                }
            );
        },
        showActivityListView: function () {
            this.before();
            Lampa.ActivitiesModule.List.Controller.main();
        },
        showDetailedListView: function () {
            this.before();
            Lampa.ActivitiesModule.DetailedList.Controller.main();
        },
        showGridView: function (params) {
            this.before();
            Lampa.ActivitiesModule.Grid.Controller.main(params);
        },
        addActivity: function (entity) {
            this.before();
            Lampa.ActivitiesModule.Edit.Controller.main(entity ? entity : Lampa.request("activity:new"));
        },
        showActivityId: function (id) {
            this.before();
            $.when(Lampa.request("activity:entity", id)).done(function (model) {
                Lampa.ActivitiesModule.Show.Controller.main(model);
            });
        },
        showActivityModel: function (model) {
            this.before();
            Lampa.ActivitiesModule.Show.Controller.main(model);
        },
        editActivityId: function (id) {
            this.before();
            $.when(Lampa.request("activity:entity", id)).done(function (model) {
                Lampa.ActivitiesModule.Edit.Controller.main(model);
            });
        },
        editActivityModel: function (model) {
            this.before();
            Lampa.ActivitiesModule.Edit.Controller.main(model);
        }
    };

    Lampa.on("activities:default", function () {
        Lampa.navigate("activities/grid");
        Lampa.trigger("activities:grid");
    });

    Lampa.on("activities:list", function () {
        Lampa.navigate("activities/list");
        API.showActivityListView();
    });

    Lampa.on("activities:detailedList", function () {
        Lampa.navigate("activities/detailedList");
        API.showActivityListView();
    });

    Lampa.on("activities:grid", function () {
        Lampa.navigate("activities/grid");
        API.showGridView();
    });

    Lampa.on("activity:add", function () {
        Lampa.navigate("activity/add");
        API.addActivity(Lampa.request("activity:new"));
    });

    Lampa.on("activity:show", function (entity) {
        try {
            if (_.isNumber(entity)) {
                Lampa.navigate("activity/" + entity);
                return API.showActivityId(entity);
            }

            if (entity.id) {
                Lampa.navigate("activity/" + entity.id);
                return API.showActivityModel(entity);
            }
        } catch (ex) {
            console.log(ex.message);
        }
    });

    Lampa.on("activity:edit", function (entity) {
        try {
            if (_.isNumber(entity)) {
                Lampa.navigate("activity/edit/" + entity);
                return API.editActivityId(entity);
            } else {
                Lampa.navigate("activity/edit/" + entity.get('activityID'));
                return API.editActivityModel(entity);
            }
        } catch (ex) {
            console.log(ex.message);
        }
    });

    Lampa.addInitializer(function () {
        new ActivitiesModule.Router({
            controller: API
        });
    });
});