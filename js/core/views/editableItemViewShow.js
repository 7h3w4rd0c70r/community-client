/**
 * Created by Roman on 6.1.2016.
 */
Lampa.EditableItemViewShow = Marionette.LayoutView.extend({
    entity: "entity",
    events: {
        "click #edit": "editItem",
        "click #back": "goBack"
    },
    goBack: function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.history.back();
    },
    editItem: function (e) {
        e.preventDefault();
        e.stopPropagation();
        Lampa.trigger(this.entity + ":edit", this.model);
    }
});