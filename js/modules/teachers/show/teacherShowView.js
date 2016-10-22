/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("TeachersModule.Show", function (Show, Lampa, Backbone, Marionette, $, _) {
    Show.Teacher = Marionette.LayoutView.extend({
        template: "teacher/show",
        className: "container",
        regions: {
            lessonsRegion: "#lessons",
            inviteDialogRegion: "#invite-dialog",
            inviteActionRegion: "#invite-action"
        },
        ui: {
            "invite": "#invite-button",
            "invitation": "#invite-dialog",
            "edit": "#edit",
            "delete": "#delete",
            "back": "#back"
        },
        events: {
            "click @ui.edit": "editItem",
            "click @ui.delete": "deleteItem",
            "click @ui.back": "goBack",
            "click @ui.invite": "showInvitation"
        },
        goBack: function () {
            window.history.back();
        },
        editItem: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("teacher:edit", this.model);
        },
        showInvitation: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.ui.invitation.modal("show");
        },
        deleteItem: function (e) {
            e.preventDefault();
            e.stopPropagation();
            $.when(Lampa.request("teacher:delete", this.model)).done(function () {
                Lampa.request("teachers:refresh");
            });
        },
        onShow: function () {
            Lampa.trigger("progressBar:show");
            var _this = this;

            var personID = _this.model.get("personID");
            if (personID) {
                $.when(Lampa.request("teacher:lessons", personID)).done(function (collection) {
                    _this.lessonsRegion.show(new Show.Lessons({collection: collection}));
                });

                $.when(Lampa.request("teacher:invitation", _this.model)).done(function (invitation) {
                    _this.inviteDialogRegion.show(new Show.Invitation({model: invitation}));
                });

                $.when(Lampa.request("teacher:invitations", personID)).done(function (collection) {
                    if (collection.length > 0) {
                        $("#invite-button").fadeOut();
                    }
                    _this.inviteActionRegion.show(new Show.InvitationActions({collection: collection}));
                });
            }
        }
    });

    Show.Lesson = Marionette.ItemView.extend({
        template: "teacher/lesson",
        tagName: "tr",
        className: function () {
            var value = "clickable ";
            value += Lampa.request(
                "helper:getStatusClass",
                this.model.get("status"),
                "admin",
                this.model.get("start")
            );
            value += "-row";
            return value;
        },
        behaviors: {
            GroupDetails: {},
            LocationDetails: {},
            CourseDetails: {}
        },
        events: {
            "click": "showItem"
        },
        showItem: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("lesson:show", this.model.get("lessonID"));
        }
    });

    Show.NoLessons = Marionette.ItemView.extend({
        template: "group/lessons-none",
        tagName: "tr"
    });

    Show.Lessons = Marionette.CompositeView.extend({
        template: "teacher/lessons",
        childViewContainer: "tbody",
        childView: Show.Lesson,
        emptyView: Show.NoLessons,
        behaviors: {
            GroupIcons: {horizontal: true},
            LocationIcons: {horizontal: true},
            CourseIcons: {horizontal: true}
        },
        ui: {
            "add": "#add-lessons"
        },
        events: {
            "click @ui.add": "addLesson"
        },
        addLesson: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("lesson:add", this.model);
        }
    });

    Show.Invitation = Marionette.ItemView.extend({
        template: "teacher/invitation",
        className: "modal-dialog",
        ui: {
            "send": "#send",
            "message": "#message"
        },
        events: {
            "click @ui.send": "sendMessage"
        },
        behaviors: {
            Trumbowyg: {
                item: "message",
                menu: false
            }
        },
        initialize: function () {
            this.model.set("message",
                "<p>Hello " + this.model.get("firstName") + ", </p><p>I would like to invite you to join MyLAMPA network.<br/>" +
                " LAMPA is a free service that lets you plan and track your lessons more quickly and easily.</div></br>" +
                " Thanks for connecting! <br/>" +
                "<div>" + this.model.get("senderFullName") + "<br/>" + "<i>" + this.model.get("schoolName") + "</i></div></p>");
        },
        sendMessage: function () {
            this.model.set("message", this.ui.message.trumbowyg("html"));
            $.when(Lampa.request("send:teacher:invitation", this.model)).done(function (status) {
                if (status.get("message")) {
                    $("#invite-button").fadeOut();
                }
            });
        }
    });

    Show.Invitate = Marionette.ItemView.extend({
        tagName: "span",
        template: "core/empty",
        onShow: function () {
            $("#invite-button").fadeIn();
        }
    });

    Show.Deny = Marionette.ItemView.extend({
        tagName: "span",
        template: "teacher/deny"
    });

    Show.InvitationActions = Marionette.CollectionView.extend({
        template: "teacher/actions",
        tagName: "span",
        emptyView: Show.Invitate,
        childView: Show.Deny,
        childViewContainer: "span"
    });
});