/**
 * Created by Roman on 24.7.15.
 */

Lampa.module("LessonsModule.Find", function (Find, Lampa, Backbone, Marionette, $) {
    Find.Controller = {
        main: function () {
            $.when(Lampa.request("school:entity"), Lampa.request("role:get")).then(function () {
                (new Lampa.SkeletonView()).page.show(new Find.Layout());
            });
        }
    };
});