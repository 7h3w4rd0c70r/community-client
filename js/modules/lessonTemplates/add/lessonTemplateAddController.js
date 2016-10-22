/**
 * Created by Roman on 11.7.14.
 */

Lampa.module("LessonTemplateModule.Add", function (Add, Lampa, Backbone, Marionette, $, _) {
    Add.Controller = {
        addLessonTemplate: function () {
            try {
                var lessonTemplate = Lampa.request("lessonTemplate:new", null);
                var view = new Add.LessonTemplate({model: lessonTemplate});
                Lampa.mainRegion.show(view);
            }
            catch (ex) {
                console.log(ex.message);
            }
        }
    }
});