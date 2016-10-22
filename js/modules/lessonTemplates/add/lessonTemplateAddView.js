/**
 * Created by Roman on 11.7.14.
 */

Lampa.module("LessonTemplateModule.Add", function (Add, Lampa, Backbone, Marionette, $, _) {
    Add.LessonTemplate = Marionette.CompositeView.extend({
        template: "lesson/lesson-template-edit-template",
        childView: Add.ActivityTemplate,
        events: {
            "click #save": "saveLessonTemplate",
            "click #back": "goBack"
        },

        goBack: function () {
            window.history.back();
        },

        saveLessonTemplate: function () {
            try {
                this.model.set('title', $("#title").val());
                this.model.set('duration', $("#duration").val());

                this.model.set('descriptionA', $("#descriptionA").val());
                this.model.set('descriptionB', $("#descriptionB").val());
                this.model.set('descriptionC', $("#descriptionC").val());
                this.model.set('materials', $("#materials").val());

                Lampa.request("lessonTemplate:save", this.model);
            }
            catch (ex) {
                console.log(ex.message);
            }
        }
    });

    Add.ActivityTemplate = Marionette.ItemView.extend({

    });
});