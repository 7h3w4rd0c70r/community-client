/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("TeachersModule.Edit", function (Edit, Lampa, Backbone, Marionette, $) {
    Edit.Teacher = Lampa.EditableItemView.extend({
        template: "teacher/edit",
        className: "container",
        saveModelRequest: "teacher:save",
        regions: {
            lessonsRegion: "#lessons"
        },
        behaviors: {
            DateTimePicker: {serialize: this.serialize},
            Tooltips: {},
            Icon: {}
        },
        ui: {
            "abbr": "#abbr",
            "fullName": "#fullName",
            "email": "#email",
            "icon": "#icon",
            "start": "#start",
            "end": "#end"
        },
        events: {
            "click .icon": "changeIcon",
            "click #save": "saveEntity",
            "click #back": "goBack",
            "change": "serialize"
        },
        modelEvents: {
            "change:icon": "render updateIcon",
            "change:personID": "render"
        },
        changeIcon: function (e) {
            try {
                this.model.set("icon", e.target.dataset["value"]);
            } catch (ex) {
                console.log(ex.message);
            }
        },
        updateIcon: function () {
            if (this.model.id) {
                $.when(this.saveModel()).done(function () {
                    Lampa.request("locations:refresh");
                });
            }
        },
        onBeforeDestroy: function () {
            Lampa.request("teacher:clean");
            Lampa.request("teachers:refresh");
        },
        onRender: function () {
            Lampa.trigger("progressBar:show");
            var _this = this;
            var personID = _this.model.get("personID");
            if (!personID) {
                this.ui.start.trigger("change");
                this.ui.end.trigger("change");
                Lampa.trigger("progressBar:hide");
            } else {
                $.when(Lampa.request("teacher:lessons", personID).done(
                    function (collection) {
                        if (_this.lessonsRegion) {
                            _this.lessonsRegion.show(new Edit.Lessons({collection: collection}));
                        }
                        Lampa.trigger("progressBar:hide");
                    }
                ));
            }
        },
        saveEntity: function () {
            var isNewItem = (this.model.id === null);
            $.when(this.saveModel()).done(function () {
                Lampa.request("teachers:refresh");
                if (isNewItem) {
                    Lampa.trigger("teacher:list");
                }
            });
        }
    });

    Edit.Lesson = Marionette.ItemView.extend({
        template: "teacher/lesson",
        tagName: "tr",
        className: function () {
            var value = "clickable ";
            value += Lampa.request(
                "helper:getStatusClass",
                this.model.get("status"),
                "admin",
                this.model.get("start")
            );
            value += "-row";
            return value;
        },
        behaviors: {
            GroupDetails: {},
            LocationDetails: {},
            CourseDetails: {}
        },
        events: {
            "click": "showItem"
        },
        showItem: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("lesson:show", this.model.get("lessonID"));
        }
    });

    Edit.NoLessons = Marionette.ItemView.extend({
        template: "group/lessons-none",
        tagName: "tr"
    });

    Edit.Lessons = Marionette.CompositeView.extend({
        template: "teacher/lessons",
        childViewContainer: "tbody",
        childView: Edit.Lesson,
        emptyView: Edit.NoLessons,
        behaviors: {
            GroupIcons: {horizontal: true},
            LocationIcons: {horizontal: true},
            CourseIcons: {horizontal: true}
        },
        ui: {
            "add": "#add-lessons"
        },
        events: {
            "click @ui.add": "addLesson"
        },
        addLesson: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("lesson:add", this.model);
        }
    });
});