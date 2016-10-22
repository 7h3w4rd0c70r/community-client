/*
 * Created by Roman Brhel on 20.09.2016.
 */

Lampa.module("Behaviors", function (Behaviors, Lampa, Backbone, Marionette, $, _) {
    Behaviors.TeacherDetails = Marionette.Behavior.extend({
        defaults: {
            model: null
        },
        ui: {
            item: ".teachers-small"
        },
        events: {
            "mouseover @ui.item": "showDetails"
        },
        showDetails: function (e) {
            if (e && this.view && this.view.model) {
                var element = e.target;
                var title = "";

                if (!element.getAttribute("data-toggle")) {
                    element.setAttribute("data-toggle", "tooltip");
                }

                if (!element.getAttribute("data-placement")) {
                    element.setAttribute("data-placement", "top");
                }

                if (!element.getAttribute("title")) {
                    _.each(this.view.model.get("teachers"), function (person) {
                        $.when(Lampa.request("teacher:cached", person.personID))
                            .then(function (teacher) {
                                title += teacher.get("fullName") + " ";
                            });
                    });
                    element.setAttribute("title", title.trim());
                    $(element).tooltip("show");
                }
            }
        }
    });
});