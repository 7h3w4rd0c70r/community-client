/**
 * Created by Roman on 3.10.14.
 */
Lampa.module("LessonsModule.DailyLocationsTimetable", function (DailyLocationsTimetable, Lampa, Backbone, Marionette, $, _) {
    DailyLocationsTimetable.Layout = Marionette.LayoutView.extend({
        template: "timetable/daily-locations",
        regions: {
            daysRegion: "#days",
            timeRegion: "#time",
            lessonsRegion: "#lessons"
        },
        behaviors: {
            DateTimePicker: {serialize: this.serialize},
            GroupIcons: {},
            CourseIcons: {},
            TeacherIcons: {}
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
                _this.timeRegion.show(new DailyLocationsTimetable.Hours({collection: hours}));
                _this.lessonsRegion.show(new DailyLocationsTimetable.Locations({collection: _this.collection}));
                _this.collection.each(function (entity) {
                    _this.addRegion('location-' + entity.get('locationID') + '-Region', "#location-" + entity.get('locationID'));
                });
                _this.showLessons();
            });
        },
        showLessons: function () {
            var _this = this;
            $.when(Lampa.request("lesson:load", ['day=' + this.model.get('day')]))
                .then(function (allLessons) {
                    _this.collection.each(function (location) {
                        var lessons = allLessons.filter(function (a) {
                                return a.get('locationID') === location.get('locationID');
                            }
                        );
                        var region = 'location-' + location.get('locationID') + '-Region';
                        if (_this[region] !== undefined && lessons.length > 0) {
                            var lessonsView = new DailyLocationsTimetable.Lessons({collection: new Backbone.Collection(lessons)});
                            _this[region].show(lessonsView);
                        }
                    });
                })
                .then(function () {
                    _this.triggerMethod('ShowAllIcons');
                });
        },
        setLastDay: function (e) {
            try {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                var lastDay = Lampa.request('helper:getLastDay', Lampa.request('helper:getDateFromString', this.model.get('day')));
                this.model.set('day', Lampa.request('helper:DateToISOString', lastDay));
            }
            catch (ex) {
                console.log(ex);
            }
        },
        setNextDay: function (e) {
            try {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                var nextDay = Lampa.request('helper:getNextDay', Lampa.request('helper:getDateFromString', this.model.get('day')));
                this.model.set('day', Lampa.request('helper:DateToISOString', nextDay));
            }
            catch (ex) {
                console.log(ex);
            }
        }
    });

    DailyLocationsTimetable.Location = Marionette.ItemView.extend({
        template: "timetable/location",
        className: "item"
    });

    DailyLocationsTimetable.Locations = Marionette.CollectionView.extend({
        childView: DailyLocationsTimetable.Location
    });

    DailyLocationsTimetable.Lesson = Marionette.ItemView.extend({
        tagName: "span",
        className: function () {
            return "clickable lesson " +
                Lampa.request("helper:getStatusClass",
                    this.model.get('status'),
                    Lampa.request("helper:getUserRole"),
                    Lampa.request("helper:getDateFromJSON", this.model.get('start'))
                );
        },
        behaviors: {
            GroupDetails: {},
            LocationDetails: {},
            TeacherDetails: {}
        },
        template: "lesson/grid-item",
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

    DailyLocationsTimetable.Lessons = Marionette.CollectionView.extend({
        childView: DailyLocationsTimetable.Lesson,
        childViewContainer: "div"
    });

    DailyLocationsTimetable.Hour = Marionette.ItemView.extend({
        tagName: "span",
        template: "lesson/grid-hour",
        className: "hour",
        attributes: function () {
            var a = {};
            if (this.model !== undefined) {
                var start = Lampa.request("helper:getDateFromJSON", '2000-01-01 ' + this.model.get('hour_start') + ":00");
                var end = Lampa.request("helper:getDateFromJSON", '2000-01-01 ' + this.model.get('hour_end') + ":00");
                var startTime = Lampa.request("school:startTime");
                var endTime = Lampa.request("school:endTime");

                a.style = "left:" + Lampa.request("helper:getLessonPosition", start, startTime, endTime) + "%;" +
                    "width:" + Lampa.request("helper:getLessonWidth", start, end, startTime, endTime) + "%;";
            }
            return a;
        }
    });

    DailyLocationsTimetable.Hours = Marionette.CollectionView.extend({
        childView: DailyLocationsTimetable.Hour,
        childViewContainer: "span",
        className: 'time-line'
    });

    DailyLocationsTimetable.Days = Marionette.ItemView.extend({
        template: "timetable/days"
    });
});