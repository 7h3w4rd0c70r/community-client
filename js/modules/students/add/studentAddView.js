/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("StudentModule.Add", function (Add, Lampa, Backbone, Marionette, $) {
    Add.Layout = Lampa.EditableItemView.extend({
        template: "student/add",
        className: "container",
        saveModelRequest: "student:save",
        ui: {
            fullName: "#fullName",
            email: "#email"
        },
        onBeforeDestroy: function () {
            Lampa.request("student:clean");
            Lampa.request("students:refresh");
        },
        events: {
            "click #save": "saveEntity",
            "click #back": "goBack",
            "change": "serialize"
        },
        saveEntity: function (e) {
            var _this = this, isNewItem = (this.model.id === null);
            $.when(_this.saveModel()).done(function () {
                Lampa.request('students:refresh');
                if (isNewItem) {
                    Lampa.trigger('student:edit', _this.model.id);
                }
            });
        }
    });
});