/**
 * Created by Roman on 24.6.14.
 */
Lampa.module("Core.ProgressBar", function (ProgressBar, Lampa, Backbone, Marionette, $, _) {
    ProgressBar.loadingView = Marionette.ItemView.extend({
        template: "core/progress-bar",
        onShow: function () {
            try {
                var opts = {
                    lines: 13, // The number of lines to draw
                    length: 0, // The length of each line
                    width: 10, // The line thickness
                    radius: 20, // The radius of the inner circle
                    corners: 1, // Corner roundness (0..1)
                    rotate: 0, // The rotation offset
                    direction: 1, // 1: clockwise, -1: counterclockwise
                    color: "#000", // #rgb or #rrggbb or array of colors
                    speed: 1, // Rounds per second
                    trail: 72, // Afterglow percentage
                    shadow: false, // Whether to render a shadow
                    hwaccel: false, // Whether to use hardware acceleration
                    className: "spinner", // The CSS class to assign to the progressBar
                    zIndex: 2e9, // The z-index (defaults to 2000000000)
                    top: "50%", // Top position relative to parent 50%
                    left: "50%" // Left position relative to parent 50%
                };

                if (ProgressBar.spinner) {
                    ProgressBar.spinner.stop();
                }
                ProgressBar.spinner = new Spinner(opts).spin( document.getElementById("progressBar"));
            } catch (ex) {
                console.log(ex.message);
            }
        }
    });

    ProgressBar.emptyView = Marionette.ItemView.extend({
        template: "core/progress-bar-empty"
    });
});
