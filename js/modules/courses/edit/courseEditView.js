/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("CoursesModule.Edit", function (Edit, Lampa, Backbone, Marionette, $) {
    Edit.Course = Lampa.EditableItemView.extend({
        template: "course/edit",
        className: "container",
        saveModelRequest: "course:save",
        ui: {
            abbr: "#abbr",
            name: "#name",
            description: "#description",
            dictionary: "#dictionary",
            lessons: "#lessons",
            start: "#start",
            end: "#end",
            icon: "#icon"
        },
        behaviors: {
            DateTimePicker: {serialize: this.serialize},
            Tooltips: {},
            Icon: {}
        },
        modelEvents: {
            "change:icon": "render updateIcon",
            "change:courseID": "render"
        },
        events: {
            'click .icon': 'changeIcon',
            "click #save": "saveEntity",
            "click #back": "goBack",
            "change": "serialize"
        },
        onRender: function () {
            if (this.model.get('courseID') == null) {
                this.ui.start.trigger('change');
                this.ui.end.trigger('change');
            }
        },
        saveEntity: function (e) {
            var _this = this, isNewItem = (this.model.id === null);

            $.when(this.saveModel()).done(function () {
                Lampa.request('courses:refresh');
                if (isNewItem) {
                    Lampa.trigger('course:list');
                }
            });
        },
        changeIcon: function (e) {
            try {
                this.model.set('icon', e.target.dataset['value']);
            }
            catch (ex) {
                console.log(ex.message);
            }
        },
        updateIcon: function (e) {
            if ((this.model.id !== null)) {
                $.when(this.saveModel()).done(function () {
                    Lampa.request('locations:refresh');
                });
            }
        }
    });
});