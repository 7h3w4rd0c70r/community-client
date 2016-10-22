/**
 * Created by Roman Brhel on 3.6.14.
 */

Lampa.module("LessonsModule.Show", function (Show, Lampa, Backbone, Marionette, $) {
    Show.Controller = {
        main: function (lessonID) {
            try {
                var skeleton = new Lampa.SkeletonView();
                $.when(Lampa.request('lesson:entity', lessonID)).then(function (model) {
                    skeleton.page.show(new Show.Lesson({model: model}));
                });
            }
            catch (ex) {
                console.log(ex.message);
            }
        }
    };
});
