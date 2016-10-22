/**
 * Created by Roman on 23.5.14.
 */

Lampa.module("ActivitiesModule.List", function (List, Lampa, Backbone, Marionette, $, _) {
    List.Controller = {
        main: function () {
            var skeleton = new Lampa.SkeletonView();
            
            var view = new List.Activities({
                collection: Lampa.request("activity:entities")
            });

            Lampa.request("accounts:creators");
            skeleton.page.show(view);
        }
    }
});