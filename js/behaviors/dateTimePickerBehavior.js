/**
 * Created by Roman on 29.4.2016.
 */

Lampa.module("Behaviors", function (Behaviors, Lampa, Backbone, Marionette, $, _) {
    Behaviors.DateTimePicker = Marionette.Behavior.extend({
        defaults: {},
        settings: function () {
            var _this = this;
            $(".date-picker").datetimepicker({
                format: "YYYY-MM-DD",
                showTodayButton: true
            }).on("dp.change", function (e) {
                var element = {};
                element.target = e.target.children[0];
                if (typeof _this.view.serialize === "function") {
                    _this.view.serialize(element);
                }
            });
            $(".time-picker").datetimepicker({format: "HH:mm"})
                .on("dp.change", function (e) {
                    var element = {target: e.target.children[0]};
                    if (typeof _this.view.serialize === "function") {
                        _this.view.serialize(element);
                    }
                });
            $(".datetime-picker").datetimepicker({format: "YYYY-MM-DD HH:mm"})
                .on("dp.change", function (e) {
                    var element = {target: e.target.children[0]};
                    if (typeof _this.view.serialize === "function") {
                        _this.view.serialize(element);
                    }
                });
        },
        onShow: function () {
            this.settings();
        },
        onRender: function () {
            this.settings();
        }
    });
});
