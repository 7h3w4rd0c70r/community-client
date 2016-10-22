/**
 * Created by Roman on 24.9.14.
 */

Lampa.module("LessonsModule.Reschedule", function (Reschedule, Lampa, Backbone, Marionette, $, _) {
    Reschedule.Controller = {
        main: function (model) {
            (new Lampa.SkeletonView()).page.show(new Reschedule.Layout({model: model}));
        }
    };
});
