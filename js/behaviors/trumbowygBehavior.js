/**
 * Created by Roman on 29.4.2016.
 */

Lampa.module("Behaviors", function (Behaviors, Lampa, Backbone, Marionette, $, _) {
    Behaviors.Trumbowyg = Marionette.Behavior.extend({
        defaults: {
            item: null,
            menu: true
        },
        onRender: function () {
            try {
                var element = this.ui[this.options.item];
                var settings = {
                    autogrow: true,
                    mobile: true,
                    tablet: true,
                    resetCss: true,
                    removeformatPasted: true,
                    btns: [
                        ["formatting"],
                        ["simple"],
                        ["bold", "italic"],
                        ["link"],
                        ["insertImage"],
                        ["unorderedList", "orderedList"],
                        ["removeformat"],
                        ["fullscreen"]
                    ]
                };

                if (!this.options.menu) {
                    settings.btns = [["bold", "italic"]];
                }

                element.trumbowyg(settings);

                if (this.view.model) {
                    element.trumbowyg("html", this.view.model.get(this.options.item) || "");
                }

                var _this = this;
                element.on("focusout", function (e) {
                    try {
                        if (typeof _this.view.serialize === "function") {
                            _this.view.serialize(e);
                        }
                    } catch (ex) {
                        console.log("error", ex.message);
                    }
                });
            } catch (ex) {
                Lampa.trigger("error", ex.message);
            }
        }
    });
});