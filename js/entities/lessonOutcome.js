/**
 * Created by Roman on 27.3.2016.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.LessonOutcome = Backbone.Model.extend({
        url: function () {
            var link = Lampa.restUrl.concat("/key/", Lampa.request("key:entity"), "/lesson/", this.get('lessonID').toString(), "/outcome");
            if (this.get("outcomeID")) {
                link += "/" + this.get("outcomeID");
            }
            return link;
        },
        idAttribute: "outcomeID",
        defaults: {
            outcomeID: null,
            lessonID: null,
            description: null
        }
    });

    Entities.LessonOutcomes = Backbone.Collection.extend({
        model: Entities.LessonOutcome,
        comparator: "outcomeID",
        lessonID: null,
        url: function () {
            if (this.lessonID === null) {
                return Lampa.restUrl;
            }
            return Lampa.restUrl + "/key/" + Lampa.request("key:entity") + '/lesson/' + this.lessonID + '/outcomes';
        }
    });

    Entities.LessonsOutcomApi = Entities.Api.extend({
        idAttribute: "outcomeID",
        entityName: "outcome",
        loadEntities: function (lessonID) {
            Lampa.trigger("progressBar:show");
            var defer = $.Deferred();
            this.entities = new Entities.LessonOutcomes();
            this.entities.lessonID = lessonID;
            this.entities.fetch({
                error: function (data, error) {
                    Lampa.trigger("progressBar:hide");
                    console.log("Entity fetch error:", error.responseText);
                },
                success: function (data) {
                    Lampa.trigger("progressBar:hide");
                    defer.resolve(data);
                }
            });
            return defer;
        },
        addToEntities: function (model) {
            this.entities.push(model);
        }
    });

    var api = new Entities.LessonsOutcomApi();

    Lampa.reqres.setHandler("outcome:entities", function (lessonId) {
        return api.loadEntities(lessonId);
    });

    Lampa.reqres.setHandler("outcome:add-item", function (model) {
        return api.addToEntities(model);
    });

    Lampa.reqres.setHandler("outcome:entity:new", function (lessonId) {
        var item = new Entities.LessonOutcome();
        item.set("lessonID", lessonId);
        return item;
    });
});