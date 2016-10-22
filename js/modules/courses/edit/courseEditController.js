/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("CoursesModule.Edit", function (Edit, Lampa, Backbone, Marionette, $) {
    Edit.Controller = {
        main: function (model) {
            try {
                var skeleton = new Lampa.SkeletonView();
                $.when(Lampa.request('school:entity')).done(function () {
                    skeleton.page.show(new Edit.Course({model: model}));
                });
            }
            catch (ex) {
                console.log(ex.message);
            }
        }
    }
});