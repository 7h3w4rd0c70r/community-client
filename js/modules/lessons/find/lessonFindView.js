/**
 * Created by Roman on 24.7.15.
 */

Lampa.module("LessonsModule.Find", function (Find, Lampa, Backbone, Marionette, $, _) {
    Find.Layout = Marionette.LayoutView.extend({
        template: "lesson/find",
        className: "container",
        regions: {
            teachersRegion: "#teacher",
            groupsRegion: "#group",
            coursesRegion: "#course",
            locationsRegion: "#location",
            lessonsRegion: "#lessons"
        },
        ui: {
            find: "#find"
        },
        events: {
            "click @ui.find": "find"
        },
        behaviors: {
            DateTimePicker: {serialize: this.serialize},
            Tooltips: {},
            CourseIcons: {show: false},
            GroupIcons: {show: false},
            LocationIcons: {show: false},
            TeacherIcons: {show: false}
        },
        onShow: function () {
            var _this = this;
            Lampa.trigger("progressBar:show");
            $.when(Lampa.request("group:entities"), Lampa.request("group:new"))
                .done(function (groups, item) {
                    item.set("groupID", "*");
                    item.set("abbr", "*");
                    item.set("name", "any");
                    item.set("isSelected", true);

                    var collection = groups.clone();
                    collection.add(item);
                    _this.groupsRegion.show(new Find.Groups({collection: collection}));
                    Lampa.trigger("progressBar:hide");
                });

            Lampa.trigger("progressBar:show");
            $.when(Lampa.request("course:entities"), Lampa.request("course:new")).done(function (courses, item) {
                item.set("courseID", "*");
                item.set("abbr", "*");
                item.set("name", "any");
                item.set("isSelected", true);
                var collection = courses.clone();
                collection.add(item);
                _this.coursesRegion.show(new Find.Courses({collection: collection}));
                Lampa.trigger("progressBar:hide");
            });

            Lampa.trigger("progressBar:show");
            $.when(Lampa.request("location:entities"), Lampa.request("location:new")).done(function (locations, item) {
                item.set("locationID", "*");
                item.set("abbr", "*");
                item.set("name", "any");
                item.set("isSelected", true);
                var collection = locations.clone();
                collection.add(item);
                _this.locationsRegion.show(new Find.Locations({collection: collection}));
                Lampa.trigger("progressBar:hide");
            });

            Lampa.trigger("progressBar:show");
            $.when(Lampa.request("teacher:entities"), Lampa.request("teacher:new")).done(function (teachers, item) {
                item.set("personID", "*");
                item.set("abbr", "*");
                item.set("fullName", "any");
                item.set("lastName", "0");
                item.set("firstName", "0");
                item.set("isSelected", true);
                var collection = teachers.clone();
                collection.add(item);
                _this.teachersRegion.show(new Find.Teachers({collection: collection}));
                Lampa.trigger("progressBar:hide");
            });
        },
        find: function () {
            var _this = this;
            var params = {};
            var group = $("#groupID").val();
            var course = $("#courseID").val();
            var location = $("#locationID").val();
            var teacher = $("#personID").val();
            var status = $("#status").val();
            var from = $("#firstDay").val();
            var to = $("#lastDay").val();
            var fromTime = $("#time-from").val();
            var toTime = $("#time-to").val();
            var dayOfWeek = $("#day").val();

            params.group = (group !== "*") ? group : null;
            params.course = (course !== "*") ? course : null;
            params.location = (location !== "*") ? location : null;
            params.teacher = (teacher !== "*") ? teacher : null;
            params.status = (status !== "*") ? status : null;
            params.from = (from !== "") ? from + " 00:00" : null;
            params.to = (to !== "") ? to + " 23:59" : null;
            params.fromTime = (fromTime !== "") ? fromTime : null;
            params.toTime = (toTime !== "") ? toTime : null;
            params.dayOfWeek = (dayOfWeek !== "*") ? dayOfWeek : null;

            $.when(Lampa.request("lesson:load", params)).done(function (collection) {
                if (collection) {
                    _this.lessonsRegion.show(new Find.Lessons({collection: collection}));
                    _this.triggerMethod("ShowAllIcons");
                }
            });
        }
    });

    Find.Group = Marionette.ItemView.extend({
        template: "group/option",
        tagName: "option",
        attributes: function () {
            var attr = {};
            attr.value = null;
            if (this.model.get("groupID")) {
                attr.value = this.model.get("groupID");
            }
            return attr;
        }
    });

    Find.Groups = Marionette.CollectionView.extend({
        template: "group/select",
        tagName: "select",
        className: "form-control",
        childView: Find.Group,
        childViewContainer: "select",
        attributes: {id: "groupID"}
    });

    Find.Course = Marionette.ItemView.extend({
        template: "course/option",
        tagName: "option",
        attributes: function () {
            var attr = {};
            attr.value = null;
            if (this.model.get("courseID")) {
                attr.value = this.model.get("courseID");
            }
            return attr;
        }
    });

    Find.Courses = Marionette.CollectionView.extend({
        template: "course/select",
        tagName: "select",
        className: "form-control",
        childView: Find.Course,
        childViewContainer: "select",
        attributes: {id: "courseID"}
    });

    Find.Location = Marionette.ItemView.extend({
        template: "location/option",
        tagName: "option",
        attributes: function () {
            var attr = {};
            attr.value = null;
            if (this.model.get("locationID")) {
                attr.value = this.model.get("locationID");
            }
            return attr;
        }
    });

    Find.Locations = Marionette.CollectionView.extend({
        template: "location/select",
        tagName: "select",
        className: "form-control",
        childView: Find.Location,
        childViewContainer: "select",
        attributes: {id: "locationID"}
    });

    Find.Teacher = Marionette.ItemView.extend({
        template: "teacher/option",
        tagName: "option",
        attributes: function () {
            var attr = {};
            attr.value = null;
            if (this.model.get("personID")) {
                attr.value = this.model.get("personID");
            }
            return attr;
        }
    });

    Find.Teachers = Marionette.CollectionView.extend({
        template: "teacher/select",
        tagName: "select",
        className: "form-control",
        childView: Find.Teacher,
        childViewContainer: "select",
        attributes: {id: "personID"}
    });

    Find.Lesson = Marionette.ItemView.extend({
        tagName: "tr",
        template: "lesson/list-item-selectable",
        ui: {
            "open": ".open",
            "cancel": ".cancel",
            "reschedule": ".reschedule",
            "select": ".select",
            "isSelected": ".is-selected",
            "delete": ".delete"
        },
        events: {
            "click @ui.open": "openLesson",
            "click @ui.cancel": "cancelLesson",
            "click @ui.delete": "deleteLesson",
            "click @ui.reschedule": "rescheduleLesson",
            "change @ui.isSelected": "checkItem",
            "click": "setCheckbox"
        },
        behaviors: {
            GroupDetails: {},
            LocationDetails: {},
            TeacherDetails: {},
            CourseDetails: {},
            SelectedItems: {}
        },
        openLesson: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("lesson:show", this.model.get("lessonID"));
        },
        cancelLesson: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("lesson:cancel", this.model.get("lessonID"));
        },
        rescheduleLesson: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("lesson:reschedule", this.model.get("lessonID"));
        },
        deleteLesson: function (e) {
            e.preventDefault();
            e.stopPropagation();
            var _this = this;
            var message = "Are you sure? <br/>" +
                "Would you like to delete this lesson ?" +
                "<div><strong>" + Lampa.request("helper:toString", this.model.get("start")) + "</strong></div>";

            Lampa.request("confirm", message, "danger").then(function (canDelete) {
                if (canDelete) {
                    _this.model.destroy();
                    _this.triggerMethod("ShowAllIcons");
                }
            });
        },
        checkItem: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.model.set("isSelected", !this.model.get("isSelected"));
            this.refresh();
        },
        setCheckbox: function (e) {
            if (e.target.className.search("is-selected") === -1) {
                this.model.set("isSelected", !this.model.get("isSelected"));
                $(this.ui.isSelected).prop("checked", this.model.get("isSelected"));
                this.refresh();
            }
        },
        refresh: function () {
            this.triggerMethod("Refresh");
        }
    });

    Find.Lessons = Marionette.CompositeView.extend({
        template: "lesson/list-editable",
        className: "panel panel-default",
        tagName: "div",
        childView: Find.Lesson,
        childViewContainer: "tbody",
        behaviors: {
            SelectedItems: {}
        },
        ui: {
            "checkAll": "#check-all",
            "unCheckAll": "#un-check-all",
            "delete": "#delete"
        },
        events: {
            "click @ui.checkAll": "selectALL",
            "click @ui.unCheckAll": "unSelectALL",
            "click @ui.delete": "delete"
        },
        selectALL: function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (this.collection) {
                $(".is-selected").prop("checked", true);
                this.collection.each(function (model) {
                    model.set("isSelected", true);
                });
                this.triggerMethod("Refresh");
                this.ui.checkAll.hide();
                this.ui.unCheckAll.show();
            }
        },
        unSelectALL: function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (this.collection) {
                $(".is-selected").prop("checked", false);
                this.collection.each(function (model) {
                    model.set("isSelected", false);
                });
                this.triggerMethod("Refresh");
                this.ui.checkAll.show();
                this.ui.unCheckAll.hide();
            }
        },
        delete: function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (this.collection) {
                var toDelete = this.collection.filter(function (model) {
                    return model.get("isSelected");
                });

                var message = "Are you sure? <br/>Would you like to delete " + toDelete.length;
                message += (toDelete.length === 1) ? " lesson" : " lessons";
                message += " ?";
                if (toDelete.length > 0) {
                    Lampa.request("confirm", message, "danger").then(function (canDelete) {
                            if (canDelete) {
                                var total = toDelete.length;
                                var counter = 0;
                                Lampa.trigger("progressBar:show");
                                _.each(toDelete, function (model) {
                                        model.destroy({
                                            error: function (data) {
                                                counter++;
                                                if (counter >= total) {
                                                    Lampa.trigger("progressBar:hide");
                                                }
                                            },
                                            success: function (data) {
                                                counter++;
                                                if (counter >= total) {
                                                    Lampa.trigger("progressBar:hide");
                                                    Lampa.request("alert", "Lessons deleted.");
                                                }
                                            }
                                        });
                                    }
                                );
                            }
                        }
                    );
                }
            }
        }
    });
});