/**
 * Created by Roman on 10.6.14.
 */
Lampa.module("SecurityModule", function (SecurityModule, Lampa, Backbone, Marionette, $, _) {
    SecurityModule.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "login": "showLogin",
            "signup": "showSignUp",
            "invitation/:hash": "showInvitation"
        }
    });

    var api = {
        showLogin: function () {
            SecurityModule.Login.Controller.main();
        },
        showSignUp: function () {
            SecurityModule.Signup.Controller.main();
        },
        showInvitation: function (hash) {
            SecurityModule.Invitation.Controller.main(hash);
        }
    };

    Lampa.on("open:start-page", function () {
        window.location = 'app' + '.' + 'h' + 't' + 'ml';
    });

    Lampa.on("security:login", function () {
        Lampa.navigate("login");
        api.showLogin();
    });

    Lampa.on("security:signup", function () {
        Lampa.navigate("signup");
        api.showSignUp();
    });

    Lampa.on("invitation:accept", function (hash) {
        try {
            Lampa.navigate("invitation/" + hash);
            API.editItem(param);
        }
        catch (ex) {
            console.log(ex.message);
        }
    });

    Lampa.addInitializer(function () {
        new SecurityModule.Router({controller: api});
    });
});