/**
 * Created by Roman on 2.9.14.
 */

Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.CalendarDay = Backbone.Model.extend({
        url: Lampa.restUrl,
        idAttribute: "dayID",
        defaults: {
            dayID: null,
            day: null
        }
    });

    Entities.CalendarDays = Backbone.Collection.extend({
        model: Entities.CalendarDay,
        startDay: null,
        endDay: null,
        comparator: "day",
        url: function () {
            var key = Lampa.request("key:entity");
            if (this.startDay === null || this.endDay === null || key === undefined) {
                return Lampa.restUrl;
            }
            return Lampa.restUrl + "/key/" + key + "/calendar/from/" + this.startDay + "/to/" + this.endDay;
        }
    });

    Entities.CalendarDaysApi = Entities.Api.extend({
        entities: null,
        setNewEntities: function () {
            this.entities = new Entities.CalendarDays();
            return this.entities;
        },
        loadEntities: function (params) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            var entities = this.getEntities();

            if (params.startDay !== undefined || params.endDay !== undefined) {
                entities.startDay = params.startDay;
                entities.endDay = params.endDay;
                entities.fetch({
                    error: function () {
                        Lampa.trigger("progressBar:hide");
                        throw new Error("error day model - not found", "");
                    },
                    success: function () {
                        Lampa.trigger("progressBar:hide");
                        defer.resolve(entities);
                    }
                });
            }
            return defer;
        }
    });

    var api = new Entities.CalendarDaysApi();

    Lampa.reqres.setHandler("calendar:entities", function () {
        return api.loadEntities();
    });

    Lampa.reqres.setHandler("calendar:load", function (params) {
        return api.loadEntities(params);
    });

    Lampa.reqres.setHandler("calendar:new", function () {
        return api.setNewEntities();
    });
});