/**
 * Created by Roman on 17.7.14.
 */

Lampa.module("Core.Page", function (Page, Lampa, Backbone, Marionette, $, _) {
    Page.View = Marionette.ItemView.extend({
        template: "core/page",
        model: Lampa.Entities.Page,
        modelChange: {
            "change": "render"
        }
    });
});