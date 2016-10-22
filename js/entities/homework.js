/**
 * Created by Roman on 23.9.14.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.HomeworkItem = Backbone.Model.extend({
        url: function () {
            return Lampa.restUrl.concat("/key/", Lampa.request("key:entity"), "/lesson/", this.get("lessonID"));
        },
        idAttribute: "lessonID",
        defaults: {
            homework: null,
            lessonID: null
        }
    });

    Entities.Homework = Backbone.Collection.extend({
        model: Entities.HomeworkItem,
        comparator: "start",
        lessonID: null,
        url: function () {
            if (!this.lessonID) {
                return Lampa.restUrl;
            }
            return Lampa.restUrl.concat("/key/", Lampa.request("key:entity"), "/lesson/", this.lessonID.toString(), "/homework");
        }
    });

    Entities.StudentHomeworkItem = Backbone.Model.extend({
        url: "",
        defaults: {
            lessonID: null,
            due: null,
            task: null
        }
    });

    Entities.StudentHomeworkList = Backbone.Collection.extend({
        model: Entities.StudentHomeworkItem,
        url: function () {
            return Lampa.restUrl.concat("/key/", Lampa.request("key:entity"), "/homework");
        }
    });

    Entities.HomeworkApi = Entities.Api.extend({
        loadEntities: function (lessonID) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            var entities = new Entities.Homework();

            if (!lessonID) {
                Lampa.trigger("progressBar:hide");
                return entities;
            }
            entities.lessonID = lessonID;
            entities.fetch({
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    console.log("fetch error!");
                },
                success: function () {
                    Lampa.trigger("progressBar:hide");
                    defer.resolve(entities);
                }
            });

            return defer;
        },
        myEntities: function () {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            var entities = new Entities.StudentHomeworkList();
            entities.fetch({
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    console.log("fetch error!");
                },
                success: function () {
                    Lampa.trigger("progressBar:hide");
                    defer.resolve(entities);
                }
            });
            return defer;
        }
    });

    var api = new Entities.HomeworkApi();

    Lampa.reqres.setHandler("homework:entities", function (lessonID) {
        return api.loadEntities(lessonID);
    });

    Lampa.reqres.setHandler("homework:list", function () {
        return api.myEntities();
    });
});