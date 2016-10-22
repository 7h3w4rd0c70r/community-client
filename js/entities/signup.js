/**
 * Created by Roman on 16.6.14.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Signup = Backbone.Model.extend({
        url: function () {
            return Lampa.restUrl + "/signup";
        },
        defaults: {
            invitationID: null,
            name: '',
            email: '',
            type: 'freelancer',
            password: '',
            repeatedPwd: '',
            fbID: null
        }
    });

    Entities.SignUpApi = Entities.Api.extend({
        SignUp: function (model) {
            var parent = this;
            Lampa.trigger("progressBar:show");
            model.save(null, {
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    //todo: check password strong
                    Lampa.trigger("error", this);
                },
                success: function (data) {
                    Lampa.trigger("progressBar:hide");
                    parent.login(data.get("email"), data.get("password"));
                }
            });
        },
        login: function (login, pwd) {
            Lampa.request("login:user", {login: md5(login), pwd: md5(pwd)});
        }
    });

    var api = new Entities.SignUpApi();

    Lampa.reqres.setHandler("signup:do", function (model) {
        return api.SignUp(model);
    });
    Lampa.reqres.setHandler("signup:entity", function () {
        return new Entities.Signup();
    });
});