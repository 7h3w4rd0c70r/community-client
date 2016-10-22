/**
 * Created by Roman on 25.7.14.
 */

Lampa.module("LocationsModule.List", function (List, Lampa, Backbone, Marionette) {
    List.Location = Marionette.ItemView.extend({
        tagName: "tr",
        template: "location/list-item",
        className: "clickable",
        events: {
            "click ": "showClicked"
        },
        showClicked: function () {
            Lampa.trigger("location:show", this.model);
        }
    });

    List.NoLocationfound = Marionette.ItemView.extend({
        tagName: "tr",
        template: "location/list-item-empty"
    });

    List.Locations = Marionette.CompositeView.extend({
        tagName: "div",
        template: "location/list",
        className: "container",
        childView: List.Location,
        emptyView: List.NoLocationfound,
        childViewContainer: "table",
        events: {
            "click #new-location": "addItem"
        },
        addItem: function () {
            Lampa.trigger('location:add');
        }
    });

    List.NoData = Marionette.CompositeView.extend({
        tagName: "div",
        template: "core/no-data",
        events: {
            "click #new-location": "newLocation"
        },
        addItem: function () {
            Lampa.trigger('location:add');
        }
    });
});