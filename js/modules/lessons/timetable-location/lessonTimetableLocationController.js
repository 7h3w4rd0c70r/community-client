/**
 * Created by Roman on 3.10.14.
 */

Lampa.module("LessonsModule.TimetableLocation", function (TimetableLocation, Lampa, Backbone, Marionette, $) {
    TimetableLocation.Controller = {
        main: function () {
            var skeleton = new Lampa.SkeletonView();
            var layout = new TimetableLocation.Layout();
          layout.on("show", function () {
                $.when(Lampa.request("location:entities")).done(function (collection) {
                    layout.locationsRegion.show(new TimetableLocation.Locations({collection: collection}));
                });
            });

            skeleton.page.show(layout);
        }
    }
});