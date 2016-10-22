/**
 * Created by root on 4.1.16.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Following = Backbone.Collection.extend({
        url: '',
        data: {
            who: null,
            page: 1
        },
        serialize: function () {
            if (this.data.who == null)
                this.data.who = 'IM';
            this.url = Lampa.restUrl + '/key/' + Lampa.request('key:entity') + '/following?who=' +
                this.data.who + '&page=' + this.data.page;
        },
        setDirection: function (who) {
            this.data.who = who;
            this.serialize();
        },
        setPage: function (page) {
            this.data.page = page;
            this.serialize();
        }
    });

    Entities.FollowingSwitch = Backbone.Model.extend({
        url: '',
        data: {
            direction: '',
            targetID: null
        },
        serialize: function () {
            this.url = Lampa.restUrl + '/key/' + Lampa.request('key:entity') + '/' + this.data.direction +
                '?targetID=' + this.data.targetID;
        },
        setTarget: function (targetID) {
            this.data.targetID = targetID;
            this.serialize();
        },
        setDirection: function (direction) {
            this.data.direction = direction;
            this.serialize();
        }
    });

    Entities.FollowingCheck = Backbone.Model.extend({
        url: '',
        data: {
            direction: null,
            ID: null
        },
        serialize: function () {
            this.url = Lampa.restUrl + '/key/' + Lampa.request('key:entity') + '/following/check?direction=' +
                this.data.direction + '&id=' + this.data.ID;
        },
        setDirection: function (direction) {
            this.data.direction = direction;
            this.serialize();
        },
        setID: function (userID) {
            this.data.ID = userID;
            this.serialize();
        }
    });

    Entities.FollowingApi = Entities.Api.extend({
        record: null,
        profiles: null,
        getFollowing: function (params) {
            this.profiles = new Entities.Following();
            if (params.page == undefined)
                params.page = 1;
            this.profiles.setDirection(params.who);
            this.profiles.setPage(params.page);
            this.profiles.fetch({
                async: false
            });
            return this.profiles;
        },
        switch: function (data) {
            this.record = new Entities.FollowingSwitch();
            this.record.setTarget(data.targetID);
            this.record.setDirection(data.direction);
            this.record.fetch({
                async: false
            });
        },
        check: function (data) {
            this.record = new Entities.FollowingCheck();
            if (data.direction == undefined)
                data.direction = null;
            if (data.userID == undefined)
                data.userID = null;
            this.record.setDirection(data.direction);
            this.record.setID(data.userID);
            this.record.fetch({
                async: false
            });
            var exists = this.record.attributes[0].exist;
            return !(exists == '0' || exists == 0);
        }
    });

    var followingApi = new Entities.FollowingApi();

    Lampa.reqres.setHandler('following:list', function (params) {
        return followingApi.getFollowing(params);
    });

    Lampa.reqres.setHandler('following:check', function (data) {
        return followingApi.check(data);
    });

    Lampa.reqres.setHandler('following:follow', function (targetID) {
        followingApi.switch({ targetID: targetID, direction: 'follow' });
    });

    Lampa.reqres.setHandler('following:unfollow', function (targetID) {
        followingApi.switch({ targetID: targetID, direction: 'unfollow' });
    });
});






