/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("StudentModule.Show", function (Show, Lampa, Backbone, Marionette, $, _) {
    Show.Layout = Marionette.LayoutView.extend({
        template: "student/show",
        className: "container",
        regions: {
            groupRegion: "#groups",
            lessonsRegion: "#lessons",
            inviteDialogRegion: "#invite-dialog",
            inviteActionRegion: "#invite-action"
        },
        ui: {
            "invite": "#invite-button", // student pay
            "connect": "#connect-button",  // school pay
            "invitation": "#invite-dialog",
            "edit": ".edit",
            "delete": "#delete",
            "back": "#back"
        },
        events: {
            "click @ui.edit": "editItem",
            "click @ui.delete": "deleteItem",
            "click @ui.invite": "showInvitation",
            "click @ui.back": "goBack"
        },
        goBack: function (e) {
            e.preventDefault();
            e.stopPropagation();
            window.history.back();
        },
        editItem: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("student:edit", this.model);
        },
        deleteItem: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.request("student:delete", this.model);
        },
        showInvitation: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.ui.invitation.modal("show");
        },
        onShow: function () {
            var _this = this;
            var personID = _this.model.get("personID");
            if (personID !== undefined) {
                Lampa.trigger("progressBar:show");
                $.when(Lampa.request("student:groups", personID), Lampa.request("student:lessons", personID))
                    .then(function (groups, lessons) {
                        _this.groupRegion.show(new Show.StudentGroups({collection: groups}));
                        _this.lessonsRegion.show(new Show.Lessons({collection: lessons}));
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

                Lampa.trigger("progressBar:hide");
            }
        }
    });

    Show.StudentNoGroups = Marionette.ItemView.extend({
        template: "student/noGroups"
    });

    Show.StudentGroup = Marionette.ItemView.extend({
        template: "student/group-show",
        tagName: "tr"
    });

    Show.StudentGroups = Marionette.CompositeView.extend({
        template: "student/groups",
        childView: Show.StudentGroup,
        childViewContainer: "tbody",
        emptyView: Show.StudentNoGroups
    });

    Show.Lesson = Marionette.ItemView.extend({
        template: "student/lesson",
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
            CourseDetails: {},
            TeacherDetails: {}
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
        template: "student/lessons",
        childViewContainer: "tbody",
        childView: Show.Lesson,
        emptyView: Show.NoLessons,
        behaviors: {
            GroupIcons: {horizontal: true},
            LocationIcons: {horizontal: true},
            CourseIcons: {horizontal: true},
            TeacherIcons: {horizontal: true}
        },
        addLesson: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("lesson:add", this.model);
        }
    });

    Show.Invitation = Marionette.ItemView.extend({
        template: "student/invitation",
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
            this.model.set(
                "message",
                "<p>Hello " + this.model.get("firstName") + ",</p>" +
                "<p>We have created an account for you on MyLAMPA.com. " +
                "Please activate the account to help you with your learning. <br/>" +
                "<ul>" +
                "<li>MyLAMPA will help you to follow your lessons,</li>" +
                "<li>it will help you to learn new vocabulary</li>" +
                "<li>it gives you mobile games to help you learn, and</li>" +
                "<li>it will help you to communicate with your teacher.</li>" +
                "</ul>" +
                "<p>" + this.model.get("senderFullName") + "<br/>" + "<i>" + this.model.get("schoolName") + "</i></p>"
            );
        },
        sendMessage: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.model.set("message", this.ui.message.trumbowyg("html"));
            $.when(Lampa.request("send:teacher:invitation", this.model)).done(function (status) {
                if (status.get("message")) {
                    $("#connect-button").fadeOut();
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
});