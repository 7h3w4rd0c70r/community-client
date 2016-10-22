/**
 * Created by Roman on 25.7.14.
 */

Lampa.module("StudentModule.List", function (List, Lampa, Backbone, Marionette, $, _) {
    List.Student = Marionette.ItemView.extend({
        tagName: "tr",
        template: "student/list-item",
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
            Lampa.trigger("student:show", this.model.id);
        }
    });

    List.NoStudent = Marionette.ItemView.extend({
        tagName: "caption",
        template: "student/list-item-empty"
    });

    List.Students = Marionette.CompositeView.extend({
        tagName: "div",
        template: "student/list",
        className: "container",
        childView: List.Student,
        emptyView: List.NoStudent,
        childViewContainer: "table",
        ui: {
            "keyword": "#search-input",
            "search": "#search-btn"
        },
        events: {
            "click #new-item": "addItem",
            "click @ui.search": "searchStudent",
            "keypress :input": "logKey"
        },
        addItem: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("student:add");
        },
        searchStudent: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            Lampa.request("student:search", this.collection, this.ui.keyword.val());
        },
        logKey: function (e) {
            try {
                if (e.keyCode === 13 && e.currentTarget.id === "searchStudent") {
                    this.searchStudent();
                }
            } catch (ex) {
                console.log("Login error: " + ex.message);
            }
        }
    });
});