/**
 * Created by Roman Brhel on 08.02.15.
 */

Lampa.module("Helpers", function (Helpers, Lampa, Backbone, Marionette, $, _) {
    var API = {
        setCookie: function (name, value, days) {
            var d = new Date();
            d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toGMTString();
            document.cookie = name + "=" + value + "; " + expires;
        },

        getCookie: function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            var i = 0, length = ca.length;
            for (i; i < length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
            }
            return "";
        },

        deleteCookie: function (key) {
            document.cookie = key + "=;";
        }
    };

    Lampa.reqres.setHandler("helper:setCookie", function (name, value, days) {
        return API.setCookie(name, value, days);
    });

    Lampa.reqres.setHandler("helper:getCookie", function (name) {
        return API.getCookie(name);
    });

    Lampa.reqres.setHandler("helper:deleteCookie", function (key) {
        return API.deleteCookie(key);
    });
});