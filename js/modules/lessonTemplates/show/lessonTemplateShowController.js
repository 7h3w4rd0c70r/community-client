/**
 * Created by Roman on 14.7.14.
 */

Lampa.module("LessonTemplateModule.Show", function (Show, Lampa, Backbone, Marionette, $, _) {
    Show.Controller = {
        showLessonTemplate: function (id) {
            try {

                var model = Lampa.request("lessonTemplate:entity", id);
                var collection = Lampa.request("lessonTemplateActivity:entities", id);

                var entityView = new Show.LessonTemplate({
                    model: model,
                    collection: collection
                });
                Lampa.mainRegion.show(entityView);

            }
            catch (ex) {
                console.log(ex.message);
            }
        }
    }
});