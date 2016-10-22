Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Invite = Backbone.Model.extend({
        url: Lampa.restUrl + '/invite',
        defaults: {
            email: '_NOT_DEFINED',
            msg: '_EMPTY'
        }
    });

    Lampa.reqres.setHandler("invite:email", function (inviteInfo) {
        inviteInfo.save({}, {
            success: function (response,xhr) {
                Lampa.trigger("progressBar:hide");
            },
            error: function (errorResponse) {
                Lampa.trigger("progressBar:hide");
                console.log('err -> ');
                console.log(errorResponse);
            }
        });
    });
});