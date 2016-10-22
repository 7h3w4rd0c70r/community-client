/**
 * Created by root on 15.1.16.
 */

Lampa.module('Entities', function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Profile = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request('key:entity');
            return (this.get('accountID') === null)
                ? Lampa.restUrl + '/key/' + key + '/profile'
                : Lampa.restUrl + '/key/' + key + '/profile/' + this.get('accountID');
        },
        parse: function (raw, options) {
            if (raw._meta) {
                Lampa.request('_meta:save', 'Profiles', 'followers', raw._meta.followers);
                return raw.data;
            }
            return raw;
        },
        idAttribute: 'accountID',
        defaults: {
            accountID: null,
            anchorID: null,
            accessID: null,
            fullName: '',
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            email_validated: 0,
            username: '',
            createdAt: null,
            firstpageURI: '',
            nickname: '',
            summary: '',
            goal: '',
            interests: ''
        }
    });

    Entities.Profiles = Backbone.Collection.extend({
        model: Entities.Ask,
        comparator: 'fullName',
        parse: function (raw, options) {
            if (raw._meta) {
                Lampa.request('_meta:save', 'Profiles', 'count', raw._meta.count);
                Lampa.request('_meta:save', 'Profiles', 'followers', raw._meta.followers);
                return raw.data;
            }
            return raw;
        },
        url: function () {
            return Lampa.restUrl + '/key/' + Lampa.request('key:entity') + '/profiles'
        }
    });

    Entities.ProfileApi = Entities.Api.extend({
        newEntity: function () {
            return new Entities.Profile();
        },
        loadEntity: function (id) {
            Lampa.trigger('progressBar:show');
            var _this = this,
                defer = $.Deferred(),
                entity = new Entities.Profile();
            if (!id) {
                Lampa.trigger('progressBar:hide');
                return entity;
            }
            var args = {
                error: function () {
                    Lampa.trigger('error', this);
                },
                success: function () {
                    defer.resolve(entity);
                }
            };
            entity.set('accountID', id);
            entity.fetch(args).done(function () {
                Lampa.trigger('progressBar:hide');
            });
            return defer;
        },
        loadEntities: function (params) {
            Lampa.trigger('progressBar:show');
            var defer = $.Deferred();
            var entities = new Entities.Profiles();
            var args = {
                error: function () {
                    Lampa.trigger('error', this);
                    defer.resolve(null);
                },
                success: function () {
                    defer.resolve(entities);
                }
            };
            if (params)
                args.data = $.param(params);
            entities.fetch(args).done(function () {
                Lampa.trigger('progressBar:hide');
            });
            return defer;
        },
        saveEntity: function (model) {
            Lampa.trigger('progressBar:show');
            var defer = $.Deferred();
            var args = {
                error: function () {
                    Lampa.trigger('error', this);
                },
                success: function (savedModel) {
                    defer.resolve(savedModel);
                }
            };
            model.save(args).done(function () {
                Lampa.trigger('progressBar:hide');
            });
            return defer;
        }
    });

    var ProfileApi = new Entities.ProfileApi();

    Lampa.reqres.setHandler('profile:entities', function (params) {
        if (params)
            return ProfileApi.loadEntities(params);
        return ProfileApi.loadEntities(null);
    });

    Lampa.reqres.setHandler('profile:entity', function (id, forceDownload) {
        forceDownload = forceDownload || false;
        var defer = $.Deferred();
        if (forceDownload)
            return ProfileApi.loadEntity(id);
        $.when(Lampa.request('local:exist', 'profiles')).then(function (exist) {
            if (!exist)
                Lampa.request('local:constructTable', 'profiles', ProfileApi.loadEntity);
        }).then(function () {
            $.when(Lampa.request('local:fetch', 'profiles', id)).then(function (entity) {
                defer.resolve(entity);
            });
        });
        return defer;
    });

    Lampa.reqres.setHandler('profile:new', function () {
        return ProfileApi.newEntity();
    });

    Lampa.reqres.setHandler('profile:save', function (model) {
        if (model)
            return ProfileApi.saveEntity(model);
        return ProfileApi.saveEntity(null);
    });
});












