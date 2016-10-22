/**
 * Created by Roman Brhel on 20.09.2016.
 */

Lampa.module("Behaviors", function (Behaviors, Lampa, Backbone, Marionette, $, _) {
    Behaviors.CourseDetails = Marionette.Behavior.extend({
        defaults: {
            model: null
        },
        ui: {
            item: ".course"
        },
        events: {
            "mouseenter @ui.item": "showDetails",
            "mouseout @ui.item": "hideDetails"
        },
        showDetails: function (e) {
            if (e && this.view.model) {
                $.when(Lampa.request("course:cached", this.view.model.get("courseID")))
                    .then(function (course) {
                        try {
                            var element = e.target;
                            if (!element.getAttribute("data-toggle")) {
                                element.setAttribute("data-toggle", "tooltip");
                            }
                            if (!element.getAttribute("data-placement")) {
                                element.setAttribute("data-placement", "top");
                            }
                            if (!element.getAttribute("title")) {
                                element.setAttribute("title", course.get("name"));
                            }
                            $(element).tooltip("show");
                        } catch (ex) {
                            Lampa.error(ex);
                        }
                    });
            }
        },
        hideDetails: function (e) {
            if (e) {
                var element = e.target;
                $(element).tooltip("hide");
            }
        }
    });
});