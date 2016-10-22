/**
 * Created by Roman on 18.7.14.
 */

Lampa.module("SchoolsModule.Edit", function (Edit, Lampa, Backbone, Marionette, $, _) {
    Edit.School = Lampa.EditableItemView.extend({
        template: "school/edit",
        className: "container",
        saveModelRequest: "school:save",
        ui: {
            name: "#name",
            abbr: "#abbr",
            email: "#email",
            www: "#www",
            lessonDuration: "#lessonDuration",
            firstDate: "#firstDate",
            lastDate: "#lastDate"
        }
    });
});