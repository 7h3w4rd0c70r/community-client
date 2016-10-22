/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("LocationsModule.Show", function (Show, Lampa, Backbone, Marionette, $) {
    Show.Controller = {
        main: function (model) {
            try {
                (new Lampa.SkeletonView()).page.show(new Show.Location({model: model}));
            }
            catch (ex) {
                console.log(ex.message);
            }
        }
    }
});