/**
 * Created by Roman on 29.4.2016.
 */

Lampa.module("Behaviors", function (Behaviors, Lampa, Backbone, Marionette, $, _) {
    Behaviors.Tooltips = Marionette.Behavior.extend({
        defaults: {},
        onShow: function () {
            $("[data-toggle=\"tooltip\"]").tooltip();
        }
    });
});
