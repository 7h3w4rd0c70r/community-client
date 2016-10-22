/**
 * Created by Roman on 29.4.2016.
 */

Lampa.module("Behaviors", function (Behaviors, Lampa, Backbone, Marionette, $, _) {
    Behaviors.ElasticTextArea = Marionette.Behavior.extend({
        defaults: {},
        onShow: function () {
            $("textarea").elastic();
        }
    });
});
