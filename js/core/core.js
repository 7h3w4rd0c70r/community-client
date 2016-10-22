/**
 * Created by Roman on 25.6.14.
 */
Lampa.module("Core", function (Core, Lampa, Backbone, Marionette, $, _) {
    Core.Api = {
        ProgressBar: null,
        Page: null,
        show: function () {
            Core.ProgressBar.Controller.show();
        },
        hide: function () {
            Core.ProgressBar.Controller.hide();
        },
        showPage: function () {
            Core.Page.Controller.show();
        },
        showError: function (details) {
            console.log("Error", details);
            try {
                alert.message("Error/n" + details.toJSON());
            } catch (ex) {
                alert.message("Some error occurred!!");
            }
        }
    };
    Lampa.on("error", function () {
        Core.Api.showError();
    });
    Lampa.on("progressBar:show", function () {
        Core.Api.show();
    });
    Lampa.on("progressBar:hide", function () {
        Core.Api.hide();
    });
    Lampa.on("page:show", function () {
        Lampa.trigger("header:show");
        Core.Api.showPage();
    });
});