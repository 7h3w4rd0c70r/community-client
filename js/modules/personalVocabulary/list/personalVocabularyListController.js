/**
 * Created by Roman on 25.7.14.
 */

Lampa.module("PersonalVocabularyModule.List", function (List, Lampa, Backbone, Marionette, $, _) {
    List.Controller = {
        main: function () {
            $.when(Lampa.request("personalVocabulary:entities"))
                .then(function (collection) {
                    (new Lampa.SkeletonView()).page.show(new List.Vocabularies({collection: collection}));
                });
        }
    };
});