/**
 * Created by Roman Brhel on 20.09.2016.
 */

Lampa.module("Behaviors", function (Behaviors, Lampa, Backbone, Marionette, $, _) {
    Behaviors.CourseIcons = Marionette.Behavior.extend({
        defaults: {
            horizontal: false,
            size: "sm",
            show: true,
            icon: true
        },
        showIcon: function (model) {
            var element = $(".course.id-" + model.id.toString());
            var content = "";
            var tag = this.options.horizontal ? "span" : "div";
            if (element.length > 0) {
                if (this.options.icon) {
                    content = content.concat("<", tag, " class=\"glyphicon glyphicon-book ic-", this.options.size, " ic-", model.get("icon") ? model.get("icon").toString() : "0", "\"></", tag, ">");
                }
                content = content.concat(" <", tag, " class=\"abbr\">", model.get("abbr"), "</", tag, ">");
                element.html(content);
            }
        },
        onShowAllIcons: function () {
            var _this = this;
            $.when(Lampa.request("course:entities"))
                .then(
                    function (collection) {
                        collection.each(function (model) {
                            _this.showIcon(model, _this.options.horizontal);
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