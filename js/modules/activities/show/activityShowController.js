/**
 * Created by Roman on 3.6.14.
 */

Lampa.module("ActivitiesModule.Show", function (Show, Lampa, Backbone, Marionette, $, _) {
    Show.Controller = {
        main: function (model) {
            (new Lampa.SkeletonView()).page.show(new Show.Activity({model: model}));
        }
    };
});
