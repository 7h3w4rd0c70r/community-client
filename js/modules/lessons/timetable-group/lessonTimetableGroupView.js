/**
 * Created by Roman on 3.10.14.
 */
Lampa.module("LessonsModule.TimetableGroup", function (TimetableGroup, Lampa, Backbone, Marionette) {
    TimetableGroup.TopLine = Marionette.ItemView.extend({
        template: "lesson/lesson-grid-top-line"
    });

    TimetableGroup.Layout = Marionette.LayoutView.extend({
        template: "timetable/groups",
        regions: {
            groupsRegion: "#groups"
        },
        events: {
            "click #back": "goBack"
        },
        goBack: function () {
            window.history.back();
        }
    });

    TimetableGroup.Group = Marionette.ItemView.extend({
        template: "timetable/group-item",
        className: "col-lg-4",
        events: {
            'click .timetable': 'showItem',
            'click .edit': 'editItem'
        },
        showItem: function () {
            var param = 'group=' + this.model.get('groupID');
            Lampa.trigger("lesson:grid", param);
        },
        editItem: function () {
            Lampa.trigger("group:edit", this.model);
        }
    });

    TimetableGroup.Groups = Marionette.CollectionView.extend({
        template: "timetable/groups",
        className: "row",
        childView: TimetableGroup.Group
    });
});