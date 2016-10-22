/**
 * Created by Roman Brhel on 10.08.2016.
 */

Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Invitation = Backbone.Model.extend({
        url: function () {
            if (this.get("hash") !== "") {
                return Lampa.restUrl + "/invitation/" + this.get("hash");
            }
            return Lampa.restUrl + "/key/" + Lampa.request("key:entity") + "/invitation";
        },
        defaults: {
            invitationID: null,
            message: "",
            accountID: null,
            senderFullName: "",
            schoolName: "",
            from: "",
            fullName: "",
            firstName: "",
            to: "",
            type: 0,
            personID: null,
            hash: "",
            password: null,
            repeatedPwd: null
        }
    });

    Entities.Invitations = Backbone.Collection.extend({
        model: Entities.Invitation,
        comparator: "invitationID",
        personID: null,
        url: function () {
            var key = Lampa.request("key:entity");
            return Lampa.restUrl + "/key/" + key + "/teacher/" + this.personID + "/invitations";
        }
    });

    Entities.InvitationApi = Entities.Api.extend({
        getNewEntity: function () {
            return new Entities.Invitation();
        },
        getNewTeacherInvitation: function (teacher) {
            var defer = new $.Deferred();
            var invitation = this.getNewEntity();
            $.when(Lampa.request("account:my"), Lampa.request("access:get-active")).done(function (account, access) {
                invitation.set("type", 1); // invitation to school
                invitation.set("personID", teacher.get("personID"));
                invitation.set("fullName", teacher.get("fullName"));
                invitation.set("firstName", teacher.get("firstName"));
                invitation.set("to", teacher.get("email"));
                invitation.set("senderFullName", account.get("fullName"));
                invitation.set("from", account.get("email"));
                invitation.set("schoolID", access.get("schoolID"));
                invitation.set("schoolName", access.get("schoolName"));
                defer.resolve(invitation);
            });

            return defer;
        },
        getEntityFromHash: function (hash) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            var entity = this.getNewEntity();

            entity.set("hash", hash);

            var _this = this;
            entity.fetch({
                error: function (data, error) {
                    Lampa.trigger("progressBar:hide");
                    Lampa.trigger("error", error);
                },
                success: function (data) {
                    Lampa.trigger("progressBar:hide");
                    _this.entity = data;
                    defer.resolve(data);
                }
            });
            return defer;
        },
        personID: null,
        getTeachersInvitations: function (personID) {
            var invitations = new Entities.Invitations();
            invitations.personID = personID;
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            invitations.fetch({
                error: function (data, error) {
                    Lampa.trigger("progressBar:hide");
                    Lampa.trigger("error", error);
                },
                success: function (data) {
                    Lampa.trigger("progressBar:hide");
                    defer.resolve(data);
                }
            });
            return defer;
        }
    });

    var api = new Entities.InvitationApi();

    Lampa.reqres.setHandler("teacher:invitation", function (teacher) {
        return api.getNewTeacherInvitation(teacher);
    });

    Lampa.reqres.setHandler("invitation:hash", function (hash) {
        return api.getEntityFromHash(hash);
    });

    Lampa.reqres.setHandler("send:teacher:invitation", function (model) {
        return api.saveEntity(model);
    });

    Lampa.reqres.setHandler("teacher:invitations", function (personID) {
        return api.getTeachersInvitations(personID);
    });
});