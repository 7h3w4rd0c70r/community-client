/**
 * Created by Roman on 23.6.14.
 */

Lampa.module("ActivitiesModule.Edit", function (Edit, Lampa, Backbone, Marionette, $, _) {
    Edit.Controller = {
        main: function (model) {
            (new Lampa.SkeletonView()).page.show(new Edit.Activity({model: model}));
        }
    };
});