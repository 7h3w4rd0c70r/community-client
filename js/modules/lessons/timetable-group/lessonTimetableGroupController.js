/**
 * Created by Roman on 3.10.14.
 */

Lampa.module("LessonsModule.TimetableGroup", function (TimetableGroup, Lampa, Backbone, Marionette, $) {
        TimetableGroup.Controller = {
            main: function () {
                var skeleton = new Lampa.SkeletonView();
                var layout = new TimetableGroup.Layout();
                layout.on("show", function () {
                        try {
                            $.when(Lampa.request("group:entities")).done(function (collection) {
                                layout.groupsRegion.show(new TimetableGroup.Groups({collection: collection}));
                            });
                        }
                        catch (ex) {
                            console.log(ex.message);
                        }
                    }
                );

                skeleton.page.show(layout);
            }
        }
    }
);