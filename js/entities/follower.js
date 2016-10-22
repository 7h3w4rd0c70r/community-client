/**
 * Created by Patrik on 9/16/2016.
 */

Lampa.module('Entities', function (Entities, Lampa, Backbone, Marionette, $, _) {

    Entities.Follower = Backbone.Model.extend({
        url: Lampa.restUrl + '/key/' + Lampa.request('key:entity') + '/following'
    });

    Entities.FollowerApi = Entities.Api.extend({
        change: function (targetID, action) {
            var defer = $.Deferred(),
                follower = new Entities.Follower();
            follower.fetch({
                data: $.param({
                    action: action,
                    targetID: targetID
                })
            }).then(function () {
                defer.resolve(null);
            });
            return defer;
        }
    });

    var FollowerApi = new Entities.FollowerApi();

    Lampa.reqres.setHandler('follow', function (targetID) {
        return FollowerApi.change(targetID, 'follow');
    });

    Lampa.reqres.setHandler('unfollow', function (targetID) {
        return FollowerApi.change(targetID, 'unfollow');
    });

});