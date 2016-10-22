/**
 * Created by Roman Brhel on 04.09.2016.
 */

Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Role = Backbone.Model.extend({
        url: function () {
            return Lampa.restUrl.concat("/key/", Lampa.request("key:entity"), "/access/role");
        },
        defaults: {
            type: null
        }
    });

    Entities.RolesApi = Entities.Api.extend({
        getNewEntity: function () {
            return new Entities.Role();
        }
    });

    var api = new Entities.RolesApi();

    Lampa.reqres.setHandler("role:load", function () {
        var model = api.getEntity();
        return (model) ? model : api.loadEntity();
    });

    Lampa.reqres.setHandler("role:get", function () {
        var model = api.getEntity();
        return (model) ? model.get("role") : api.loadEntity();
    });

    Lampa.reqres.setHandler("role:set", function (value) {
        if (api.getEntity()) {
            var model = api.getEntity();
            model.set("role", value);
        }
    });

    Lampa.on("logout", function () {
        api.setEntity(null);
    });
});