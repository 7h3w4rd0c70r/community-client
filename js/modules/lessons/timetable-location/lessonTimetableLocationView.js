/**
 * Created by Roman on 3.10.14.
 */
Lampa.module("LessonsModule.TimetableLocation", function (TimetableLocation, Lampa, Backbone, Marionette) {
    TimetableLocation.TopLine = Marionette.ItemView.extend({
        tagName: "div",
        template: "lesson/lesson-grid-top-line"
    });

    TimetableLocation.Layout = Marionette.LayoutView.extend({
        template: "timetable/locations",
        regions: {
            locationsRegion: "#locations"
        },
        events: {
            "click #back": "goBack"
        },
        goBack: function () {
            window.history.back();
        }
    });

    TimetableLocation.Location = Marionette.ItemView.extend({
        template: "timetable/location-item",
        className: "col-lg-4",
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

    TimetableLocation.Locations = Marionette.CollectionView.extend({
        template: "timetable/locations-list",
        className: "row",
        childView: TimetableLocation.Location
    });
});