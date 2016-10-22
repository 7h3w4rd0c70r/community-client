/**
 * Created by Roman on 24.6.14.
 */
Lampa.module("Core.ProgressBar", function (ProgressBar, Lampa, Backbone, Marionette, $, _) {
    ProgressBar.Controller = {
        show: function () {
            $("#progressBar").show();
            Lampa.spinnerRegion.show(new Lampa.Core.ProgressBar.loadingView());
        },
        hide: function () {
            Lampa.spinnerRegion.show(new Lampa.Core.ProgressBar.emptyView());

            if (ProgressBar.spinner) {
                ProgressBar.spinner.stop();
            }
            $("#progressBar").hide();
        },
        spinner: null
    };
});