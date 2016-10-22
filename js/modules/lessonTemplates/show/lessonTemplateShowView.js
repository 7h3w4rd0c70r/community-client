/**
 * Created by Roman on 14.7.14.
 */

Lampa.module("LessonTemplateModule.Show", function (Show, Lampa, Backbone, Marionette, $, _) {
    Show.LessonTemplateActivity = Marionette.ItemView.extend({
        template: "lesson/lesson-template-activity-show-template",
        tagName: 'tr'
    });

    Show.LessonTemplate = Marionette.CompositeView.extend({
        template: "lesson/lesson-template-show-template",
        childView: Show.LessonTemplateActivity,
        childViewContainer: "table",

        events: {
            "click #edit": "editLessonTemplate",
            "click #delete": "deleteLessonTemplate",
            "click #back": "goBack"
        },

        initialize: function () {
            this.model.on('change', this.render, this);
        },

        goBack: function () {
            window.history.back();
        },

        editActivityId: function () {
            Lampa.trigger("lessonTemplate:edit", this.model.id);
        },

        deleteActivity: function () {
            Lampa.request("lessonTemplate:delete", this.model);
        }
    });
});