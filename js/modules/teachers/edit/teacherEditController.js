/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("TeachersModule.Edit", function (Edit, Lampa, Backbone, Marionette, $, _) {
    Edit.Controller = {
        main: function (model) {
            $.when(Lampa.request("school:entity")).done(function () {
                (new Lampa.SkeletonView()).page.show(new Edit.Teacher({model: model}));
            });
        }
    };
});