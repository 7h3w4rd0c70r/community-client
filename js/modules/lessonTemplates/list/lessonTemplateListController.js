/**
 * Created by Roman on 14.7.14.
 */
Lampa.module("LessonTemplateModule.List", function (List, Lampa, Backbone, Marionette, $) {
    List.Controller = {
        listLessonTemplates: function () {
            try {
                $.when(Lampa.request("lessonTemplates:entities")).done(function (lessonTemplate) {
                        var listView;

                        if (lessonTemplate !== undefined) {
                            listView = new List.LessonTemplates({
                                collection: lessonTemplate
                            });

                            listView.on("itemview.lessonTemplate.show", function (childView, model) {
                                    Lampa.trigger("lessonTemplate:show", 1);
                                }
                            );
                        }
                        else {
                            listView = new List.NoData();
                        }
                        Lampa.mainRegion.show(listView);
                    }
                );

            } catch (ex) {
                console.log(ex.message);
            }
        }
    }
});