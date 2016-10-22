/**
 * Created by Roman on 3.10.14.
 */

Lampa.module("LessonsModule.DailyGroupsTimetable", function (DailyGroupsTimetable, Lampa, Backbone, Marionette, $, _) {
    DailyGroupsTimetable.Controller = {
        main: function () {
            var skeleton = new Lampa.SkeletonView();
            $.when(Lampa.request('group:entities')).done(function (entities) {
                skeleton.page.show(new DailyGroupsTimetable.Layout({
                    model: Lampa.request('day:entity', Lampa.request('helper:getTodayDate')),
                    collection: entities
                }));
            });
        }
    }
});