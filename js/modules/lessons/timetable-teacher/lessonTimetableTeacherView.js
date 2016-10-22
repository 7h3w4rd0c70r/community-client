/**
 * Created by Roman on 3.10.14.
 */
Lampa.module("LessonsModule.TimetableTeacher", function (TimetableTeacher, Lampa, Backbone, Marionette, $, _) {
    TimetableTeacher.TopLine = Marionette.ItemView.extend({
        tagName: "div",
        template: "lesson/lesson-grid-top-line"
    });

    TimetableTeacher.Layout = Marionette.LayoutView.extend({
        template: "timetable/teachers",
        regions: {
            teachersRegion: "#teachers"
        },
        events: {
            "click #back": "goBack"
        },
        goBack: function () {
            window.history.back();
        }
    });

    TimetableTeacher.Teacher = Marionette.ItemView.extend({
        template: "timetable/teacher-item",
        className: "col-lg-4",
        events: {
            'click .timetable': 'showItem',
            'click .edit': 'editItem'
        },
        showItem: function () {
            var param = 'teacher=' + this.model.get('personID');
            Lampa.trigger("lesson:grid", param);
        },
        editItem: function () {
            Lampa.trigger("teacher:edit", this.model);
        }
    });

    TimetableTeacher.Teachers = Marionette.CollectionView.extend({
        template: "timetable/teacher-list",
        className: "row",
        childView: TimetableTeacher.Teacher
    });
});