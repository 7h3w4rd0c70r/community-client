/**
 * Created by Roman on 24.2.15.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {

    Entities.LessonsNext = Backbone.Collection.extend({
        model: Entities.Lesson,

        lessonID: null,
        url: function () {
            var key = Lampa.request("key:entity");

            if (this.lessonID === null) {
                return Lampa.restUrl + "/key/" + key + "/lessons";
            }
            return Lampa.restUrl + "/key/" + key + "/lesson/" + this.lessonID + '/lessons/next';
        },
        defaults: {
            lessonID: null
        }
    });

    Entities.LessonsNextApi = Entities.Api.extend({
        loadEntities: function (lessonID) {
            Lampa.trigger("progressBar:show");
            var defer = $.Deferred();
            var entities = new Entities.LessonsNext();

            if (lessonID === null) {
                Lampa.trigger("progressBar:hide");
                return entities;
            }
            entities.lessonID = lessonID;

            entities.fetch({
                    error: function () {
                        Lampa.trigger("progressBar:hide");
                        console.log('fetch error!')
                    },
                    success: function (data) {
                        Lampa.trigger("progressBar:hide");
                        defer.resolve(data);
                    }
                }
            );
            return defer;
        }
    });
    var api = new Entities.LessonsNextApi();

    Lampa.reqres.setHandler("lessons:next", function (lessonID) {
        return api.loadEntities(lessonID);
    });
});