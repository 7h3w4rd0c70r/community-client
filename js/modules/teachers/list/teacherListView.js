/**
 * Created by Roman on 25.7.14.
 */

Lampa.module("TeachersModule.List", function (List, Lampa, Backbone, Marionette) {
    List.Teacher = Marionette.ItemView.extend({
        tagName: "tr",
        template: "teacher/list-item",
        className: function () {
            return Lampa.request("role:get") === "a"
                ? (this.model.get("isUser") ? "clickable" : "clickable warning")
                : "clickable";
        },
        events: {
            "click ": "showClicked"
        },
        showClicked: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("teacher:show", this.model.id);
        }
    });

    List.NoTeacherFound = Marionette.ItemView.extend({
        tagName: "tr",
        template: "teacher/list-item-empty"
    });

    List.Teachers = Marionette.CompositeView.extend({
        tagName: "div",
        template: "teacher/list",
        className: "container",
        childView: List.Teacher,
        emptyView: List.NoTeacherFound,
        childViewContainer: "table",
        events: {
            "click #new-item": "addItem"
        },
        addItem: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("teacher:add");
        }
    });
});