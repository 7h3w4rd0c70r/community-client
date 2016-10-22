/**
 * Created by Roman on 17.7.15.
 */
Lampa.module("Helpers", function (Helpers, Lampa, Backbone, Marionette, $, _) {
    Lampa.reqres.setHandler("helper:isSelected", function (selectedItem, item) {
        return (selectedItem === item) ? 'selected' : '';
    });
    Lampa.reqres.setHandler("helper:isActive", function (selectedItem, items) {
        if (selectedItem.trim() === '') return '';
        return (items.indexOf(selectedItem) === -1 ) ? '' : 'active';
    });
    Lampa.reqres.setHandler("helper:isOpened", function (selectedItem, items) {
        if (selectedItem.trim() === '') return 'sub-menu closed';
        return (items.indexOf(selectedItem) === -1 ) ? 'sub-menu closed' : 'sub-menu opened';
    });
});