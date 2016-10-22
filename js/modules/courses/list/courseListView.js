/**
 * Created by Roman on 25.7.14.
 */

Lampa.module("CoursesModule.List", function (List, Lampa, Backbone, Marionette) {
    List.Course = Marionette.ItemView.extend({
        tagName: "tr",
        template: "course/list-item",
        className: "clickable",
        events: {
            "click ": "showClicked"
        },
        modelEvents: {
            "change": "render"
        },
        showClicked: function (e) {
            try {
                e.preventDefault();
                e.stopPropagation();
                Lampa.trigger("course:show", this.model.get('courseID'));
            }
            catch (ex) {
                console.log(ex.message);
            }
        }
    });
    List.NoCourseFound = Marionette.ItemView.extend({
        tagName: "tr",
        template: "course/list-item-empty"
    });

    List.Courses = Marionette.CompositeView.extend({
            tagName: "div",
            template: "course/list",
            className: "container",
            emptyView: List.NoCourseFound,
            childView: List.Course,
            childViewContainer: "table",
            events: {
                "click #new-item": "addItem"
            },
            addItem: function () {
                Lampa.trigger('course:add');
            }
        }
    );

    List.NoData = Marionette.CompositeView.extend({
            tagName: "div",
            template: "core/no-data",
            events: {
                "click #new-item": "addItem"
            },
            addItem: function () {
                Lampa.trigger('course:add');
            }
        }
    );
});