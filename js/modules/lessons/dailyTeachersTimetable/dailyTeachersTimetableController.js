/**
 * Created by Roman on 3.10.14.
 */

Lampa.module("LessonsModule.DailyTeachersTimetable", function (DailyTeachersTimetable, Lampa, Backbone, Marionette, $, _) {
    DailyTeachersTimetable.Controller = {
        main: function () {
            var skeleton = new Lampa.SkeletonView();
            $.when(Lampa.request('teacher:entities')).done(function (entities) {
                skeleton.page.show(new DailyTeachersTimetable.Layout({
                    model: Lampa.request('day:entity', Lampa.request('helper:getTodayDate')),
                    collection: entities
                }));
            });
        }
    }
});