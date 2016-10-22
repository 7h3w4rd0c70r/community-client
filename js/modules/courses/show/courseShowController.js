/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("CoursesModule.Show", function (Show, Lampa, Backbone, Marionette, $) {
    Show.Controller = {
        main: function (model) {
            try {
                var skeleton = new Lampa.SkeletonView();
                var view = new Show.Course({
                    model: model
                });
                skeleton.page.show(view);
            }
            catch (ex) {
                console.log(ex.message);
            }
        }
    }
});