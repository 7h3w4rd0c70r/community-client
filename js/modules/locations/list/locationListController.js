/**
 * Created by Roman on 25.7.14.
 */

Lampa.module("LocationsModule.List", function (List, Lampa, Backbone, Marionette, $) {
    List.Controller = {
        main: function () {
            try {
                var skeleton = new Lampa.SkeletonView();
                $.when(Lampa.request("location:entities")).done(function (collection) {
                    skeleton.page.show(new List.Locations({collection: collection}));
                });

            } catch (ex) {
                console.log(ex.message);
            }
        }
    }
});