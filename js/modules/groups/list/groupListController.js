/**
 * Created by Roman on 25.7.14.
 */

Lampa.module("GroupsModule.List", function (List, Lampa, Backbone, Marionette, $, _) {
    List.Controller = {
        main: function () {
            $.when(Lampa.request("group:entities")).done(function (collection) {
                (new Lampa.SkeletonView()).page.show(new List.Groups({collection: collection}));
            });
        }
    };
});