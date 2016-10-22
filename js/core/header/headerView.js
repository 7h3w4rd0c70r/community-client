/**
 * Created by Roman on 18.6.14.
 */

Lampa.module("Core.Header", function (Header, Lampa, Backbone, Marionette, $, _) {
    Header.Layout = Marionette.LayoutView.extend({
        template: "core/header",
        regions: {
            accessRegion: "#access",
            menuRegion: "#main-menu"
        },
        events: {
            "click .logout": "doLogout",
            "click .icon .records": "goMyTimetable"
        },
        modelEvents: {
            "change": "dataChanged"
        },
        dataChanged: function () {
            this.render();
        },
        doLogout: function () {
            Lampa.trigger("logout");
        },
        goMyTimetable: function () {
            Lampa.navigate("lesson/grid");
        },
        onShow: function () {
            $.when(Lampa.request("user:entity")).done(function (user) {
                if (!user.get("accountID")) {
                    Lampa.trigger("logout");
                }
            });

            var parent = this;
            $.when(Lampa.request("access:entities")).done(function (collection) {
                if (collection) {
                    collection.each(function (model) {
                        if (model.get("inUse") === 1) {
                            Lampa.trigger("access:use", model);
                            parent.menuRegion.show(new Header.MenuItems({collection: Lampa.request("menu:entities")}));
                        }
                    });
                }
            });
        }
    });

    Header.MenuItem = Marionette.ItemView.extend({
        tagName: "li",
        template: "core/menu-item",
        className: function () {
            var value = "";
            var submenu = this.model.get("submenu");
            if (submenu.length > 0) {
                value += "dropdown";
            }
            return value === "" ? null : value;
        }
    });

    Header.MenuItems = Marionette.CompositeView.extend({
        template: "core/menu",
        childView: Header.MenuItem,
        childViewContainer: "#menu",
        ui: {
            "logout": "#log-out"
        },
        logout: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("logout");
        },
        events: {
            "click @ui.logout": "logout"
        }
    });

    Header.User = Marionette.ItemView.extend({
        template: "core/header-user",
        tagName: "a",
        className: "logout",
        attributes: function () {
            var a = {};
            a.href = "#";
            return a;
        }
    });

    Header.Access = Marionette.ItemView.extend({
        tagName: "option",
        template: "core/header-access",
        attributes: function () {
            var a = {};
            try {
                a.value = this.model.get("accessID");

                if (this.model.get("active")) {
                    a.selected = true;
                }
            } catch (ex) {
                console.log(ex.message);
            }
            return a;
        }
    });

    Header.Accesses = Marionette.CollectionView.extend({
        tagName: "select",
        template: "core/header-accesses",
        childView: Header.Access,
        childViewContainer: "div",
        className: "role",
        events: {
            "change": "changeAccess"
        },
        changeAccess: function () {
            try {
                var id = $(".role")[0].value;
                Lampa.trigger("access:set-active", id);
            } catch (ex) {
                console.log(ex.message);
            }
        }
    });
});