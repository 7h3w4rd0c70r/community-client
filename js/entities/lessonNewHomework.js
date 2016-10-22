/**
 * Created by Roman Brhel on 09.06.2016.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.LessonNewHomework = Backbone.Model.extend({
        url: function () {
            return Lampa.restUrl.concat("/key/", Lampa.request("key:entity"), "/lesson/", this.get("lessonID").toString(), "/newHomework");
        },
        idAttribute: "lessonID",
        defaults: {
            lessonID: null,
            homework: "",
            homeworkLessonID: 0
        }
    });

    Entities.LessonNewHomeworkApi = Entities.Api.extend({
        idAttribute: "lessonID",
        getNewEntity: function () {
            return new Entities.LessonNewHomework();
        }
    });

    var api = new Entities.LessonNewHomeworkApi();

    Lampa.reqres.setHandler("homework:new", function (lessonID) {
        return api.loadEntity(lessonID);
    });

    Lampa.reqres.setHandler("homework:new:save", function (model) {
        return api.saveEntity(model);
    });
});