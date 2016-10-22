/**
 * Created by Roman on 17.12.14.
 */
Lampa.module("ReportsModule.TeacherLessons", function (TeacherLessons, Lampa, Backbone, Marionette, $) {
    TeacherLessons.Controller = {
        main: function () {
            try {
                var skeleton = new Lampa.SkeletonView();
                $.when(Lampa.request("school:entity")).done(function (model) {
                    var view = new TeacherLessons.Form({model: model});
                    skeleton.page.show(view);
                    $.when(Lampa.request("teacher:entities")).done(function (collection) {
                        view.teacherRegion.show(new TeacherLessons.Teachers({collection: collection}));
                    });
                });
            }
            catch (ex) {
                console.log(ex.message);
            }
        }
    }
});