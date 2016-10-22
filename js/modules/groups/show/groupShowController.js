/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("GroupsModule.Show", function (Show, Lampa, Backbone, Marionette, $, _) {
    Show.Controller = {
        main: function (model) {
            (new Lampa.SkeletonView()).page.show(new Show.Group({model: model}));
        }
    };
});