/**
 * Created by Roman on 25.8.14.
 */

Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Hour = Backbone.Model.extend({
        url: "",
        idAttribute: "hour_start",
        defaults: {
            hour_start: null,
            hour_end: null
        }
    });

    Entities.Hours = Backbone.Collection.extend({
        model: Entities.Hour,
        comparator: "hour_start",
        url: function () {
            var key = Lampa.request("key:entity");
            return Lampa.restUrl + "/key/" + key + "/hours";
        }
    });

    Entities.HoursApi = Entities.Api.extend({
        entityName: "Hour",
        idAttribute: "hour_start",
        getNewEntities: function () {
            return new Entities.Hours();
        }
    });

    var api = new Entities.HoursApi();

    Lampa.reqres.setHandler("hour:entities", function () {
        return api.loadEntities();
    });
});