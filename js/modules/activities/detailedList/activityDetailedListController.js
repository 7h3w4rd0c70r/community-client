/**
 * Created by Roman on 23.5.14.
 */

Lampa.module("ActivitiesModule.DetailedList", function (DetailedList, Lampa, Backbone, Marionette, $, _) {
    DetailedList.Controller = {
        gridActivities: function () {
            var skeleton = new Lampa.SkeletonView();

            $.when(Lampa.request("side-menu:entity")).done(function (model) {
                model.set('role', 'admin');
                model.set('selected', 'show-public-activities');
                skeleton.menu.show(Lampa.request("menu:activity", {model: model}));
            });

            var fetching = Lampa.request("activities:entities", null);

            $.when(fetching).done(function (activities) {
                var view;

                if (activities !== undefined) {
                    view = new DetailedList.Activities({
                        collection: activities
                    });
                }
                else {
                    view = new DetailedList.MissingActivities();
                }

                skeleton.page.show(view);

                view.on("itemview.activity:show", function (childView, model) {
                    Lampa.trigger("activity:show", model.get("id"));
                });
            });
        }
    }
});