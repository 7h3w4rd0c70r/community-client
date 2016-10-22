/**
 * Created by Roman on 10.12.14.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Line = Backbone.Model.extend({
        url: function () {
            return '';
        },
        defaults: {
            text: ''
        }
    });

    Entities.LineApi = Entities.Api.extend({
        loadEntity: function (text) {
            var model = new Entities.Line();
            model.set('text', text);
            return model;
        }
    });

    var api = new Entities.LineApi();

    Lampa.reqres.setHandler("line:entity", function (text) {
        return api.loadEntity(text);
    });
});