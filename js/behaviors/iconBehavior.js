/**
 * Created by Roman Brhel on 16.06.2016.
 */
Lampa.module("Behaviors", function (Behaviors, Lampa, Backbone, Marionette, $, _) {
    Behaviors.Icon = Marionette.Behavior.extend({
        defaults: {},
        ui: {
            icons: ".item-icon-sm"
        },
        events: {
            "click .item-icon-sm": "changeIcon"
        },
        changeIcon: function (e) {
            if (typeof this.view.model === "object") {
                this.view.model.set("icon", e.target.dataset["value"]);
                if (this.view.model.id !== null) {
                    this.view.model.save();
                }
                this.view.render();
            }
        }
    });
});