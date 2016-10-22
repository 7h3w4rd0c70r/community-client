/**
 * Created by Roman on 24.9.14.
 */

Lampa.module("LessonsModule.Cancel", function (Cancel, Lampa, Backbone, Marionette, $) {
    Cancel.Controller = {
        show: function (layout) {
            var lessonID = layout.model.get('lessonID');
            var groupID = layout.model.get('groupID');

            try {
                $.when(Lampa.request("lesson:neighbours", lessonID)).done(
                    function (model) {
                        layout.groupRegion.show(new Cancel.LessonGroup({model: model}));
                    }
                );

                $.when(Lampa.request("location:entity", layout.model.get('locationID'))).done(
                    function (model) {
                        layout.locationRegion.show(new Cancel.LessonLocation({model: model}));
                    }
                );

                $.when(Lampa.request("course:entity", layout.model.get('courseID'))).done(
                    function (model) {
                        layout.courseRegion.show(new Cancel.LessonCourse({model: model}));
                    }
                );

                $.when(Lampa.request("lesson:teachers", lessonID)).done(
                    function (collection) {
                        layout.teacherRegion.show(new Cancel.LessonTeachers({collection: collection}));
                    }
                );

                layout.statusTimeRegion.show(new Cancel.LessonStatusTime({model: layout.model}));
            }
            catch (ex) {
                console.log(ex.message);
            }
        },
        main: function (model) {
            try {
                this.model = model;
                var layout = new Cancel.Layout({model: this.model});
                layout.on("show", function () {
                    Cancel.Controller.show(layout);
                });

                var skeleton = new Lampa.SkeletonView();
                skeleton.page.show(layout);
            }
            catch (ex) {
                console.log(ex.message);
            }
        }
    }
});
