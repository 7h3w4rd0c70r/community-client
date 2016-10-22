/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("AccountModule", function (AccountModule, Lampa, Backbone, Marionette, $, _) {
    AccountModule.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "account/show": "accountShowPage",
            "account/welcome": "showWelcomePage",
            "account/invite": "showInvitePage"
        }
    });

    var API = {
        accountShowPage: function () {
            Lampa.trigger("header:show");
            Lampa.trigger("footer:show");
            Lampa.AccountModule.AccountShow.Controller.main();
        },
        showWelcomePage: function () {
            Lampa.trigger("header:show");
            Lampa.trigger("footer:show");
            Lampa.AccountModule.Welcome.Controller.main();
        },
        showInvitePage: function () {
            Lampa.trigger("header:show");
            Lampa.trigger("footer:show");
            Lampa.AccountModule.Invite.Controller.main();
        }
    };

    Lampa.on("account:default", function () {
        Lampa.trigger("account:show");
    });

    Lampa.on("account:show", function () {
        Lampa.navigate("account/show");
        API.accountShowPage();
    });

    Lampa.on("account:welcome", function () {
        Lampa.navigate("account/welcome");
        API.showWelcomePage();
    });

    Lampa.on("account:invite", function () {
        Lampa.navigate("account/invite");
        API.showInvitePage();
    });

    Lampa.addInitializer(function () {
        try {
            new AccountModule.Router({controller: API});
        } catch (ex) {
            console.log(ex.message);
        }
    });
});