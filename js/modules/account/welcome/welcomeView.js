/**
 * Created by Roman Brhel on 28.07.2016.
 */

Lampa.module("AccountModule.Welcome", function (Welcome, Lampa, Backbone, Marionette, $, _) {
    Welcome.Page = Marionette.ItemView.extend({
        template: "",
        initialize: function () {
            var _this = this;
            $.when(Lampa.request('role:get'))
                .then(function (role) {
                        switch (role) {
                            case "s":
                                _this.template = "account/welcome-student";
                                break;
                            case "c":
                                _this.template = "account/welcome-client";
                                break;
                            case "t":
                                _this.template = "account/welcome-teacher";
                                break;
                            case "a":
                                _this.template = "account/welcome-admin";
                                break;
                            default:
                                console.log('role', model);
                            //Lampa.trigger('logout');
                        }
                    }
                )
            ;
        },
        className: "container",
        behaviors: {
            Tooltips: {}
        }
    });
});