/**
 * Created by Roman Brhel on 20.09.2016.
 */

Lampa.module("Behaviors", function (Behaviors, Lampa, Backbone, Marionette, $, _) {
    Behaviors.GroupDetails = Marionette.Behavior.extend({
        defaults: {
            model: null
        },
        ui: {
            item: ".groups-small"
        },
        events: {
            "mouseover @ui.item": "showDetails"
        },
        showDetails: function (e) {
            if (e && this.view.model) {
                $.when(Lampa.request("group:cached", this.view.model.get("groupID")))
                    .then(function (group) {
                        try {
                            var element = e.target;
                            if (!element.getAttribute("data-toggle")) {
                                element.setAttribute("data-toggle", "tooltip");
                            }
                            if (!element.getAttribute("data-placement")) {
                                element.setAttribute("data-placement", "top");
                            }
                            if (!element.getAttribute("title")) {
                                element.setAttribute("title", group.get("name"));
                            }
                            $(element).tooltip("show");
                        } catch (ex) {
                            Lampa.error(ex);
                        }
                    });
            }
        }
    });
});