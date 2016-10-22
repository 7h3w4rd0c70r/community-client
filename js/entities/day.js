/**
 * Created by Roman on 22.8.14.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Day = Backbone.Model.extend({
        url: "",
        idAttribute: "dayId",
        defaults: {
            dayId: null,
            day: "",
            dayName: "",
            dayOfWeek: null,
            dayNumber: null,
            month: null,
            monthIndex: null,
            year: null,
            max: null,
            min: null,
            value: null
        }
    });

    Entities.Days = Backbone.Collection.extend({
        model: Entities.Day,
        comparator: "dayId",
        url: ""
    });

    Entities.DateTime = Backbone.Model.extend({
        url: "",
        defaults: {
            year: null,
            month: null,
            day: null,
            time: null
        }
    });

    Entities.DaysApi = Entities.Api.extend({
        getDayFromString: function (text) {
            try {
                var item = new Entities.Day();
                item.set("dayId", "D" + text.replace("-", "").replace("-", ""));
                item.set("value", new Date(text));
                item.set("day", text);
                item.set("dayName", Lampa.request("helper:getDayName", text + " 00:00:00"));
                item.set("dayNumber", text.substr(8, 2));
                item.set("month", text.substr(5, 2));
                item.set("monthIndex", item.get("value").getMonth());
                item.set("year", text.substr(0, 4));
                return item;
            } catch (ex) {
                console.log(ex.message);
            }
            return null;
        },
        getDayFromDate: function (date) {
            var item = new Entities.Day();
            try {
                item.set("dayNumber", date.getDate());
                item.set("month", date.getMonth());
                item.set("year", date.getFullYear());
            } catch (ex) {
                console.log(ex.message);
            }
            return item;
        },
        getDays: function (list) {
            var days = new Entities.Days();
            var day, dayFrom, dayTo;
            try {
                var i = 0, length = list.length;
                for (i; i < length; i++) {
                    day = this.getDayFromString(list[i]);
                    if (!dayFrom) dayFrom = day;
                    if (dayFrom > day) dayFrom = day;

                    if (!dayTo) dayTo = day;
                    if (dayTo < day) dayTo = day;

                    days.add(this.getDayFromString(list[i]));
                }
            } catch (ex) {
                console.log(ex.message);
            }
            return days;
        }
    });

    var api = new Entities.DaysApi();

    Lampa.reqres.setHandler("day:entities", function (list) {
        return api.getDays(list);
    });

    Lampa.reqres.setHandler("day:entity", function (date) {
        return (typeof(date) === "object" && date.length === undefined)
            ? api.getDayFromDate(date)
            : api.getDayFromString(date);
    });
});