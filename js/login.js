/**
 * Created by Roman on 5.12.14.
 */

Lampa = new Backbone.Marionette.Application();

Lampa.restUrl = Services.restUrl;

Lampa.addRegions({
    headRegion: "#header",
    mainRegion: "#page",
    spinnerRegion: "#progressBar"
});

Lampa.navigate = function (route, options) {
    options || (options = {});
    Backbone.history.navigate(route, options);
};

Lampa.getCurrentRoute = function () {
    return Backbone.history.fragment;
};

Lampa.on("start", function () {
    this.trigger("progressBar:show");
    this.trigger("footer:show");

    if (Backbone.history) {
        Backbone.history.start();
        if (this.getCurrentRoute() === "") {
            this.trigger("security:login");
        }
    }

    this.trigger("progressBar:hide");
});

Marionette.Behaviors.behaviorsLookup = function () {
    return Lampa.Behaviors;
};

$(document).ready(function () {
    Lampa.start();
});