/**
 * Created by Roman on 3.10.14.
 */
Lampa.module("LessonsModule.DailyLocationsTimetable", function (DailyLocationsTimetable, Lampa, Backbone, Marionette, $, _) {
    DailyLocationsTimetable.Controller = {
        main: function () {
            var skeleton = new Lampa.SkeletonView();
            $.when(Lampa.request('location:entities')).done(function (entities) {
                skeleton.page.show(new DailyLocationsTimetable.Layout({
                    model: Lampa.request('day:entity', Lampa.request('helper:getTodayDate')),
                    collection: entities
                }));
            });
        }
    }
});