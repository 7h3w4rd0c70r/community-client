/**
 * Created by root on 17.1.16.
 */

Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {

    Entities.ShareActivity = Backbone.Model.extend({
        idAttribute: "activityID",
        activityID: null,
        defaults: {
        },
        url: Lampa.restUrl + "/key/" + Lampa.request("key:entity") + "/share"
    });

    Entities.ToggleMyActivity = Backbone.Model.extend({
        defaults: {
            internUrl: ''
        },
        url: function() {
            return this.internUrl;
        },
        setID: function(newID) {
            this.internUrl = Lampa.restUrl + '/key/' + Lampa.request("key:entity") + '/share/toggle/' + newID;
        }
    });

    Entities.ShareActivities = Backbone.Collection.extend({
        model: Entities.ShareActivity,
        query: null,
        comparator: "activityID",
        offset: 0,
        rows: 1000,
        search: '',
        duration: 0,
        condition: 'bigger',
        url: function () {
            var key = Lampa.request("key:entity");

            if (this.search === null || this.search === undefined) {
                this.search = '';
            }

            if (this.duration === null || this.duration === undefined) {
                this.duration = '0';
            }
            if (this.condition === null || this.condition === undefined) {
                this.condition = 'bigger';
            }

            return Lampa.restUrl + "/key/" + key
                + "/activities?offset=" + this.offset
                + '&rows=' + this.rows
                + '&search=' + this.search
                + '&condition=' + this.condition
                + '&duration=' + this.duration;
        }
    });

    Entities.FollowedActivities = Backbone.Collection.extend({
        url: Lampa.restUrl + '/key/' + Lampa.request('key:entity') + '/share/list?shared=shared',
        model: Entities.ShareActivity
    });

    Lampa.ShareApi = Entities.Api.extend({
        entities: null,
        getList: function () {
            this.entities = new Entities.ShareActivities();
            this.entities.fetch();
            return this.entities;
        },
        getListAuthor: function (id) {
            this.entities = new Entities.ShareActivities();
            this.entities.url = Lampa.restUrl + '/key/' + Lampa.request('key:entity') + '/share/list?author=' + id;
            this.entities.fetch();
            return this.entities;
        },
        getFollowedList: function () {
            this.entities = new Entities.FollowedActivities();
            this.entities.fetch();
            return this.entities;
        },
        toggle: function (activityID) {
            var model = new Entities.ToggleMyActivity();
            model.setID(activityID);
            model.fetch();
        }
    });

    var API = new Lampa.ShareApi();

    Lampa.reqres.setHandler("share:list", function () {
        return API.getList();
    });

    Lampa.reqres.setHandler("activities:profile", function (id) {
        return API.getListAuthor(id);
    });

    Lampa.reqres.setHandler("share:followed-list", function () {
        return API.getFollowedList();
    });

    Lampa.reqres.setHandler("share:checkRecord", function (id) {
        var activity = new Entities.ShareActivity();
        activity.activityID = id;
        activity.url += '/get/' + id;
        activity.fetch();
        if (activity.attributes.shared == 'false')
            return false;
        else
            return true;
        });

    Lampa.reqres.setHandler("share:toggle", function (activityID) {
        API.toggle(activityID);
    });
});