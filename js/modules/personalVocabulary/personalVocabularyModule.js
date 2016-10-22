/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("PersonalVocabularyModule", function (PersonalVocabularyModule, Lampa, Backbone, Marionette, $, _) {
    PersonalVocabularyModule.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "dictionary": "showList",
            "dictionary/add": "addItem",
            "dictionary/:id": "editItem"
        }
    });

    var API = {
        before: function () {
            Lampa.trigger("page:show");
            Lampa.trigger("header:show");
        },
        showList: function () {
            this.before();
            PersonalVocabularyModule.List.Controller.main();
        },
        addItem: function () {
            this.before();
            PersonalVocabularyModule.Edit.Controller.main(Lampa.request("personalVocabulary:new"));
        },
        editItem: function (id) {
            this.before();
            $.when(Lampa.request("personalVocabulary:entity", id))
                .then(function (model) {
                    PersonalVocabularyModule.Edit.Controller.main(model);
                });
        },
        editItemModel: function (model) {
            this.before();
            PersonalVocabularyModule.Edit.Controller.main(model);
        }
    };

    Lampa.on("dictionary:default", function () {
        Lampa.trigger("dictionary:list");
    });

    Lampa.on("dictionary:list", function () {
        Lampa.navigate("dictionary");
        API.showList();
    });

    Lampa.on("dictionary:add", function () {
        Lampa.navigate("dictionary/add");
        API.addItem();
    });

    Lampa.on("dictionary:edit", function (param) {
            try {
                if (_.isNumber(param)) {
                    Lampa.navigate("dictionary/" + param);
                    API.editItem(param);
                } else {
                    Lampa.navigate("dictionary/" + param.get('dictionaryID'));
                    API.editItemModel(param);
                }
            }
            catch (ex) {
                console.log(ex.message);
            }
        }
    );

    Lampa.addInitializer(function () {
        new PersonalVocabularyModule.Router({
            controller: API
        })
    });
});