/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("StudentModule.Homework", function (Homework, Lampa, Backbone, Marionette, $, _) {
    Homework.Controller = {
        main: function () {
            try {
                $.when(Lampa.request("homework:list")).then(function (collection) {
                    (new Lampa.SkeletonView()).page.show(new Homework.List({collection: collection}));
                });
            } catch (ex) {
                console.log(ex);
            }
        }
    };
});