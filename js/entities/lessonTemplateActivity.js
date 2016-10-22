/**
 * Created by Roman on 16.7.14.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.LessonTemplateActivity = Backbone.Model.extend(
        {
            url: function () {
                var key = Lampa.request("key:entity");
                return Lampa.restUrl + "/rest/key/" + key + "/lessonTemplateActivity/" + this.get('templateActivityId');
            },

            idAttribute: "templateActivityId",

            defaults: {
                templateActivityId: null,
                templateId: null,
                activityID: null,
                activityOrder: 0,
                title: '',
                instructions: '',
                duration: 0
            }
        });

    Entities.LessonTemplateActivities = Backbone.Collection.extend({
        id: null,
        model: Entities.LessonTemplateActivity,
        comparator: "activityOrder",
        url: function () {
            var key = Lampa.request("key:entity");
            return Lampa.restUrl + "/key/" + key + "/lessonTemplate/" + this.id + "/activities";
        }
    });

    Entities.LessonTemplateActivitiesApi = Entities.Api.extend({
        loadEntities: function (id) {
            Lampa.trigger("progressBar:show");
            var activities = new Entities.LessonTemplateActivities();
            activities.id = id;

            activities.fetch({
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    throw new Error('error model - Activities not found', '');
                },
                success: function () {
                    Lampa.trigger("progressBar:hide");
                }
            });
            return activities;
        }
    });

    var api = new Entities.LessonTemplateActivitiesApi();
    Lampa.reqres.setHandler("lessonTemplateActivity:entities", function (id) {
        return api.loadEntities(id);
    });
});