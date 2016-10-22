/**
 * Created by Roman on 23.5.14.
 */

Lampa.module("SecurityModule.Login", function (Login, Lampa, Backbone, Marionette, $, _) {
    Login.Controller = {
        main: function () {
            Lampa.trigger("progressBar:show");
            $.when(Lampa.request("user:entity")).done(function (user) {
                _.isNumber(user.get('accountID')) ? Lampa.trigger('open:start-page') : Lampa.mainRegion.show(new Login.loginView({model: user}));
                Lampa.trigger("progressBar:hide");
            });
        }
    }
});