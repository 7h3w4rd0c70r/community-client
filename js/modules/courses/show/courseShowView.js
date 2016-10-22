/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("CoursesModule.Show", function (Show, Lampa, Backbone, Marionette) {
    Show.Course = Marionette.ItemView.extend({
        template: "course/show",
        className: "container",
        events: {
            "click #edit": "editItem",
            "click #delete": "deleteItem",
            "click #back": "goBack"
        },
        modelEvents: {
            "change": "render"
        },
        goBack: function () {
            window.history.back();
        },
        editItem: function () {
            Lampa.trigger("course:edit", this.model.get('courseID'));
        },
        deleteItem: function () {
            Lampa.request("course:delete", this.model);
        }
    });
});