/**
 * Created by Roman on 3.10.14.
 */

Lampa.module("LessonsModule.Timetable", function (Timetable, Lampa, Backbone, Marionette, $) {
    Timetable.Controller = {
        main: function () {
            var skeleton = new Lampa.SkeletonView();
            var layout = new Timetable.Layout();
           layout.on("show", function () {
                try {
                    $.when(Lampa.request("teacher:entities")).done(function (collection) {
                        layout.teachersRegion.show(new Timetable.Teachers({collection: collection}));
                    });

                    $.when(Lampa.request("group:entities")).done(function (collection) {
                        layout.groupsRegion.show(new Timetable.Groups({collection: collection}));
                    });

                    $.when(Lampa.request("location:entities")).done(function (collection) {
                        layout.locationsRegion.show(new Timetable.Locations({collection: collection}));
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