/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("LocationsModule", function (LocationsModule, Lampa, Backbone, Marionette, $, _) {

    LocationsModule.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "locations": "showListView",
            "location/add": "addItem",
            "location/:id": "showItem",
            "location/edit/:id": "editItem"
        }
    });

    var API = {
        before: function () {
            Lampa.trigger("page:show");
            Lampa.trigger("header:show");
        },

        showListView: function () {
            this.before();
            Lampa.request("page:title", 'Location List');
            LocationsModule.List.Controller.main();
        },

        addItem: function () {
            this.before();
            Lampa.request("page:title", 'New Location');
            var model = Lampa.request("location:new");
            LocationsModule.Edit.Controller.main(model);
        },

        showItem: function (id) {
            this.before();
            Lampa.request("page:title", 'Location');

            $.when(Lampa.request("location:entity", id)).done(function (model) {
                LocationsModule.Show.Controller.main(model);
            });
        },

        showItemModel: function (model) {
            this.before();
            Lampa.request("page:title", 'Location');

            LocationsModule.Show.Controller.main(model);
        },

        editItem: function (id) {
            Lampa.request("page:title", 'Location - edit');
            this.before();
            $.when(Lampa.request("location:entity", id)).done(function (model) {
                LocationsModule.Edit.Controller.main(model);
            });
        },
        editItemModel: function (model) {
            Lampa.request("page:title", 'Location - edit');
            this.before();
            LocationsModule.Edit.Controller.main(model);
        }
    };

    Lampa.on("location:default", function () {
        Lampa.trigger("location:list");
    });

    Lampa.on("location:list", function () {
        Lampa.navigate("locations");
        API.showListView();
    });

    Lampa.on("location:add", function () {
        Lampa.navigate("location/add");
        API.addItem();
    });

    Lampa.on("location:show", function (param) {
        try {
            if (_.isNumber(param)) {
                Lampa.navigate("location/" + param);
                API.showItem(param);
            } else {
                Lampa.navigate("location/" + param.get('locationID'));
                API.showItemModel(param);
            }
        }
        catch (ex) {
            console.log(ex.message);
        }
    });

    Lampa.on("location:edit", function (param) {
            try {
                if (_.isNumber(param)) {
                    Lampa.navigate("location/edit/" + param);
                    API.editItem(param);
                } else {
                    Lampa.navigate("location/edit/" + param.get('locationID'));
                    API.editItemModel(param);
                }
            }
            catch (ex) {
                console.log(ex.message);
            }
        }
    );

    Lampa.addInitializer(function () {
        new LocationsModule.Router({
            controller: API
        })
    });
});