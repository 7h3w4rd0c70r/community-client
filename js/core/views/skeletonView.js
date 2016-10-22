/**
 * Created by Roman on 10.12.14.
 */

Lampa.LineView = Marionette.LayoutView.extend({
    template: "core/top-line"
});

Lampa.SkeletonView = Marionette.LayoutView.extend({
    template: "core/skeleton",
    useMaxWide: "container",
    className: "container-fluid",
    ui: {
        content: "#content"
    },
    regions: {
        line: "#top-line",
        page: "#content"
    },
    pageView: null,
    lineView: null,
    initialize: function (line) {
        var _this = this;
        try {
            Lampa.request("role:load");
            _this.lineView = line || null;
            Lampa.mainRegion.show(_this);
        } catch (ex) {
            Lampa.error(ex);
        }
    },
    onShow: function () {
        var _this = this;
        try {
            if (_this.pageView && typeof(_this.pageView["once"]) !== "undefined") {
                _this.menu.show(_this.pageView);
            }
            if (_this.lineView && typeof(_this.lineView["once"]) !== "undefined") {
                _this.line.show(_this.lineView);
            }
        } catch (ex) {
            Lampa.error(ex);
        }
    }
});
