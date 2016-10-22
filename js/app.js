/**
 * Created by Roman on 5.12.14.
 */

var Lampa = Lampa || new Backbone.Marionette.Application();

Lampa.restUrl = Services.restUrl;

Lampa.addRegions({
    headRegion: "#header",
    mainRegion: "#page",
    spinnerRegion: "#progressBar"
});

Lampa.trackPage = function () {
    if (Services.googleAnalyticsEnabled && _.isFunction(ga)) {
        ga('send', 'pageview', Backbone.history.root + Backbone.history.fragment);
    }
};

Lampa.navigate = function (route, options) {
    options || (options = {});
    $.when(Lampa.request('role:load'))
        .then(function () {
            Backbone.history.navigate(route, options);
            if (!options.trigger) {
                Lampa.trackPage();
            }
        })
        .fail(function () {
            Lampa.trigger("logout");
        });
};

Backbone.history.on("all", function (route, router) {
    Lampa.trackPage();
});

Lampa.getCurrentRoute = function () {
    return Backbone.history.fragment;
};

Lampa.on("start", function () {
    var _this = this;
    Lampa.trigger("progressBar:show");
    if (Backbone.history) {
        Backbone.history.start();
        if (_this.getCurrentRoute() === "") {
            $.when(Lampa.request('role:load'))
                .then(function () {
                    Lampa.trigger("account:welcome");
                })
                .fail(function () {
                    Lampa.trigger("logout");
                });
        }
    }
    Lampa.trigger("progressBar:hide");
});

Marionette.Behaviors.behaviorsLookup = function () {
    return Lampa.Behaviors;
};

Lampa.on("logout", function () {
    Lampa.request("logout:user");
    Lampa.request("activities:clear");
    window.location = "index.html";
});

$(document).ready(function () {
    Lampa.start();
});