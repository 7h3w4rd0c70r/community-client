/**
 * Created by Roman on 10.3.15.
 */

Lampa.module("Entities", function (Entities, Lampa, Backbone) {
    Entities.LessonPaste = Backbone.Model.extend({
        url: "",
        idAttribute: "lessonID",
        defaults: {
            lessonID: null,
            copyHeader: true,
            copyActivities: true,
            clearExistingActivities: true
        }
    });

    Entities.LessonPasteApi = Entities.Api.extend({
        entity: null,
        loadEntity: function () {
            if (this.entity) {
                return this.entity;
            }

            this.entity = new Entities.LessonPaste();
            return this.entity;
        },
        setEntity: function (lessonID) {
            this.entity = new Entities.LessonPaste();
            this.entity.set("lessonID", lessonID);
        },
        clean: function () {
            this.entity = null;
        }
    });

    var api = new Entities.LessonPasteApi();

    Lampa.reqres.setHandler("lesson-paste:set", function (lessonID) {
        return api.setEntity(lessonID);
    });

    Lampa.reqres.setHandler("lesson-paste:get", function () {
        return api.loadEntity();
    });

    Lampa.reqres.setHandler("lesson-paste:clean", function () {
        return api.clean();
    });
});