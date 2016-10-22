/**
 * Created by Roman Brhel on 3.6.14.
 */

Lampa.module("LessonsModule.Student", function (Student, Lampa, Backbone, Marionette, $,_) {
    Student.Controller = {
        main: function (lessonID) {
            $.when(Lampa.request("lesson:entity", lessonID)).then(function (model) {
                (new Lampa.SkeletonView()).page.show(new Student.Lesson({model: model}));
            });
        }
    };
});
