/**
 * Created by Roman Brhel on 06.09.2016.
 */

Lampa.module("AccountModule.Invite", function (Invite, Lampa, Backbone, Marionette, $, _) {
    Invite.Page = Marionette.ItemView.extend({
        template: "account/invitation",
        className: "container",
        behaviors: {
            Trumbowyg: {
                item: "message",
                menu: false
            }
        },
        ui: {
            "fullName": "#full-name",
            "email": "#email",
            "send": "#send",
            "message": "#message"
        },
        events: {
            "click @ui.send": "sendMessage"
        },
        sendMessage: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.model.set('message', this.ui.message.trumbowyg('html'));
            $.when(Lampa.request('send:teacher:invitation', this.model)).done(function (status) {
                if (status.get('message')) {
                    $('#invite-button').fadeOut();
                }
            });
        }
    });
});