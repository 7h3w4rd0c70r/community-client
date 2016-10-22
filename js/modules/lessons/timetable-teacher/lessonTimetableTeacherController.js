/**
 * Created by Roman on 3.10.14.
 */

Lampa.module("LessonsModule.TimetableTeacher", function (TimetableTeacher, Lampa, Backbone, Marionette, $) {
    TimetableTeacher.Controller = {
        main: function () {
            var skeleton = new Lampa.SkeletonView();
            var layout = new TimetableTeacher.Layout();

            layout.on("show", function () {
                try {
                    $.when(Lampa.request("teacher:entities")).done(function (collection) {
                        layout.teachersRegion.show(new TimetableTeacher.Teachers({collection: collection}));
                    });
                }
                catch (ex) {
                    console.log(ex.message);
                }
            });
            skeleton.page.show(layout);
        }
    }
});