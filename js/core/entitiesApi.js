/**
 * Created by Roman on 28.1.15.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Api = Marionette.Object.extend({
        entities: null,
        getNewEntities: function () {
            return new Backbone.Collection();
        },
        cleanEntities: function () {
            this.entities = null;
        },
        getEntities: function () {
            return this.entities;
        },
        setEntities: function (collection) {
            this.entities = collection;
        },
        reset: function () {
            this.entities = null;
        },
        entity: null,
        getEntity: function () {
            return this.entity;
        },
        setEntity: function (model) {
            this.entity = model;
        },
        clear: function () {
            this.entity = null;
        },
        entityName: "item",
        getNewEntity: function () {
            return new Backbone.Model();
        },
        getLastEntity: function () {
            return this.entity ? this.entity : this.getNewEntity();
        },
        getLastEntities: function () {
            return this.entities ? this.entities : this.getNewEntities();
        },
        loadEntity: function (idValue) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            this.entity = this.getNewEntity();

            if (idValue) {
                this.entity.set(this.entity.idAttribute, idValue);
            }
            this.entity.fetch({
                error: function () {
                    Lampa.trigger("progressBar:hide");
                },
                success: function (data) {
                    Lampa.trigger("progressBar:hide");
                    defer.resolve(data);
                }
            });
            return defer;
        },
        loadEntities: function (idValue, atribute) {
            Lampa.trigger("progressBar:show");
            var _this = this;
            var defer = new $.Deferred();
            if (this.entities && this.entities.idValue === idValue) {
                Lampa.trigger("progressBar:hide");
                defer.resolve(this.entities);
            } else {
                this.entities = this.getNewEntities(idValue, atribute);
                this.entities.fetch({
                    error: function (data, error) {
                        Lampa.trigger("progressBar:hide");
                        console.log("Entity fetch error:", error.responseText);
                    },
                    success: function (data) {
                        Lampa.trigger("progressBar:hide");
                        _this.setEntities(data);
                        defer.resolve(data);
                    }
                });
            }
            return defer;
        },
        fetchEntities: function (idValue, atribute) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            var entities = this.getNewEntities(idValue, atribute);
            entities.fetch({
                error: function (data, error) {
                    Lampa.trigger("progressBar:hide");
                    console.log("Entity fetch error:", error.responseText);
                },
                success: function (data) {
                    Lampa.trigger("progressBar:hide");
                    defer.resolve(data);
                }
            });

            return defer;
        },
        getCachedEntity: function (idValue) {
            var collection = this.getEntities();
            var entity;
            if (collection) {
                entity = collection.get(idValue);
            }
            return entity ? entity : this.loadEntity(idValue);
        },
        saveEntity: function (model) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            try {
                model.save(null, {
                    error: function (data, error) {
                        Lampa.trigger("progressBar:hide");
                        console.log("Entity save error:", error.responseText);
                    },
                    success: function (data) {
                        Lampa.trigger("progressBar:hide");
                        defer.resolve(data);
                    }
                });
            } catch (ex) {
                defer.resolve(false);
                console.log(ex, "exception: empty model save");
            }
            return defer;
        },
        saveEntitySilently: function (model) {
            var defer = new $.Deferred();
            try {
                model.save(null, {
                    error: function (data, error) {
                        console.log("Entity save error:", error.responseText);
                        defer.resolve(model);
                    },
                    success: function (data) {
                        defer.resolve(data);
                    }
                });
            } catch (ex) {
                defer.resolve(false);
                console.log("exception: empty model save");
            }
            return defer;
        },
        getDeleteMessage: function (model) {
            return "Delete "+ this.entityName + " " + model.get("name") + "\"\n" + "Are you sure?";
        },
        deleteEntity: function (model) {
            var message = this.getDeleteMessage(model);
            if (confirm(message) === true) {
                Lampa.trigger("progressBar:show");
                model.destroy({
                    error: function (data, error) {
                        Lampa.trigger("progressBar:hide");
                        console.log("Entity destroy error:", error.responseText)
                    },
                    success: function () {
                        Lampa.trigger("progressBar:hide");
                        window.history.back();
                    }
                });
            }
        },
        deleteModel: function (model) {
            var defer;
            if (model) {
                defer = new $.Deferred();
                model.destroy({
                    error: function (data, error) {
                        Lampa.error(data, error);
                        defer.resolve(data);
                    },
                    success: function (data) {
                        defer.resolve(data);
                    }
                });
            } else {
                defer.resolve(model);
            }
            return defer;
        }
    });
});