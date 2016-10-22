/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("GroupsModule", function (GroupsModule, Lampa, Backbone, Marionette, $, _) {
    GroupsModule.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "groups": "showListView",
            "group/add": "addItem",
            "group/:id": "editItem",
            "group/edit/:id": "editItem"
        }
    });

    var API = {
        before: function () {
            Lampa.trigger("page:show");
            Lampa.trigger("header:show");
        },
        showListView: function () {
            this.before();
            Lampa.request("page:title", 'Group List');
            Lampa.GroupsModule.List.Controller.main();
        },
        addItem: function () {
            this.before();
            Lampa.request("page:title", 'New Group');
            var model = Lampa.request("group:new");
            Lampa.GroupsModule.Edit.Controller.main(model);
        },
        showItem: function (id) {
            this.before();
            Lampa.request("page:title", 'Group');
            $.when(Lampa.request("group:entity", id)).done(function (model) {
                Lampa.GroupsModule.Show.Controller.main(model);
            });
        },
        showItemModel: function (model) {
            this.before();
            Lampa.request("page:title", 'Group');
            Lampa.GroupsModule.Show.Controller.main(model);
        },
        editItem: function (id) {
            Lampa.request("page:title", 'Group - edit');
            this.before();

            $.when(Lampa.request("group:entity", id)).done(function (model) {
                Lampa.GroupsModule.Edit.Controller.main(model);
            });
        },
        editItemModel: function (model) {
            Lampa.request("page:title", 'Group - edit');
            this.before();
            Lampa.GroupsModule.Edit.Controller.main(model);
        }
    };

    Lampa.on("group:default", function () {
        Lampa.trigger("group:list");
    });

    Lampa.on("group:list", function () {
        Lampa.navigate("groups");
        API.showListView();
    });

    Lampa.on("group:add", function () {
        Lampa.navigate("group/add");
        API.addItem();
    });

    Lampa.on("group:show", function (param) {
        try {;
            if (_.isNumber(param)) {
                Lampa.navigate("group/" + param);
                API.showItem(param);
            } else {
                Lampa.navigate("group/" + param.get('groupID'));
                API.showItemModel(param);
            }
        }
        catch (ex) {
            console.log(ex.message);
        }
    });

    Lampa.on("group:edit", function (param) {
            try {
                if (_.isNumber(param)) {
                    Lampa.navigate("group/edit/" + param);
                    API.editItem(param);
                } else {
                    Lampa.navigate("group/edit/" + param.get('groupID'));
                    API.editItemModel(param);
                }
            }
            catch (ex) {
                console.log(ex.message);
            }
        }
    );

    Lampa.addInitializer(function () {
        new GroupsModule.Router({
            controller: API
        })
    });
});