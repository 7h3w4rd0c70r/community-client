/**
 * Created by Roman Brhel on 09.06.2016.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.LessonHeader = Backbone.Model.extend({
        url: function () {
            try {
                return Lampa.restUrl + "/key/" + Lampa.request("key:entity") + "/lesson/" + this.get("lessonID") + "/header";
            }
            catch (ex) {
                console.log("error", ex.message);
                return "";
            }
        },

        idAttribute: "lessonID",
        defaults: {
            lessonID: null,
            name: "",
            description_a: "",
            description_b: "",
            materials: "",
            notes: ""
        }
    });

    Entities.LessonHeaderApi = Entities.Api.extend({
        idAttribute: 'lessonID',
        useNewEntity: false,
        getNewEntity: function () {
            return new Entities.LessonHeader();
        },

        entityCopy: null,
        setEntityCopy: function () {
            var model = this.getLastEntity();
            this.entityCopy = this.getNewEntity();
            this.entityCopy.set('name', model.get('name'));
            this.entityCopy.set('description_a', model.get('description_a'));
            this.entityCopy.set('description_b', model.get('description_b'));
            this.entityCopy.set('materials', model.get('materials'));
            this.entityCopy.set('notes', model.get('notes'));
        },

        existsPasteLesson: function () {
            if (this.entityCopy === null) {
                return false;
            }
            return (this.entityCopy) ? true : false;
        },

        isPasteLessonCurrent: function (lessonID) {
            if (this.entityCopy === null) {
                return false;
            }
            return this.entityCopy.get('lessonID') == lessonID;
        },

        pasteEntityCopy: function () {
            if (this.existsPasteLesson()) {
                var source = this.entityCopy;
                var destination = this.getLastEntity();
                destination.set('name', source.get('name'));
                destination.set('description_a', source.get('description_a'));
                destination.set('description_b', source.get('description_b'));
                destination.set('materials', source.get('materials'));
                destination.set('notes', source.get('notes'));
                this.entityCopy = null;

                if (destination.lessonID !== null) {
                    destination.save();
                }
            }
        }
    });

    var api = new Entities.LessonHeaderApi();

    Lampa.on("lesson:copy", function () {
        api.setEntityCopy();
    });

    Lampa.on("lesson:paste", function () {
        api.pasteEntityCopy();
    });

    Lampa.reqres.setHandler("lesson:exist-paste-lesson", function (currentLessonID) {
        return !api.isPasteLessonCurrent(currentLessonID) ? api.existsPasteLesson() : false;
    });

    Lampa.reqres.setHandler("lesson:header", function (lessonID) {
        return api.loadEntity(lessonID);
    });
    Lampa.reqres.setHandler("lesson:header:last-loaded", function () {
        return api.getLastEntity();
    });

    Lampa.reqres.setHandler("lesson:header:update", function (model) {
        return api.saveEntity(model);
    });
});