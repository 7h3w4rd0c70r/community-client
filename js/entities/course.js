/**
 * Created by Roman on 28.7.14.
 */

Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Course = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity");
            return (this.get("courseID")) ? Lampa.restUrl + "/key/" + key + "/course/" + this.get("courseID") : Lampa.restUrl + "/key/" + key + "/course";
        },
        idAttribute: "courseID",

        defaults: {
            courseID: null,
            schoolID: null,
            abbr: "",
            name: "",
            dictionary: 1,
            lessons: 1,
            icon: 1,
            start: null,
            end: null,
            description: "",
            isSelected: false
        }
    });

    Entities.Courses = Backbone.Collection.extend({
        model: Entities.Course,
        comparator: "abbr",
        loaded: false,
        url: function () {
            return Lampa.restUrl + "/key/" + Lampa.request("key:entity") + "/courses";
        }
    });

    Entities.CourseApi = Entities.Api.extend({
        search: "",
        entities: null,
        getNewEntities: function () {
            return new Entities.Courses();
        },
        getNewEntity: function () {
            var model = new Entities.Course();
            model.set("start", Lampa.request("helper:getTodayDate"));
            return model;
        },
        saveEntity: function (model) {
            var defer = new $.Deferred();
            Lampa.trigger("progressBar:show");

            model.save(null, {
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    Lampa.trigger("error", this);
                },
                success: function (savedModel) {
                    try {
                        Lampa.trigger("progressBar:hide");
                        api.entities = null;
                        defer.resolve(savedModel);
                    }
                    catch (ex) {
                        console.log(ex.message);
                    }
                }
            });
            return defer;
        },
        deleteEntity: function (model) {
            var message = "Delete course " + model.get("name") + "\"\n" + "Are you sure?";

            if (confirm(message) === true) {
                Lampa.trigger("progressBar:show");
                model.destroy({
                    error: function () {
                        Lampa.trigger("progressBar:hide");
                        Lampa.trigger("error", this);
                    },
                    success: function () {
                        Lampa.trigger("progressBar:hide");
                        window.history.back();
                    }
                });
            }
        },
        loadEntity: function (id) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            var entity = new Entities.Course();

            entity.set("courseID", id);

            entity.fetch({
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    console.log("fetch error!");
                },
                success: function () {
                    Lampa.trigger("progressBar:hide");
                    defer.resolve(entity);
                }
            });
            return defer;
        },
        getList: function (selectedId) {
            if (selectedId === null) {
                return this.getEntities();
            }
            var defer = $.Deferred();
            $.when(this.loadEntities()).done(function (collection) {
                _.each(collection, function (model) {
                    if (model.id === selectedId) {
                        model.set("isSelected", true);
                    }
                });
                defer.resolve(collection);
            });
            return defer;
        }
    });

    var api = new Entities.CourseApi();

    Lampa.reqres.setHandler("course:entities", function () {
        return api.loadEntities();
    });

    Lampa.reqres.setHandler("course:list", function (selectedId) {
        return api.getList(selectedId);
    });

    Lampa.reqres.setHandler("course:entities", function () {
        return api.loadEntities();
    });

    Lampa.reqres.setHandler("courses:refresh", function () {
        api.cleanEntities();
        return api.fetchEntities();
    });

    Lampa.reqres.setHandler("course:entity", function (id) {
        return api.loadEntity(id);
    });

    Lampa.reqres.setHandler("course:cached", function (id) {
        return api.getCachedEntity(id);
    });

    Lampa.reqres.setHandler("course:new", function () {
        return api.getNewEntity();
    });

    Lampa.reqres.setHandler("course:empty", function () {
        var empty = api.getNewEntity();
        empty.set("name", "select -");
        return empty;
    });

    Lampa.reqres.setHandler("course:save", function (model) {
        return api.saveEntity(model);
    });

    Lampa.reqres.setHandler("course:delete", function (model) {
        return api.deleteEntity(model);
    });

    Lampa.on("courses:clear", function () {
        return api.cleanEntities();
    });
});