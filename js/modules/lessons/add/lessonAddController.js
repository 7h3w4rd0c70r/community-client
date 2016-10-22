/**
 * Created by Roman on 26.8.14.
 */

Lampa.module("LessonsModule.Add", function (Add, Lampa, Backbone, Marionette, $) {
    Add.Controller = {
        days: null,
        getDays: function () {
            if (!this.days) {
                this.days = Lampa.request("calendar:new");
            }
            return this.days;
        },
        lessons: null,
        getLessons: function () {
            if (!this.lessons) {
                this.lessons = Lampa.request("lessons:empty");
            }
            return this.lessons;
        },
        main: function () {
            try {
                var _this = this;
                $.when(Lampa.request("school:entity"), Lampa.request("batch:head"))
                    .done(function (school, model) {
                        var view = new Add.Layout({model: model});
                        view.days = _this.getDays();
                        (new Lampa.SkeletonView()).page.show(view);
                    });
            } catch (ex) {
                console.log(ex.message);
            }
        }
    }
});
