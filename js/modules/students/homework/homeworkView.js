/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("StudentModule.Homework", function (Homework, Lampa, Backbone, Marionette, $) {
    Homework.Item = Marionette.ItemView.extend({
        template: "student/homework-item",
        tagName: "tr",
        className: function () {
            return Lampa.request("helper:timeLineClass", this.model.get("due"));
        }
    });

    Homework.None = Marionette.ItemView.extend({
        template: "student/homework-none",
        tagName: "tr"
    });

    Homework.List = Marionette.CompositeView.extend({
        template: "student/homework-list",
        className: "container",
        childView: Homework.Item,
        emptyView: Homework.None,
        childViewContainer: "tbody"
    });
});