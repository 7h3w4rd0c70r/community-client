/**
 * Created by Roman Brhel on 29.09.2016.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.PersonalVocabulary = Backbone.Model.extend({
        url: function () {
            var link = Lampa.restUrl + "/key/" + Lampa.request("key:entity") + "/dictionary-term";
            if (this.get("dictionaryID")) {
                link += "/" + this.get("dictionaryID");
            }
            return link;
        },
        idAttribute: "dictionaryID",
        defaults: {
            dictionaryID: null,
            lessonID: null,
            term: null,
            translation: null,
            score: 0
        }
    });

    Entities.PersonalVocabularies = Backbone.Collection.extend({
        model: Entities.PersonalVocabulary,
        comparator: "term",
        idValue: null,
        url: function () {
            return Lampa.restUrl + "/key/" + Lampa.request("key:entity") + "/dictionary";
        }
    });

    Entities.DictionaryPersonalApi = Entities.Api.extend({
        entityName: "Personal Vocabulary",
        getNewEntity: function () {
            return new Entities.PersonalVocabulary();
        },
        getNewEntities: function () {
            return new Entities.PersonalVocabularies();
        },
        idAttribute: "dictionaryID"
    });

    var api = new Entities.DictionaryPersonalApi();

    Lampa.reqres.setHandler("personalVocabulary:new", function () {
        return api.getNewEntity();
    });

    Lampa.reqres.setHandler("personalVocabulary:entity", function (id) {
        return api.loadEntity(id);
    });

    Lampa.reqres.setHandler("personalVocabulary:save", function (model) {
        return api.saveEntity(model);
    });

    Lampa.reqres.setHandler("personalVocabulary:entities", function () {
        return api.fetchEntities();
    });
});