/**
 * Created by Roman on 23.5.14.
 */
Lampa.module("ActivitiesModule.DetailedList", function (DetailedList, Lampa, Backbone, Marionette, $, _) {
    DetailedList.Activity = Marionette.ItemView.extend({
        tagName: "li",
        attributes: {draggable: "true"},
        template: "activity/show-template",
        className: "clickable",
        events: {
            "click": "showActivityClicked"
        },
        showActivityClicked: function (e) {
            try {
                e.preventDefault();
                e.stopPropagation();
                Lampa.trigger("activity:show", this.model.get("activityID"));
            }
            catch (ex) {
                console.log(ex.message);
            }
        }
    });

    DetailedList.Activities = Marionette.CompositeView.extend({
            tagName: "div",
            template: "activity/detailedList-template",
            childView: DetailedList.Activity,
            childViewContainer: "ul",
            events: {
                "change #sort": "sortCollection",
                "click #refresh-button": "refreshCollection"
            },
            initialize: function () {
                this.collection.on("add", this.sortCollection, this);
            },
            sortCollection: function () {
                try {
                    var sort = $("#sort");
                    var value = sort.val();

                    if (sort !== undefined) {
                        //sort[0][value].attr('selected', 'selected');
                    }

                    this.collection.comparator = value;
                    this.collection.sort();
                    this.collection.trigger('reset');
                }
                catch (ex) {
                    console.log(ex.message);
                }
            },
            refreshCollection: function (e) {
                try {
                    e.preventDefault();
                    e.stopPropagation();
                    Lampa.request("activities:refresh");
                }
                catch (ex) {
                    console.log(ex.message);
                }
            }
        }
    );
});
