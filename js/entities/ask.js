Lampa.module('Entities', function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Ask = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request('key:entity');
            return (this.get('askID') === null)
                ? Lampa.restUrl + '/key/' + key + '/ask'
                : Lampa.restUrl + '/key/' + key + '/ask/' + this.get('askID');
        },
        initialize: function (thisModel, parentCollection) {
            this.options = {
                answer: Lampa.request('answer:entity'),
                page: 1,
                order: '',
                _parent: parentCollection
            };
            this.set('authorName', '');
        },
        idAttribute: 'askID',
        defaults: {
            askID: null,
            authorID: null,
            question: '',
            content: '',
            timeStamp: new Date(),
            votes: 0,
            lastUpdate: new Date()
        }
    });
    
    Entities.Asks = Backbone.Collection.extend({
        model: Entities.Ask,
        parse: function (raw, options) {
            if (raw._meta) {
                Lampa.request('_meta:save', 'Asks', 'count', raw._meta.count);
                return raw.data;
            }
            return raw;
        },
        /*comparator: function (model) {
            return - (new Date(model.get('lastUpdate')).getTime());
        },*/
        url: function () {
            return Lampa.restUrl + '/key/' + Lampa.request('key:entity') + '/asks'
        }
    });

    Entities.AskVotes = Backbone.Model.extend({
        url: function () {
            return Lampa.restUrl + '/key/' + Lampa.request('key:entity') + '/ask/' + this.get('askID') + '/vote'
        },
        defaults: {
            voted: false
        }
    });
    
    Entities.AskApi = Entities.Api.extend({
        newEntity: function () {
            return new Entities.Ask();
        },
        loadEntity: function (id) {
            Lampa.trigger('progressBar:show');
            var defer = $.Deferred();
            var entity = new Entities.Ask();
            if (id === null) {
                Lampa.trigger('progressBar:hide');
                return entity;
            }
            entity.set('askID', id);
            var args = {
                error: function () {
                    Lampa.trigger('error', this);
                },
                success: function () {
                    defer.resolve(entity);
                }
            };
            entity.fetch(args).done(function () {
                Lampa.trigger('progressBar:hide');
            });
            return defer;
        },
        loadEntities: function (params) {
            Lampa.trigger('progressBar:show');
            var defer = $.Deferred();
            var entities = new Entities.Asks();
            var args = {
                error: function () {
                    Lampa.trigger('error', this);
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
                    Lampa.request('alert', 'Action failed. The resources may be unavailable. Ple try it again later.', 'red', 'Error');
                    Lampa.trigger('error', this);
                    defer.resolve(null);
                },
                success: function (savedModel) {
                    defer.resolve(savedModel);
                }
            };
            model.save(null, args).done(function () {
                Lampa.trigger('progressBar:hide');
            });
            return defer;
        },
        destroyEntity: function (model) {
            Lampa.trigger('progressBar:show');
            var defer = $.Deferred();
            var args = {
                error: function () {
                    Lampa.trigger('error', this);
                },
                success: function () {
                    defer.resolve();
                }
            };
            model.destroy(args).done(function () {
                Lampa.trigger('progressBar:hide');
            });
            return defer;
        },
        getVote: function (askID) {
            Lampa.trigger('progressBar:show');
            var defer = new $.Deferred(),
                entity = new Entities.ActivityVote(),
                args = {
                    error: function () {
                        defer.resolve(null);
                    },
                    success: function () {
                        defer.resolve(entity);
                    }
                };
            entity.set('askID', askID);
            entity.fetch(args).then(function () {
                Lampa.trigger('progressBar:hide');
            });
            return defer;
        },
        saveVote: function (model) {
            var defer = new $.Deferred(),
                args = {
                    error: function () {
                        defer.resolve(model);
                    },
                    success: function () {
                        defer.resolve(model);
                    }
                };
            model.save(null, args);
            return defer;
        }
    });

    var AskApi = new Entities.AskApi();
    
    Lampa.reqres.setHandler('ask:entities', function (params) {
        if (params)
            return AskApi.loadEntities(params);
        return AskApi.loadEntities(null);
    });
    
    Lampa.reqres.setHandler('ask:entity', function (id) {
        if (id)
            return AskApi.loadEntity(id);
        return AskApi.newEntity();
    });
    
    Lampa.reqres.setHandler('ask:new', function () {
        return AskApi.newEntity();
    });
    
    Lampa.reqres.setHandler('ask:save', function (model) {
        if (model)
            return AskApi.saveEntity(model);
        return AskApi.saveEntity(
            AskApi.newEntity()
        );
    });

    Lampa.reqres.setHandler('ask:destroy', function (model) {
        if (model)
            return AskApi.destroyEntity(model);
        return null;
    });
    
});












