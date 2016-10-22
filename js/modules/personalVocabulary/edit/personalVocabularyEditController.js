/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("PersonalVocabularyModule.Edit", function (Edit, Lampa, Backbone, Marionette, $, _) {
    Edit.Controller = {
        main: function (model) {
            (new Lampa.SkeletonView()).page.show(new Edit.Vocabulary({model: model}));
        }
    };
});