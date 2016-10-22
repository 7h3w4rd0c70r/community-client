/**
 * Created by Roman on 8.12.14.
 */
Lampa.module("PeriodsModule.NonTeachingDays", function (NonTeachingDays, Lampa, Backbone, Marionette, $) {
    NonTeachingDays.Controller = {
        main: function () {
            try {
                var skeleton = new Lampa.SkeletonView();
                $.when(Lampa.request("school:non-teaching-days")).done(function (collection) {
                    skeleton.page.show(new NonTeachingDays.Days({collection: collection}));
                });
            }
            catch (ex) {
                console.log(ex.message);
            }
        }
    }
});