/**
 * Created by Roman on 8.7.14.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.User = Backbone.Model.extend({
        url: function () {
            return Lampa.restUrl + "/key/" + Lampa.request("key:entity") + "/user";
        },
        defaults: {
            accountID: null,
            fullName: null,
            role: null
        }
    });

    Entities.UserApi = Entities.Api.extend({
        getNewEntity: function () {
            return new Entities.User();
        },
        reset: function () {
            this.setEntity(null);
        },
        getCurrentEntity: function () {
            var entity = this.getEntity();
            if (entity === null) {
                entity = this.getNewEntity();
                this.setEntity(entity);
            }
            return entity;
        },
        loadEntity: function () {
            var _this = this;
            var entity = this.getEntity();

            if (entity) {
                return this.entity;
            }

            var defer = new $.Deferred();
            entity = this.getNewEntity();

            if (Lampa.request("key:entity") === "") {
                defer.resolve(this.getNewEntity());
                return defer;
            }

            Lampa.trigger("progressBar:show");
            entity.fetch({
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    _this.reset();
                    defer.resolve(_this.getNewEntity());
                },
                success: function (data) {
                    Lampa.trigger("progressBar:hide");
                    _this.setEntity(data);
                    defer.resolve(data);
                }
            });
            return defer;
        },
        isLogged: function () {
            return false;
        },
        getRole: function () {
            var entity = this.getCurrentEntity();
            return entity.get("role");
        },
        setRole: function (role) {
            var entity = this.getCurrentEntity();
            return entity.set("role", role);
        }
    });

    var api = new Entities.UserApi();

    Lampa.reqres.setHandler("user:entity", function () {
        return api.loadEntity();
    });

    Lampa.reqres.setHandler("user:name", function () {
        var entity = api.getCurrentEntity();
        return entity.get("fullName");
    });

    Lampa.reqres.setHandler("user:accountID", function () {
        var entity = api.getCurrentEntity();
        return entity.get("accountID");
    });

    Lampa.reqres.setHandler("user:reset", function () {
        return api.reset();
    });

    Lampa.reqres.setHandler("user:isLogged", function () {
        return api.isLogged();
    });

    Lampa.reqres.setHandler("user:role", function () {
        return api.getRole();
    });

    Lampa.reqres.setHandler("user:role:set", function (role) {
        return api.setRole(role);
    });
});