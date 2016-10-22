/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("AccountModule.AccountShow", function (AccountShow, Lampa, Backbone, Marionette, $, _) {
    AccountShow.Controller = {
        main: function () {
            var skeleton = new Lampa.SkeletonView();
            $.when(Lampa.request("account:my")).done(function (model) {
                skeleton.page.show(new AccountShow.Account({model: model}));
            });
        }
    }
});