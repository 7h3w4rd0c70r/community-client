/**
 * Created by Roman on 25.7.14.
 */

Lampa.module("CoursesModule.List", function (List, Lampa, Backbone, Marionette, $) {
    List.Controller = {
        main: function () {
            try {
                var skeleton = new Lampa.SkeletonView();

                $.when(Lampa.request("course:entities")).done(function (data) {
                        var listView;

                        if (data !== undefined) {
                            listView = new List.Courses({
                                collection: data
                            });

                            listView.on("itemview.lessonTemplate.show", function (childView, model) {
                                    Lampa.trigger("course:show", model.id);
                                }
                            );
                        }
                        else {
                            listView = new List.NoData();
                        }
                        skeleton.page.show(listView);
                    }
                );

            } catch (ex) {
                console.log(ex.message);
            }
        }
    }
});