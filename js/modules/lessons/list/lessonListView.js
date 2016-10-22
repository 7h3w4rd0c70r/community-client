/**
 * Created by Roman on 23.5.14.
 */
Lampa.module("LessonsModule.List", function (List, Lampa, Backbone, Marionette, $, _) {
    List.Layout = Marionette.LayoutView.extend({
        className: "container",
        template: "lesson/list-header",
        regions: {
            lessonsRegion: "#lessons-region",
            statisticsRegion: "#statistics-region"
        },
        onShow: function () {
            this.lessonsRegion.show(new List.Lessons({collection: this.collection}));
            this.statisticsRegion.show(new List.Statistics({model: this.getStatisticsModel()}));
        },
        getStatisticsModel: function () {
            var present = this.collection.filter(function (model) {
                return model.get("status") === 2 && model.get("isPresent") && Lampa.request("helper:getDateFromJSON", model.get("start")) < new Date();
            });
            var absent = this.collection.filter(function (model) {
                return (!model.get("isPresent") || model.get("status") === 3) && Lampa.request("helper:getDateFromJSON", model.get("start")) < new Date();
            });
            var excused = this.collection.filter(function (model) {
                return !model.get("isPresent") && model.get("isExcused") && Lampa.request("helper:getDateFromJSON", model.get("start")) < new Date();
            });
            var unexcused = this.collection.filter(function (model) {
                return (!model.get("isPresent") || model.get("status") === 3) && !model.get("isExcused") && Lampa.request("helper:getDateFromJSON", model.get("start")) < new Date();
            });
            var taught = this.collection.filter(function (model) {
                return (model.get("status") === 2 || model.get("status") === 3) && Lampa.request("helper:getDateFromJSON", model.get("start")) < new Date();
            });
            var model = new Backbone.Model();
            model.set("total", this.collection.length);
            model.set("taught", taught.length);
            model.set("present", present.length);
            model.set("absent", absent.length);
            model.set("excused", excused.length);
            model.set("unexcused", unexcused.length);
            model.set("absence", Math.round(present.length * 1000 / taught.length) / 10);
            return model;
        }
    });

    List.Lesson = Marionette.ItemView.extend({
        template: "student/lessons-list-item",
        tagName: "tr",
        className: function () {
            return "clickable " + Lampa.request("helper:timeLineClass", this.model.get("start"));
        },
        events: {
            "click": "showItem"
        },
        showItem: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("lesson:show", this.model.get("lessonID"));
        },
        behaviors: {
            GroupDetails: {},
            LocationDetails: {},
            TeacherDetails: {},
            CourseDetails: {}
        }
    });

    List.Lessons = Marionette.CompositeView.extend({
        template: "student/lessons-list",
        tagName: "table",
        className: "table numbered table-hover table-responsive",
        childView: List.Lesson,
        childViewContainer: "tbody",
        behaviors: {
            GroupIcons: {horizontal: true},
            LocationIcons: {horizontal: true},
            TeacherIcons: {horizontal: true},
            CourseIcons: {horizontal: true}
        },
        collectionEvents: {
            "add": "getAttendance"
        },
        getAttendance: function () {
            if (this.collection) {
                var present = this.collection.filter(function (a) {
                    return a.get("isPresent");
                });
                $("#present").val(present.count);
            }
        }
    });

    List.Statistics = Marionette.ItemView.extend({
        template: "student/statistics"
    });
});