/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("CommunityModule", function (CommunityModule, Lampa, Backbone, Marionette, $, _) {
    CommunityModule.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "community": "communityAsks",
            "community/asks": "communityAsks",
            "community/ask/:id": "communityAsk",
            "community/jobs": "communityJobs",
            "community/blog": "communityBlog",
            "community/profile": "communityProfile",
            "community/profile/:id": "communityProfile",
            "community/profiles": "communityProfiles"
        }
    });

    var API = {
        before: function () {
            Lampa.trigger("header:show");
        },

        communityAsks: function () {
            this.before();
            Lampa.request("page:title", 'Ask LAMPA');
            CommunityModule.Ask.Controller.asks();
        },

        communityAsk: function (askID) {
            this.before();
            Lampa.request("page:title", 'Ask LAMPA');
            CommunityModule.Ask.Controller.ask(askID);
        },

        communityJobs: function () {
            this.before();
            Lampa.request("page:title", 'Job Board');
            // TODO: communityJobs
        },

        communityBlog: function () {
            this.before();
            Lampa.request("page:title", 'Teacher Blogs');
            // TODO: communityBlog
        },

        communityProfiles: function () {
            this.before();
            Lampa.request("page:title", 'Profiles');
            CommunityModule.Profile.Controller.profiles();
        },

        communityProfile: function (profileID) {
            this.before();
            Lampa.request("page:title", 'Profile');
            if (profileID)
                return CommunityModule.Profile.Controller.profile(profileID);
            CommunityModule.Profile.Controller.me();
        }
    };

    Lampa.addInitializer(function () {
        new CommunityModule.Router({
            controller: API
        })
    });

    Lampa.on("community:default", function () {
        Lampa.navigate('community');
        API.communityInvite();
    });

    Lampa.on("community:asks", function () {
        Lampa.navigate('community/asks');
        API.communityAsks();
    });

    Lampa.on("community:ask", function (askID) {
        Lampa.navigate('community/ask/' + askID);
        API.communityAsk(askID);
    });

    Lampa.on("community:profiles", function () {
        Lampa.navigate('community/profiles');
        API.communityProfiles();
    });

    Lampa.on("community:profile", function (profileID) {
        Lampa.navigate('community/profile/' + profileID);
        API.communityProfile(profileID);
    });
});