/**
 * Created by Roman Brhel on 18.08.2016.
 */

Lampa.module("SecurityModule.Invitation", function (Invitation, Lampa, Backbone, Marionette, $, _) {
    Invitation.Controller = {
        main: function (hash) {
            $.when(Lampa.request("invitation:hash", hash)).done(function (model) {
                Lampa.mainRegion.show(new Invitation.acceptView({model: model}));
            });
        }
    }
});
