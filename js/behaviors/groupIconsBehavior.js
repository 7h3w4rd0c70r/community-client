/**
 * Created by Roman Brhel on 20.09.2016.
 */

Lampa.module("Behaviors", function (Behaviors, Lampa, Backbone, Marionette, $, _) {
    Behaviors.GroupIcons = Marionette.Behavior.extend({
        defaults: {
            horizontal: false,
            size: "small",
            show: true
        },
        showIcon: function (model) {
            var element = $(".group-".concat(model.id.toString()));
            var content;
            var tag = this.options.horizontal ? "span" : "div";
            if (element.length > 0) {
                content = "<".concat(tag, " class=\"groups-", this.options.size, " group-", this.options.size, "-", model.get("icon") ? model.get("icon").toString() : "0", "\"></", tag, ">");
                content = content.concat(" <", tag, " class=\"abbr\">", model.get("abbr"), "</", tag, ">");
                element.html(content);
            }
        },
        onShowAllIcons: function () {
            var _this = this;
            $.when(Lampa.request("group:entities"))
                .then(
                    function (collection) {
                        collection.each(function (model) {
                            _this.showIcon(model);
                        });
                    }
                );
        },
        onRender: function () {
            if (this.options.show) {
                this.onShowAllIcons();
            }
        },
        onShow: function () {
            if (this.options.show) {
                this.onShowAllIcons();
            }
        }
    });
});