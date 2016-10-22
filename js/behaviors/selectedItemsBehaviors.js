/**
 * Created by Roman Brhel on 10.10.2016.
 */
Lampa.module("Behaviors", function (Behaviors, Lampa, Backbone, Marionette, $, _) {
    Behaviors.SelectedItems = Marionette.Behavior.extend({
        defaults: {
            element: "tr",
            checkBox: "selected-item"
        },
        onRefresh: function () {
            $(this.options.element).filter(":not(:checkbox:checked)").removeClass(this.options.checkBox);
            $(this.options.element).filter(":has(:checkbox:checked)").addClass(this.options.checkBox);
        }
    });
});