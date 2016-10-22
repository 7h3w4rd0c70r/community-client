/**
 * Created by Roman on 23.5.14.
 */
Lampa.module("ActivitiesModule.List", function (List, Lampa, Backbone, Marionette, $, _) {
    List.Activity = Marionette.ItemView.extend({
        tagName: "tr",
        attributes: {draggable: "true"},
        template: "activity/list-item-template",
        className: "clickable",
        events: {
            "click": "showActivityClicked"
        },
        showActivityClicked: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("activity:show", this.model.get("activityID"));
        }
    });

    List.Activities = Marionette.CompositeView.extend({
        tagName: "div",
        template: "activity/list-template",
        childView: List.Activity,
        childViewContainer: "table",
        events: {
            "change #sort": "sortCollection",
            "click #refresh-button": "refreshCollection"
        },
        initialize: function () {
            this.collection.on("add", this.sortCollection, this);
        },
        sortCollection: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            this.collection.comparator = $("#sort").val();
            this.collection.sort();
            this.collection.trigger("reset");
        },
        refreshCollection: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.request("activities:refresh");
        }
    });
});