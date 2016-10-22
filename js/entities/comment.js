Lampa.module('Entities', function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Comment = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request('key:entity');
            return (this.get('commentID') === null)
                ? Lampa.restUrl + '/key/' + key + '/comment'
                : Lampa.restUrl + '/key/' + key + '/comment/' + this.get('commentID')
        },
        initialize: function () {
            this.options = {
                page: 1,
                order: ''
            };
            this.set('authorName', '');
        },
        idAttribute: 'commentID',
        defaults: {
            commentID: null,
            answerID: null,
            authorID: null,
            content: '',
            timeStamp: new Date(),
            votes: 0,
            lastUpdate: new Date()
        }
    });
    
    Entities.Comments = Backbone.Collection.extend({
        model: Entities.Comment,
        comparator: function (model) {
            return - (new Date(model.get('lastUpdate')).getTime());
        },
        answerID: null,
        url: function () {
            return Lampa.restUrl + '/key/' + Lampa.request('key:entity') + '/answer/' + this.answerID + '/comments'
        }
    });
    
    Entities.CommentApi = Entities.Api.extend({
        newEntity: function () {
            return new Entities.Comment();
        },
        loadEntity: function (id) {
            Lampa.trigger('progressBar:show');
            var defer = $.Deferred(),
                entity = new Entities.Comment();
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
            entity.set('commentID', id);
            entity.fetch(args).done(function () {
                Lampa.trigger('progressBar:hide');
            });
            return defer;
        },
        loadEntities: function (answerID, params) {
            Lampa.trigger('progressBar:show');
            var defer = $.Deferred(),
                entities = new Entities.Comments(),
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
            entities.answerID = answerID;
            entities.fetch(args).done(function () {
                Lampa.trigger('progressBar:hide');
            });
            return defer;
        },
        saveEntity: function (model) {
            Lampa.trigger('progressBar:show');
            var defer = $.Deferred(),
                args = {
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

    var CommentApi = new Entities.CommentApi();

    Lampa.reqres.setHandler('comment:entities', function (askID, params) {
        return CommentApi.loadEntities(askID, params);
    });
    
    Lampa.reqres.setHandler('comment:entity', function (id) {
        if (id)
            return CommentApi.loadEntity(id);
        return CommentApi.newEntity();
    });
    
    Lampa.reqres.setHandler('comment:new', function () {
        return CommentApi.newEntity();
    });
    
    Lampa.reqres.setHandler('comment:save', function (model) {
        return CommentApi.saveEntity(model);
    });

    Lampa.reqres.setHandler('comment:destroy', function (model) {
        if (model)
            return CommentApi.destroyEntity(model);
        return null;
    });
});