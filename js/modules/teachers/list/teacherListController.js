/**
 * Created by Roman on 25.7.14.
 */

Lampa.module("TeachersModule.List", function (List, Lampa, Backbone, Marionette, $, _) {
    List.Controller = {
        main: function () {
            $.when(Lampa.request("teacher:entities")).done(function (collection) {
                (new Lampa.SkeletonView()).page.show(new List.Teachers({collection: collection}));
            });
        }
    };
});