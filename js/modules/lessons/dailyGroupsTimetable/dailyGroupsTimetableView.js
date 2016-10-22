/**
 * Created by Roman on 3.10.14.
 */
Lampa.module("LessonsModule.DailyGroupsTimetable", function (DailyGroupsTimetable, Lampa, Backbone, Marionette, $, _) {
    DailyGroupsTimetable.Layout = Marionette.LayoutView.extend({
        template: "timetable/daily-groups",
        regions: {
            daysRegion: "#days",
            timeRegion: "#time",
            lessonsRegion: "#lessons"
        },
        behaviors: {
            DateTimePicker: {serialize: this.serialize}
        },
        ui: {
            day: '#day',
            nextDay: "#next-day",
            lastDay: "#last-day"
        },
        events: {
            "click @ui.lastDay": "setLastDay",
            "click @ui.nextDay": "setNextDay"
        },
        serialize: function () {
            this.model.set('day', this.ui.day.val());
        },
        modelEvents: function () {
            return {
                'change:day': 'render showLessons'
            }
        },
        onRender: function () {
            var _this = this;
            $.when(Lampa.request("hour:entities")).done(function (hours) {
                _this.timeRegion.show(new DailyGroupsTimetable.Hours({collection: hours}));
                _this.lessonsRegion.show(new DailyGroupsTimetable.Groups({collection: _this.collection}));
                _this.collection.each(function (entity) {
                    _this.addRegion('group-' + entity.get('groupID') + '-Region', "#group-" + entity.get('groupID'));
                });
                _this.showLessons();
            });
        },
        showLessons: function () {
            var _this = this;
            $.when(Lampa.request("lesson:load", ['day=' + this.model.get('day')]))
                .then(function (allLessons) {
                    _this.collection.each(function (group) {
                        var lessons = allLessons.filter(function (a) {
                                return a.get('groupID') === group.get('groupID');
                            }
                        );
                        var region = 'group-' + group.get('groupID') + '-Region';
                        if (_this[region] !== undefined && lessons.length > 0) {
                            var lessonsView = new DailyGroupsTimetable.Lessons({collection: new Backbone.Collection(lessons)});
                            _this[region].show(lessonsView);
                        }
                    });
                })
                .then(function () {
                    _this.triggerMethod('ShowAllIcons');
                });
        },
        setLastDay: function () {
            try {
                var lastDay = Lampa.request('helper:getLastDay', Lampa.request('helper:getDateFromString', this.model.get('day')));
                this.model.set('day', Lampa.request('helper:DateToISOString', lastDay));
            }
            catch (ex) {
                console.log(ex);
            }
        },
        setNextDay: function () {
            try {
                var nextDay = Lampa.request('helper:getNextDay', Lampa.request('helper:getDateFromString', this.model.get('day')));
                this.model.set('day', Lampa.request('helper:DateToISOString', nextDay));
            }
            catch (ex) {
                console.log(ex);
            }
        }
    });

    DailyGroupsTimetable.Group = Marionette.ItemView.extend({
        template: "timetable/group",
        className: "item"
    });

    DailyGroupsTimetable.Groups = Marionette.CollectionView.extend({
        childView: DailyGroupsTimetable.Group
    });

    DailyGroupsTimetable.Lesson = Marionette.ItemView.extend({
        tagName: "span",
        className: function () {
            return "clickable lesson " +
                Lampa.request("helper:getStatusClass",
                    this.model.get('status'),
                    Lampa.request("helper:getUserRole"),
                    Lampa.request("helper:getDateFromJSON", this.model.get('start'))
                );
        },
        template: "lesson/grid-item",
        behaviors: {
            GroupDetails: {},
            LocationDetails: {},
            TeacherDetails: {}
        },
        events: {
            "click": "showItem"
        },
        showItem: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("lesson:show", this.model.get("lessonID"));
        },
        attributes: function () {
            var a = {};
            if (this.model !== undefined) {
                var start = Lampa.request("helper:getDateFromJSON", this.model.get('start'));
                var end = Lampa.request("helper:getDateFromJSON", this.model.get('end'));
                var startTime = Lampa.request("school:startTime");
                var endTime = Lampa.request("school:endTime");
                a.style = "left:" + Lampa.request("helper:getLessonPosition", start, startTime, endTime) + "%;"
                    + "width:" + Lampa.request("helper:getLessonWidth", start, end, startTime, endTime) + "%;";
            }
            return a;
        }
    });

    DailyGroupsTimetable.Lessons = Marionette.CollectionView.extend({
        childView: DailyGroupsTimetable.Lesson,
        childViewContainer: "div",
        behaviors: {
            LocationIcons: {},
            CourseIcons: {},
            TeacherIcons: {}
        }
    });

    DailyGroupsTimetable.Hour = Marionette.ItemView.extend({
        tagName: "span",
        template: "lesson/grid-hour",
        className: 'hour',
        attributes: function () {
            var a = {};
            if (this.model !== undefined) {
                var start = Lampa.request("helper:getDateFromJSON", '2000-01-01 ' + this.model.get('hour_start') + ":00");
                var end = Lampa.request("helper:getDateFromJSON", '2000-01-01 ' + this.model.get('hour_end') + ":00");
                var startTime = Lampa.request("school:startTime");
                var endTime = Lampa.request("school:endTime");

                a.style = "left:" + Lampa.request("helper:getLessonPosition", start, startTime, endTime) + "%;"
                    + "width:" + Lampa.request("helper:getLessonWidth", start, end, startTime, endTime) + "%;";
            }
            return a;
        }
    });

    DailyGroupsTimetable.Hours = Marionette.CollectionView.extend({
        childView: DailyGroupsTimetable.Hour,
        childViewContainer: "span",
        className: 'time-line'
    });

    DailyGroupsTimetable.Days = Marionette.ItemView.extend({
        template: "timetable/days"
    });
});