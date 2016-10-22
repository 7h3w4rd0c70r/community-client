/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("TeachersModule.Show", function (Show, Lampa, Backbone, Marionette, $) {
    Show.Controller = {
        main: function (entity) {
            (new Lampa.SkeletonView()).page.show(new Show.Teacher({model: entity}));
        }
    };
});