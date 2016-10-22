/**
 * Created by Roman on 23.5.14.
 */

Lampa.module("ActivitiesModule.Grid", function (Grid, Lampa, Backbone, Marionette, $, _) {
    Grid.Controller = {
        main: function (params) {
            var model = new Backbone.Model({
                keyword: "",
                duration: 0,
                condition: "bigger",
                public: 0,
                private: 0,
                shared: 0
            });

            try {
                var linkJson = String("{\"" + String(params).replace(/"/g, "\\\"").replace(/&/g, "\",\"").replace(/=/g, "\":\"") + '"}').replace("\"\",", "");
                var p = params ? JSON.parse(linkJson) : {};
                if (p.keyword) {
                    model.set('keyword', decodeURIComponent(p.keyword));
                }
                if (p.duration && p.condition) {
                    model.set('duration', p.duration);
                    model.set('condition', p.condition);
                }
            } catch (ex) {
                console.log(ex.message);
            }

            (new Lampa.SkeletonView()).page.show(new Grid.Layout({
                collection: Lampa.request("activity:entities"),
                model: model
            }));
        }
    }
});