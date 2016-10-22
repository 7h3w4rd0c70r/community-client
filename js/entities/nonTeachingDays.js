/**
 * Created by Roman on 8.12.14.
 */

/**
 * Created by Roman on 24.7.14.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.NonTeachingDay = Backbone.Model.extend(
        {
            url: function () {
                var key = Lampa.request("key:entity");

                if (this.get('locationID') === null) {
                    return  Lampa.restUrl + "/key/" + key + "/non-teaching-day";
                }
                return Lampa.restUrl + "/key/" + key + "/non-teaching-day/" + this.id;
            },

            idAttribute: "exclusionID",

            defaults: {
                exclusionID: null,
                periodID: null,
                type: '',
                description: '',
                start: null,
                end: null,
                active: 1
            }
        });
    Entities.NonTeachingDays = Backbone.Collection.extend({
        model: Entities.Location,
        comparator: "start",

        url: function () {
            var key = Lampa.request("key:entity");
            return Lampa.restUrl + "/key/" + key + '/non-teaching-days'
        }
    });

    Entities.NonTeachingDaysApi = Entities.Api.extend({

        getNewEntity: function () {
            return new Entities.NonTeachingDay();
        },

        loadEntity: function (id) {
            Lampa.trigger("progressBar:show");
            var defer = $.Deferred();
            var entity = new Entities.Location();
            entity.set('locationID', id);

            entity.fetch({
                    error: function () {
                        console.log('fetch error!');
                        Lampa.trigger("progressBar:hide");
                    },
                    success: function () {
                        Lampa.trigger("progressBar:hide");
                        defer.resolve(entity);
                    }
                }
            );
            return defer;
        },

        loadEntities: function () {
            Lampa.trigger("progressBar:show");
            var defer = $.Deferred();
            var entities = new Entities.Locations();
            entities.fetch({
                    error: function () {
                        Lampa.trigger("progressBar:hide");
                        Lampa.trigger("error", this);
                    },
                    success: function () {
                        Lampa.trigger("progressBar:hide");
                        defer.resolve(entities);
                    }
                }
            );
            return defer;
        },

        saveEntity: function (model) {
            Lampa.trigger("progressBar:show");
            model.save(null, {
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    Lampa.trigger("error", this);
                },
                success: function () {
                    try {
                        Lampa.trigger("progressBar:hide");
                    }
                    catch (ex) {
                        console.log(ex.message);
                    }
                }
            });
        },

        deleteEntity: function (entity) {

            var message = 'Delete Location "' + entity.get('name') + '"\n' + 'Are you sure?';

            if (confirm(message) === true) {
                Lampa.trigger("progressBar:show");
                entity.destroy({
                    error: function () {
                        Lampa.trigger("error", this);
                    },
                    success: function () {
                        window.history.back();
                    }
                });
                Lampa.trigger("progressBar:hide");
            }
        }
    });

    var api = new Entities.NonTeachingDaysApi();

    Lampa.reqres.setHandler("location:add", function () {
        return api.getNewEntity();
    });

    Lampa.reqres.setHandler("non-teaching-day:empty", function () {
        var empty = api.getNewEntity();
        empty.set('name', '--- select ---');
        return empty;
    });

    Lampa.reqres.setHandler("non-teaching-day:entity", function (id) {
        return api.loadEntity(id);
    });

    Lampa.reqres.setHandler("non-teaching-day:entities", function () {
        return api.loadEntities();
    });

    Lampa.reqres.setHandler("non-teaching-day:save", function (model) {
        return api.saveEntity(model);
    });

    Lampa.reqres.setHandler("non-teaching-day:delete", function (model) {
        return api.deleteEntity(model);
    });
});