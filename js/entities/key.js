/**
 * Created by Roman on 13.6.14.
 */

Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Key = Backbone.Model.extend({
        url: function () {
            return this.get("login") ? Lampa.restUrl.concat("/login/", this.get("login"), "/pwd/", this.get("pwd")) : Lampa.restUrl + "/key";
        },
        defaults: {
            login: null,
            pwd: null,
            key: null
        }
    });

    Entities.KeyApi = Marionette.Object.extend({
        key: null,
        setMasterKey: function (credentials) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            var entity = new Entities.Key(credentials);
            entity.fetch({
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    var message = "Wrong email or password!";
                    alert(message);
                },
                success: function (data) {
                    try {
                        Lampa.trigger("progressBar:hide");
                        if (data) {
                            var key = data.get("key") || "";
                            Lampa.request("helper:setCookie", "key", key, 1);
                            defer.resolve(key);
                        }
                    } catch (ex) {
                        console.log(ex.message);
                    }
                }
            });
            return defer;
        },
        getKey: function () {
            var key = this.key ? this.key : Lampa.request("helper:getCookie", "key");
            if (!key || key.trim() === "") {
                Lampa.trigger("logout");
            }
            return key;
        },
        isValid: function () {
            if (!this.getKey()) {
                return false;
            }
            return this.getKey().length === 32;
        },
        logout: function () {
            this.key = null;
            Lampa.request("helper:deleteCookie", "key");
        }
    });

    var api = new Entities.KeyApi();

    Lampa.reqres.setHandler("logout:user", function () {
        return api.logout();
    });

    Lampa.reqres.setHandler("key:entity", function () {
        return api.getKey();
    });

    Lampa.reqres.setHandler("login:user", function (credentials) {
        $.when(api.setMasterKey(credentials)).done(function (key) {
            if (Lampa.request("helper:isKeyValid", key)) {
                Lampa.trigger("open:start-page");
            }
        });
    });
});