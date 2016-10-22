/**
 * Created by Roman on 5.12.14.
 */
Backbone.Marionette.Renderer.render = function (template, data) {
    try {
        if (!JST["templates/" + template + ".html"]) {
            Lampa.error("Undefined template name!");
            return;
        }
        return JST["templates/" + template + ".html"](data);
    } catch (ex) {
        var message = ("templates/" + template + ".html") || "this";
        message += " is invalid template!";
        Lampa.error(message, ex.message);
    }
};