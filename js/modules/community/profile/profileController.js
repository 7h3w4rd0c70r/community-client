/**
 * Created by root on 15.1.16.
 */

Lampa.module("CommunityModule.Profile", function (Profile, Lampa, Backbone, Marionette, $, _) {
    Profile.Controller = {
        profiles: function () {
            try {
                (new Lampa.SkeletonView()).page.show(new Profile.Index({ }));
            } catch (ex) {
                console.log(ex);
            }
        },
        profile: function(profileId) {
            try {
                Lampa.request('profile:entity', profileId, true).then(function (profile, asks) {
                    (new Lampa.SkeletonView()).page.show(new Profile.Profile({
                        model: profile,
                        asks: asks
                    }));
                });
            } catch (ex) {
                console.log(ex.message);
            }
        },
        me: function () {
            try {
                Lampa.request('profile:entity', Lampa.request('helper:getMyAccountID'), true)
                    .then(function (profile) {
                    (new Lampa.SkeletonView()).page.show(new Profile.Me({
                        model: profile
                    }));
                });
            } catch (ex) {
                console.log(ex);
            }
        }
    }
});