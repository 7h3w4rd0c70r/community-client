/**
 * Created by Roman on 25.7.14.
 */

Lampa.module("GroupsModule.List", function (List, Lampa, Backbone, Marionette, $, _) {
    List.Group = Marionette.ItemView.extend({
        tagName: "tr",
        template: "group/list-item",
        className: "clickable",
        events: {
            "click ": "showClicked"
        },
        showClicked: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("group:show", this.model.id);
        }
    });

    List.NoGroupFound = Marionette.ItemView.extend({
        tagName: "tr",
        template: "group/list-item-empty"
    });

    List.Groups = Marionette.CompositeView.extend({
        template: "group/list",
        className: "container",
        emptyView: List.NoGroupFound,
        childView: List.Group,
        childViewContainer: "table",
        ui: {
            "keyword": "#search-input",
            "search": "#search-btn"
        },
        events: {
            "click #new-item": "addItem",
            "click @ui.search": "search",
            "keypress :input": "logKey"
        },
        addItem: function () {
            Lampa.trigger("group:add");
        },
        search: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            var _this = this;
            var keyWord = this.ui.keyword.val();
            $.when(Lampa.request("group:search", this.collection, keyWord)).then(function (groups) {
                _this.collection = groups;
                _this.render();
            }).then(function () {
                _this.ui.keyword.val(keyWord);
            });
        },
        logKey: function (e) {
            if (e.keyCode === 13 && e.currentTarget.id === "search") {
                this.search();
            }
        }
    });

    List.NoData = Marionette.CompositeView.extend({
        template: "core/no-data",
        events: {
            "click #new-group": "addItem"
        },
        addItem: function () {
            Lampa.trigger('group:add');
        }
    });
});