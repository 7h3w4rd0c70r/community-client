/**
 * Created by Roman Brhel on 09.06.2016.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.LessonNewReminder = Backbone.Model.extend({
        url: function () {
            return Lampa.restUrl.concat("/key/", Lampa.request("key:entity"), "/lesson/", this.get("lessonID").toString(), "/newReminder");
        },
        idAttribute: "lessonID",
        defaults: {
            lessonID: null,
            reminder: ""
        }
    });

    Entities.LessonNewReminderApi = Entities.Api.extend({
        idAttribute: "lessonID",
        getNewEntity: function () {
            return new Entities.LessonNewReminder();
        }
    });

    var api = new Entities.LessonNewReminderApi();

    Lampa.reqres.setHandler("reminder:new", function (lessonID) {
        return api.loadEntity(lessonID);
    });

    Lampa.reqres.setHandler("reminder:new:save", function (model) {
        return api.saveEntity(model);
    });
});