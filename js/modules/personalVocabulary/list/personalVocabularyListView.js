/**
 * Created by Roman on 25.7.14.
 */

Lampa.module("PersonalVocabularyModule.List", function (List, Lampa, Backbone, Marionette, $, _) {
    List.Vocabulary = Marionette.ItemView.extend({
        tagName: "tr",
        template: "dictionary/list-item",
        className: "clickable",
        events: {
            "click ": "clicked"
        },
        clicked: function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.target.className.search("delete") !== -1) {
                this.model.destroy();
            } else {
                Lampa.trigger("dictionary:edit", this.model.id);
            }
        }
    });

    List.Vocabularies = Marionette.CompositeView.extend({
        template: "dictionary/list",
        className: "container",
        childView: List.Vocabulary,
        childViewContainer: "table",
        initialize: function () {
            this.model = new Backbone.Model({sort: "term", order: "ascending"});
        },
        ui: {
            "add": "#new-item",
            "term": "#term",
            "translation": "#translation",
            "score": "#score"
        },
        events: {
            "click @ui.add": "addItem",
            "click @ui.term": "changeCollectionSort",
            "click @ui.translation": "changeCollectionSort",
            "click @ui.score": "changeCollectionSort"
        },
        addItem: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("dictionary:add");
        },
        changeCollectionSort: function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.currentTarget) {
                var order = this.model.get("order");
                if (e.currentTarget.id === this.model.get("sort")) {
                    this.model.set("order", order === "ascending" ? "descending" : "ascending");
                } else {
                    this.model.set("sort", e.currentTarget.id);
                    this.model.set("order", "ascending");
                }
            }

            if (this.collection && this.model) {
                this.collection.comparator = this.model.get("sort");
                this.collection.sort();

                if (this.model.get("order") === "descending") {
                    this.collection.models.reverse();
                }
                this.render();
            }
        }
    });

    List.NoData = Marionette.CompositeView.extend({
        template: "core/no-data",
        events: {
            "click #new-item": "addItem"
        },
        addItem: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("dictionary:add");
        }
    });
});