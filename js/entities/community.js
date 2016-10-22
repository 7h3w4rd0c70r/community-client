/**
 * Created by root on 8.1.16.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.CommunityProfile = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity");
            return Lampa.restUrl + "/key/" + key + "/community/profile/" + this.get('accountID');
        },

        idAttribute: "accountID",

        defaults: {
            accountID: null,
            degree: '',
            name: '',
            surname: '',
            city: '',
            zip: '',
            state: '',
            mobile: '',
            email: '',
            profilePhoto: Lampa.restUrl + '/../uploads/account/default.svg'
        }
    });

    Entities.CommunityApi = Entities.Api.extend({
        profile: null,

        getWholeProfile: function () {
            this.profile = new Entities.CommunityProfile();
            this.profile.fetch();
            return this.profile;
        }
    });

    var communityApi = new Entities.ImFollowingApi();

    Lampa.reqres.setHandler("following:im-list", function () {
        return communityApi.getWholeProfile();
    });
});