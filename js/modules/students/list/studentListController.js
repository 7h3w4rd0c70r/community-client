/**
 * Created by Roman on 25.7.14.
 */

Lampa.module("StudentModule.List", function (List, Lampa, Backbone, Marionette, $) {
    List.Controller = {
        main: function () {
            $.when(Lampa.request("student:entities")).done(function (collection) {
                (new Lampa.SkeletonView()).page.show(new List.Students({collection: collection}));
            });
        }
    };
});