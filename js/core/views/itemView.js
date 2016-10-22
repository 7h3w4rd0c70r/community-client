/**
 * Created by Roman on 18.4.15.
 */
Lampa.ItemView = Marionette.ItemView.extend({
    lockForm: function () {
        if (this.ui) {
            _.each(this.ui, function (element) {
                element.attr("disabled", true);
            });
        }
    },
    unlockForm: function () {
        if (this.ui) {
            _.each(this.ui, function (element) {
                element.attr("disabled", false);
            });
        }
    }
});