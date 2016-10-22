/**
 * Created by Roman on 3.10.14.
 */
Lampa.module("LessonsModule.DailyTeachersTimetable", function (DailyTeachersTimetable, Lampa, Backbone, Marionette, $, _) {
    DailyTeachersTimetable.Layout = Marionette.LayoutView.extend({
        template: "timetable/daily-teachers",
        regions: {
            daysRegion: "#days",
            timeRegion: "#time",
            lessonsRegion: "#lessons"
        },
        behaviors: {
            DateTimePicker: {serialize: this.serialize},
            GroupIcons: {show: false},
            LocationIcons: {show: false},
            CourseIcons: {show: false}
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
                _this.timeRegion.show(new DailyTeachersTimetable.Hours({collection: hours}));
                _this.lessonsRegion.show(new DailyTeachersTimetable.Teachers({collection: _this.collection}));
                _this.collection.each(function (entity) {
                    _this.addRegion('teacher-' + entity.get('personID') + '-Region', "#teacher-" + entity.get('personID'));
                });
                _this.showLessons();
            });
        },
        showLessons: function () {
            var _this = this;
            $.when(Lampa.request("lesson:load", ['day=' + this.model.get('day') + '&teachers=separated']))
                .then(function (allLessons) {
                    _this.collection.each(function (teacher) {
                        var lessons = allLessons.filter(function (a) {
                                return a.get('personID') === teacher.get('personID');
                            }
                        );
                        var region = 'teacher-' + teacher.get('personID') + '-Region';
                        if (_this[region] !== undefined && lessons.length > 0) {
                            var lessonsView = new DailyTeachersTimetable.Lessons({collection: new Backbone.Collection(lessons)});
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

    DailyTeachersTimetable.Teacher = Marionette.ItemView.extend({
        template: "timetable/teacher",
        className: "item"
    });

    DailyTeachersTimetable.Teachers = Marionette.CollectionView.extend({
        childView: DailyTeachersTimetable.Teacher
    });

    DailyTeachersTimetable.Lesson = Marionette.ItemView.extend({
        template: "lesson/grid-item",
        tagName: "span",
        className: function () {
            return "clickable lesson " +
                Lampa.request("helper:getStatusClass",
                    this.model.get('status'),
                    Lampa.request("helper:getUserRole"),
                    Lampa.request("helper:getDateFromJSON", this.model.get('start'))
                );
        },
        ui: {
            'location': '.locations-small'
        },
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

    DailyTeachersTimetable.Lessons = Marionette.CollectionView.extend({
        childView: DailyTeachersTimetable.Lesson,
        childViewContainer: "div"
    });

    DailyTeachersTimetable.Hour = Marionette.ItemView.extend({
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

    DailyTeachersTimetable.Hours = Marionette.CollectionView.extend({
        childView: DailyTeachersTimetable.Hour,
        childViewContainer: "span",
        className: 'time-line'
    });

    DailyTeachersTimetable.Days = Marionette.ItemView.extend({
        template: "timetable/days"
    });
});