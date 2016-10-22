/**
 * Created by Roman on 3.10.14.
 */
Lampa.module("LessonsModule.Timetable", function (Timetable, Lampa, Backbone, Marionette) {

    Timetable.Layout = Marionette.LayoutView.extend({
        template: "timetable/dashboard",
        regions: {
            teachersRegion: "#teachers",
            groupsRegion: "#groups",
            locationsRegion: "#locations"
        },
        events: {
            "click #back": "goBack"
        },
        goBack: function () {
            window.history.back();
        }
    });

    Timetable.Teacher = Marionette.ItemView.extend({
        template: "timetable/teacher-item",
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

    Timetable.Teachers = Marionette.CollectionView.extend({
        template: "timetable/teacher-list",
        childView: Timetable.Teacher
    });

    Timetable.Group = Marionette.ItemView.extend({
        template: "timetable/group-item",
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

    Timetable.Groups = Marionette.CollectionView.extend({
        template: "timetable/group-list",
        childView: Timetable.Group
    });

    Timetable.Location = Marionette.ItemView.extend({
        template: "timetable/location-item",
        events: {
            'click .timetable': 'showItem',
            'click .edit': 'editItem'
        },
        showItem: function () {
            var param = 'location=' + this.model.get('locationID');
            Lampa.trigger("lesson:grid", param);
        },
        editItem: function () {
            Lampa.trigger("location:edit", this.model);
        }
    });

    Timetable.Locations = Marionette.CollectionView.extend({
        template: "timetable/location-list",
        childView: Timetable.Location
    });
});