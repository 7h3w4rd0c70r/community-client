/**
 * Created by Roman on 5.2.2016.
 */

Lampa.module("SecurityModule.Signup", function (Signup, Lampa, Backbone, Marionette, $, _) {
    Signup.Controller = {
        main: function () {
            $.when(Lampa.request("signup:entity")).done(function (model) {
                Lampa.mainRegion.show(new Signup.signupView({model: model}));
            });
        }
    }
});