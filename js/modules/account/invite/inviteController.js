/**
 * Created by Roman Brhel on 06.09.2016.
 */

Lampa.module("AccountModule.Invite", function (Invite, Lampa, Backbone, Marionette, $, _) {
    Invite.Controller = {
        main: function () {
            var skeleton = new Lampa.SkeletonView();
            skeleton.page.show(new Invite.Page());
        }
    }
});