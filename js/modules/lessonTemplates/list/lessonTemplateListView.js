/**
 * Created by Roman on 14.7.14.
 */
Lampa.module("LessonTemplateModule.List", function (List, Lampa, Backbone, Marionette) {
    List.LessonTemplate = Marionette.ItemView.extend({
        tagName: "tr",
        template: "lesson/lesson-template-list-item-template",
        className: "clickable",
        events: {
            "click": "showClicked"
        },

        showClicked: function (e) {
            try {
                e.preventDefault();
                e.stopPropagation();
                Lampa.trigger("lessonTemplate:show", this.model.get("templateId"));
            }
            catch (ex) {
                console.log(ex.message);
            }
        },

        initialize: function () {
            this.model.on('change', this.render, this);
        }
    });

    List.LessonTemplates = Marionette.CompositeView.extend({
            id: 'templateId',
            template: "lesson/lesson-template-list-template",
            childView: List.LessonTemplate,
            childViewContainer: "table"
        }
    );

    List.NoData = Marionette.CompositeView.extend({
            template: "core/no-data"
        }
    );
});