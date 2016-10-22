/**
 * Created by Roman on 24.7.14.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Location = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity");
            if (this.get('locationID') === null) {
                return Lampa.restUrl + "/key/" + key + "/location";
            }
            return Lampa.restUrl + "/key/" + key + "/location/" + this.id;
        },
        idAttribute: "locationID",
        defaults: {
            locationID: null,
            schoolID: null,
            icon: 1,
            abbr: '',
            name: '',
            capacity: 1,
            start: null,
            end: null,
            description: '',
            isSelected: false
        },
        validate: function (attrs, options) {
            if (attrs.abbr == '') {
                return "Abbr can't by empty";
            }

            if (attrs.name == '') {
                return "Location name can't by empty";
            }
        }
    });

    Entities.Locations = Backbone.Collection.extend({
        model: Entities.Location,
        comparator: "abbr",
        url: function () {
            var key = Lampa.request("key:entity");
            return Lampa.restUrl + "/key/" + key + '/locations'
        }
    });

    Entities.LocationLesson = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity");
            return (this.get('lessonID') === null) ? '' : Lampa.restUrl + "/key/" + key + "/lesson/" + this.get('lessonID');
        },
        idAttribute: "lessonID",
        defaults: {
            givenID: null,
            lessonID: null,
            start: null,
            end: null,
            courseID: null,
            name: '',
            locationID: null,
            status: null,
            teachers: []
        }
    });

    Entities.LocationLessons = Backbone.Collection.extend({
        model: Entities.LocationLesson,
        comparator: "start",
        idValue: null,
        url: function () {
            var key = Lampa.request("key:entity");
            return Lampa.restUrl + "/key/" + key + "/location/" + this.idValue + "/lessons";
        }
    });

    Entities.LocationsApi = Entities.Api.extend({
        entityName: 'Location',
        idAttribute: 'locationID',
        getNewEntity: function () {
            return new Entities.Location();
        },
        getNewEntities: function () {
            return new Entities.Locations();
        },
        getLessons: function (locationID) {
            Lampa.trigger("progressBar:show");
            var defer = $.Deferred();
            var entities = new Entities.LocationLessons();
            if (locationID === null) {
                Lampa.trigger("progressBar:hide");
                defer.resolve(entities);
            } else {
                entities.idValue = locationID;
                entities.fetch({
                    error: function () {
                        Lampa.trigger("progressBar:hide");
                        console.log('fetch error!')
                    },
                    success: function (data) {
                        Lampa.trigger("progressBar:hide");
                        defer.resolve(data);
                    }
                });
            }
            return defer;
        }
    });

    var api = new Entities.LocationsApi();

    Lampa.reqres.setHandler("location:new", function () {
        return api.getNewEntity();
    });

    Lampa.reqres.setHandler("location:reset", function () {
        return api.reset();
    });

    Lampa.reqres.setHandler("location:empty", function () {
        var empty = api.getNewEntity();
        empty.set('name', '');
        empty.set('abbr', '');
        empty.set('isSelected', true);
        return empty;
    });

    Lampa.reqres.setHandler("location:entity", function (id) {
        return api.loadEntity(id);
    });

    Lampa.reqres.setHandler("location:cached", function (id) {
        return api.getCachedEntity(id);
    });

    Lampa.reqres.setHandler("location:entities", function () {
        return api.loadEntities();
    });

    Lampa.reqres.setHandler("locations:refresh", function () {
        api.cleanEntities();
        return api.fetchEntities();
    });

    Lampa.reqres.setHandler("location:save", function (model) {
        return api.saveEntity(model);
    });

    Lampa.reqres.setHandler("location:delete", function (model) {
        return api.deleteEntity(model);
    });

    Lampa.reqres.setHandler("location:lessons", function (locationID) {
        return api.getLessons(locationID);
    });

    Lampa.on("locations:clear", function () {
        return api.cleanEntities();
    });
});