/**
 * Created by Roman on 10.6.14.
 */
Lampa.module("SecurityModule.Login", function (Login, Lampa, Backbone, Marionette, $) {
    Login.loginView = Marionette.LayoutView.extend({
        template: "security/signInOrSignUp",
        className: "container",
        ui: {
            "email": "#sign-in-email",
            "pwd": "#sign-in-pwd",
            "login": "#sign-in-button",
            "signUp": "#sign-up-button"
        },
        onShow: function () {
            this.ui.email.focus();
        },
        events: {
            "keypress :input": "logKey",
            "click @ui.login": "doLogin",
            "click @ui.signUp": "goToSignUp"
        },
        goToSignUp: function () {
            Lampa.trigger('security:signup');
        },
        logKey: function (e) {
            try {
                if (e.keyCode === 13) {
                    if (e.currentTarget.id === "sign-in-email") this.ui.pwd.focus();
                    if (e.currentTarget.id === "sign-in-pwd") this.doLogin();
                }
            }
            catch (ex) {
                console.log("Login error: " + ex.message);
            }
        },
        doLogin: function () {
            try {
                if (this.ui.email[0].checkValidity() === false) {
                    this.ui.email.focus();
                    return;
                }

                if (this.ui.pwd[0].checkValidity() === false) {
                    this.ui.pwd.focus();
                    return;
                }

                Lampa.trigger("progressBar:show");
                Lampa.request("login:user", {login: md5(this.ui.email.val()), pwd: md5(this.ui.pwd.val())});
            }
            catch (ex) {
                console.log("Login error: " + ex.message);
            }
        }
    });
});
