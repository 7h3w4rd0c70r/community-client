/**
 * Created by Roman on 29.8.14.
 */

Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Time = Backbone.Model.extend({
        url: "",
        defaults: {
            hours: null,
            minutes: null
        }
    });

    Entities.TimeApi = Entities.Api.extend({
        getEntityFromString: function (text) {
            try {
                var entity = new Entities.Time();
                entity.set("hours", text.substr(0, 2));
                entity.set("minutes", text.substr(3, 2));
                return entity;
            } catch (ex) {
                console.log(ex.message);
            }
            return "";
        },
        getEntityFromMinutes: function (minutes) {
            try {
                var entity = new Entities.Time();
                var day = new Date(0, 0, 0, 0, minutes, 0, 0);
                entity.set("hours", day.getHours());
                entity.set("minutes", day.getMinutes());
                return entity;
            } catch (ex) {
                console.log(ex.message);
            }
            return "";
        }
    });

    var api = new Entities.TimeApi();

    Lampa.reqres.setHandler("time:entity", function (item) {
        return (typeof item === "number") ? api.getEntityFromMinutes(item) : api.getEntityFromString(item);
    });
});