/**
 * Created by Roman Brhel on 16.09.2016.
 */
Lampa.module("LessonsModule.LessonReport", function (LessonReport, Lampa, Backbone, Marionette, $) {
    LessonReport.Controller = {
        main: function (lessonID) {
            $.when(Lampa.request("lesson:entity", lessonID)).then(function (model) {
                Lampa.mainRegion.show(new LessonReport.Layout({model: model}));
            });
        }
    };
});