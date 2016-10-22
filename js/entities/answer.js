Lampa.module('Entities', function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Answer = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request('key:entity');
            return (this.get('answerID') === null)
                ? Lampa.restUrl + '/key/' + key + '/answer'
                : Lampa.restUrl + '/key/' + key + '/answer/' + this.get('answerID');
        },
        initialize: function () {
            this.options = {
                comment: Lampa.request('comment:entity'),
                page: 1,
                order: ''
            };
            this.set('authorName', '');
        },
        idAttribute: 'answerID',
        defaults: {
            answerID: null,
            askID: null,
            authorID: null,
            content: '',
            timeStamp: new Date(),
            votes: 0,
            lastUpdate: new Date()
        }
    });
    
    Entities.Answers = Backbone.Collection.extend({
        model: Entities.Answer,
        comparator: function (model) {
            return - (new Date(model.get('lastUpdate')).getTime());
        },
        askID: null,
        url: function () {
            return Lampa.restUrl + '/key/' + Lampa.request('key:entity') + '/ask/' + this.askID + '/answers'
        }
    });
    
    Entities.AnswerApi = Entities.Api.extend({
        newEntity: function () {
            return new Entities.Answer();
        },
        loadEntity: function (id) {
            Lampa.trigger('progressBar:show');
            var defer = $.Deferred(),
                entity = new Entities.Answer();
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
            entity.set('answerID', id);
            entity.fetch(args).done(function () {
                Lampa.trigger('progressBar:hide');
            });
            return defer;
        },
        loadEntities: function (askID, params) {
            Lampa.trigger('progressBar:show');
            var defer = $.Deferred(),
                entities = new Entities.Answers(),
                args = {
                    error: function () {
                        Lampa.trigger('error', this);
                    },
                    success: function () {
                        defer.resolve(entities);
                    }
                };
            if (params)
                args.data = $.param(params);
            entities.askID = askID;
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
        }
    });
    
    var AnswerApi = new Entities.AnswerApi();
    
    Lampa.reqres.setHandler('answer:entities', function (askID, params) {
        return AnswerApi.loadEntities(askID, params);
    });
    
    Lampa.reqres.setHandler('answer:entity', function (id) {
        if (id)
            return AnswerApi.loadEntity(null, id);
        return AnswerApi.newEntity();
    });
    
    Lampa.reqres.setHandler('answer:new', function () {
        return AnswerApi.newEntity();
    });
    
    Lampa.reqres.setHandler('answer:save', function (model) {
        return AnswerApi.saveEntity(model);
    });

    Lampa.reqres.setHandler('answer:destroy', function (model) {
        if (model)
            return AnswerApi.destroyEntity(model);
        return null;
    });
});












