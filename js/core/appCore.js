/**
 * Created by Roman on 19.1.2016.
 */
Lampa.module("Core", function (Core, Lampa, Backbone, Marionette, $, _) {
    Core.Api = {
        headerShow: function () {
            if (Core.Header) {
                Core.Header.Controller.main();
            }
        },
        show: function () {
            Core.ProgressBar.Controller.show();
        },
        hide: function () {
            Core.ProgressBar.Controller.hide();
        },
        showPage: function () {
            Core.Page.Controller.show();
        }
    };

    Lampa.on("header:show", function () {
        Core.Api.headerShow();
    });

    Lampa.on("open:start-page", function () {
        Core.Api.headerShow();
    });

    Lampa.on("progressBar:show", function () {
        Core.Api.show();
    });

    Lampa.on("progressBar:hide", function () {
        Core.Api.hide();
    });

    Lampa.on("page:show", function () {
        Core.Api.showPage();
    });
});