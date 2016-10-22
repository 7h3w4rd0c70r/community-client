/**
 * Created by Roman Brhel on 16.09.2016.
 */
Lampa.module("LessonsModule.LessonReport", function (LessonReport, Lampa, Backbone, Marionette, $, _) {
    LessonReport.Layout = Marionette.LayoutView.extend({
        template: "lesson/report",
        className: "container report-page",
        ui: {
            "print": "#print",
            "back": "#back"
        },
        events: {
            "click @ui.print": "print",
            "click @ui.back": "goBack"
        },
        regions: {
            groupRegion: "#group",
            courseRegion: "#course",
            locationRegion: "#location",
            teachersRegion: "#teachers",
            headerRegion: "#lesson-header",
            plansRegion: "#plans",
            studentsRegion: "#students",
            homeworkRegion: "#homework",
            homeworkListRegion: "#homework-list",
            reminderRegion: "#reminder"
        },
        onShow: function () {
            var _this = this;
            var lessonID = this.model.get("lessonID");
            if (lessonID) {
                $.when(
                    Lampa.request("group:entity", _this.model.get("groupID")),
                    Lampa.request("location:entity", _this.model.get("locationID")),
                    Lampa.request("course:entity", _this.model.get("courseID")),
                    Lampa.request("lesson:teachers", lessonID),
                    Lampa.request("lesson:header", lessonID),
                    Lampa.request("homework:entities", lessonID),
                    Lampa.request("lesson:attendance:load", lessonID),
                    Lampa.request("lesson:plans", lessonID),
                    Lampa.request("homework:new", lessonID),
                    Lampa.request("reminder:new", lessonID)
                ).then(
                    function (group, location, course, teachers, header, homeworks, attendance, plans, homework, reminder) {
                        _this.groupRegion.show(new LessonReport.GroupView({model: group}));
                        _this.locationRegion.show(new LessonReport.LocationView({model: location}));
                        _this.courseRegion.show(new LessonReport.CourseView({model: course}));
                        _this.teachersRegion.show(new LessonReport.TeachersView({collection: teachers}));
                        _this.headerRegion.show(new LessonReport.HeaderView({model: header}));
                        _this.homeworkListRegion.show(new LessonReport.HomeworkList({collection: homeworks}));
                        _this.studentsRegion.show(new LessonReport.StudentsView({collection: attendance}));
                        _this.plansRegion.show(new LessonReport.PlansView({collection: plans}));
                        _this.homeworkRegion.show(new LessonReport.LessonHomeworkView({model: homework}));
                        _this.reminderRegion.show(new LessonReport.LessonReminderView({model: reminder}));
                    }
                );
            }
        },
        print: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            window.print();
        },
        goBack: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            window.history.back();
        }
    });

    LessonReport.HeaderView = Marionette.ItemView.extend({
        template: "lesson/reportHeader",
        tagName: "table",
        className: "table"
    });

    LessonReport.GroupView = Marionette.ItemView.extend({
        template: "group/option",
        tagName: "span"
    });

    LessonReport.CourseView = Marionette.ItemView.extend({
        template: "course/option",
        tagName: "span"
    });

    LessonReport.LocationView = Marionette.ItemView.extend({
        template: "location/option",
        tagName: "span"
    });

    LessonReport.TeacherView = Marionette.ItemView.extend({
        template: "teacher/option",
        tagName: "span"
    });

    LessonReport.TeachersView = Marionette.CollectionView.extend({
        childView: LessonReport.TeacherView
    });

    LessonReport.PlanView = Marionette.ItemView.extend({
        template: "activity/report-item",
        tagName: "tr"
    });

    LessonReport.PlansView = Marionette.CompositeView.extend({
        template: "activity/report-items",
        childView: LessonReport.PlanView,
        childViewContainer: "tbody"
    });

    LessonReport.StudentView = Marionette.ItemView.extend({
        template: "student/attendance",
        className: "col-xs-4"
    });

    LessonReport.StudentsView = Marionette.CollectionView.extend({
        childView: LessonReport.StudentView
    });

    LessonReport.LessonHomeworkView = Marionette.ItemView.extend({
        template: "lesson/report-lesson-homework"
    });

    LessonReport.LessonReminderView = Marionette.ItemView.extend({
        template: "lesson/report-lesson-reminder"
    });

    LessonReport.HomeworkItem = Marionette.ItemView.extend({
        template: "lesson/report-homework",
        tagName: "tr"
    });

    LessonReport.HomeworkList = Marionette.CollectionView.extend({
        childView: LessonReport.HomeworkItem,
        tagName: "table",
        className: "table"
    });
});