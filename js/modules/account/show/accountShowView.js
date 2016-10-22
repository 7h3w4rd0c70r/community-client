/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("AccountModule.AccountShow", function (AccountShow, Lampa, Backbone, Marionette, $, _) {
    AccountShow.Account = Lampa.EditableItemView.extend({
        template: "account/show",
        entity: "account",
        saveModelRequest: "account:save",
        className: "container",
        regions: {
            accessRegion: "#access",
            avatarUploadRegion: "#avatar-upload",
            passwordRegion: "#password-change"
        },
        ui: {
            firstName: "#firstName",
            lastName: "#lastName",
            phone: "#phone",
            email: "#email"
        },
        onShow: function () {
            Lampa.trigger("progressBar:show");
            var _this = this;
            $.when(Lampa.request("access:entities"))
                .then(function (collection) {
                    _this.accessRegion.show(new AccountShow.Accesses({collection: collection}));
                    Lampa.trigger("progressBar:hide");
                });

            $.when(Lampa.request("role:load"))
                .then(function (role) {
                    if (role === "t" || role === "a") {
                        _this.avatarUploadRegion.show(new AccountShow.File({model: Lampa.request("account:avatar")}));
                    }
                });

            $.when(Lampa.request("account:get:pwd"))
                .then(function (model) {
                    _this.passwordRegion.show(new AccountShow.PasswordChangeView({model: model}));
                });
        }
    });

    AccountShow.NoAccess = Marionette.ItemView.extend({
        template: "account/no-access",
        tagName: "li"
    });

    AccountShow.Access = Marionette.ItemView.extend({
        template: "account/access",
        className: "clickable",
        tagName: "li",
        events: {
            "click": "changeRole"
        },
        changeRole: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("access:set-active", this.model);
            Lampa.request("role:set", this.model.get("type"));
        }
    });

    AccountShow.Accesses = Marionette.CompositeView.extend({
        template: "account/accesses",
        childView: AccountShow.Access,
        emptyView: AccountShow.NoAccess,
        childViewContainer: "ul",
        collectionEvents: {
            "change": "render"
        }
    });

    AccountShow.PasswordChangeView = Marionette.ItemView.extend({
        template: "account/password",
        ui: {
            "button": "#apply",
            "password": "#new-pwd",
            "rewrite": "#re-pwd",
            "oldPwd": "#old-pwd"
        },
        events: {
            "click @ui.button": "applyChanges"
        },
        applyChanges: function (e) {
            e.preventDefault();
            e.stopPropagation();
            var newPwd = this.ui.password.val();
            if (newPwd && newPwd === this.ui.rewrite.val()) {

                //change to md5
                this.model.set("oldPwd", this.ui.oldPwd.val());
                this.model.set("newPwd", newPwd);

                if (Lampa.request("helper:isPwdMatchingPolicy", newPwd)) {
                    alert("The New Password didn't match security policy.");
                } else {
                    $.when(Lampa.request("account:set:pwd", this.model))
                        .then(function (result) {
                            if (result) {
                                alert("New Password set.");
                            } else {
                                alert("Error occured");
                            }
                        });
                }

            } else {
                alert("The New Password field and Confirm password field didn't match.");
            }
        }
    });

    AccountShow.File = Marionette.ItemView.extend({
        template: "account/avatar-upload"
    });

    Lampa.on("avatar:load", function () {
        Lampa.trigger("progressBar:hide");
        Lampa.request("helper:getAvatarNewVersion");
        $(".avatar").attr("src", Lampa.request("helper:getAvatarUriVersioned"));
    });
});