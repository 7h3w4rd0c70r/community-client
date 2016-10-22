/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("PersonalVocabularyModule.Edit", function (Edit, Lampa, Backbone, Marionette, $, _) {
    Edit.Vocabulary = Lampa.EditableItemView.extend({
        template: "dictionary/edit",
        className: "container",
        saveModelRequest: "personalVocabulary:save",
        ui: {
            term: "#term",
            translation: "#translation"
        },
        events: {
            "click #save": "saveEntity",
            "click #back": "goBack",
            "change": "serialize"
        },
        modelEvents: {
            "change:dictionaryID": "render"
        },
        serialize: function () {
            this.model.set("term", String(this.ui.term.val()).trim());
            this.model.set("translation", String(this.ui.translation.val()).trim() || '');
            this.model.set("score", Number($(".score:checked").val() || 0));
            if (this.model.id) {
                this.saveModel();
            }
        }
    });
});