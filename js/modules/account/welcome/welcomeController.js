/**
 * Created by Roman Brhel on 28.07.2016.
 */

Lampa.module("AccountModule.Welcome", function (Welcome, Lampa, Backbone, Marionette, $, _) {
    Welcome.Controller = {
        main: function () {
            $.when(Lampa.request('role:load')).then(function () {
                (new Lampa.SkeletonView()).page.show(new Welcome.Page());
            });
        }
    }
});