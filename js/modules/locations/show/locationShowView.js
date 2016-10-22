/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("LocationsModule.Show", function (Show, Lampa, Backbone, Marionette) {
    Show.Location = Marionette.LayoutView.extend({
        template: "location/show",
        className: "container",
        regions: {
            lessonsRegion: "#lessons"
        },
        events: {
            "click #edit": "editItem",
            "click #delete": "deleteItem",
            "click #back": "goBack"
        },
        goBack: function () {
            window.history.back();
        },
        editItem: function () {
            Lampa.trigger("location:edit", this.model);
        },
        deleteItem: function () {
            $.when(Lampa.request("location:delete", this.model)).done(function () {
                Lampa.request('locations:refresh');
            });
        },
        onShow: function () {
            Lampa.trigger("progressBar:show");
            var parent = this;

            var locationID = parent.model.get('locationID') || null;
            if (locationID !== null) {
                $.when(Lampa.request("location:lessons", locationID).done(function (collection) {
                        parent.lessonsRegion.show(new Show.Lessons({collection: collection}));
                    })
                );
            }
        }
    });

    Show.Lesson = Marionette.ItemView.extend({
        template: "location/lesson",
        tagName: "tr",
        className: function () {
            var value = 'clickable ';
            value += Lampa.request(
                'helper:getStatusClass',
                this.model.get('status'),
                'admin',
                this.model.get('start')
            );
            value += '-row';
            return value;
        },
        events: {
            "click": "showItem"
        },
        showItem: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("lesson:show", this.model.get("lessonID"));
        }
    });

    Show.NoLessons = Marionette.ItemView.extend({
        template: "group/lessons-none",
        tagName: "tr"
    });

    Show.Lessons = Marionette.CompositeView.extend({
        template: "location/lessons",
        childViewContainer: "tbody",
        childView: Show.Lesson,
        emptyView: Show.NoLessons,
        behaviors: {
            Tooltips: {},
            GroupDetails: {},
            TeacherDetails: {},
            CourseDetails: {}
        },
        ui: {
            "add": "#add-lessons"
        },
        events: {
            "click @ui.add": "addLesson"
        },
        addLesson: function (e) {
            Lampa.trigger("lesson:add", this.model);
        }
    });
});