/**
 * Created by Roman on 28.7.14.
 */

Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Access = Backbone.Model.extend({
        idAttribute: "accessID",
        url: function () {
            var link = Lampa.restUrl.concat("/key/", Lampa.request("key:entity"), "/access/");
            link += this.get("accountID") === null ? "active" : this.get("accessID");
            return link;
        },
        defaults: {
            accountID: null,
            accessID: null,
            schoolName: null,
            type: null,
            inUse: null
        }
    });

    Entities.Accesses = Backbone.Collection.extend({
        model: Entities.Access,
        type: null,
        accountID: null,
        comparator: function () {
            return {
                "sort": [
                    {
                        "field": "school",
                        "order": "asc"
                    },
                    {
                        "field": "type",
                        "order": "asc"
                    }
                ]
            };
        },
        url: function () {
            return Lampa.restUrl + "/key/" + Lampa.request("key:entity") + "/accesses";
        }
    });

    Entities.AccessesApi = Entities.Api.extend({
        idAttribute: "accessID",
        entityName: "Access",
        getNewEntity: function () {
            return new Entities.Access();
        },
        getNewEntities: function () {
            return new Entities.Accesses();
        },
        studentEntities: null,
        getStudentEntities: function (id) {
            if (!this.studentEntities || this.studentEntities.accountID != id) {
                var entities = new Entities.Accesses();
                entities.accountID = id;
                entities.type = "student";

                this.studentEntities = entities;
            }
            return this.studentEntities;
        },
        loadStudentEntities: function (id) {
            var defer = new $.Deferred();
            Lampa.trigger("progressBar:show");
            var entities = this.getStudentEntities(id);
            entities.fetch(
                {
                    error: function () {
                        Lampa.trigger("progressBar:hide");
                        console.log("fetch error!");
                    },
                    success: function () {
                        Lampa.trigger("progressBar:hide");
                        defer.resolve(entities);
                    }
                }
            );
            return defer;
        },
        getActiveEntity: function () {
            var defer = new $.Deferred();
            Lampa.trigger("progressBar:show");
            var entity = new Entities.Access();
            var _this = this;
            entity.fetch(
                {
                    error: function () {
                        Lampa.trigger("progressBar:hide");
                        console.log("fetch error!");
                    },
                    success: function (data) {
                        Lampa.trigger("progressBar:hide");
                        defer.resolve(data);
                        _this.setActive(data);
                    }
                }
            );
            return defer;
        },
        getCurrentEntityRole: function () {
            try {
                var i;
                var entity;
                var entities = this.getEntities();
                if (entities) {
                    for (i = 0; i <= entities.length; i++) {
                        entity = entities.models[i];
                        if (entity.get("inUse") === 1) {
                            return entity.get("type");
                        }
                    }
                }
            } catch (ex) {
                Lampa.error(ex);
            }
            return "";
        },
        setActive: function (model) {
            Lampa.trigger("locations:clear");
            Lampa.trigger("groups:clear");
            Lampa.trigger("teachers:clear");
            Lampa.trigger("students:clear");
            Lampa.trigger("school:clear");

            var entities = this.getEntities();
            entities.each(function (entity) {
                entity.set("inUse", (model.get("accessID") === entity.get("accessID")) ? 1 : 0);
            });
            Lampa.request("user:role:set", model.get("type"));
            Lampa.trigger("header:show");
        },
        setEntity: function (model) {
            var defer = new $.Deferred();
            Lampa.trigger("progressBar:show");
            this.setActive(model);
            model.save(null, {
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    console.log("error!");
                },
                success: function (data) {
                    Lampa.trigger("progressBar:hide");
                    defer.resolve(data);
                    Lampa.request("menu:entities");
                }
            });
            return defer;
        },
        deleteEntity: function (model) {
            var message = "Remove Student from Group?" + "\"\n" +
                "You can delete student only from unattended lessons." + '"\n' +
                "Are you sure?";

            if (confirm(message) === true) {
                Lampa.trigger("progressBar:show");
                model.destroy({
                    error: function () {
                        Lampa.trigger("progressBar:hide");
                        console.log("error!");
                    },
                    success: function () {
                        Lampa.trigger("progressBar:hide");
                    }
                });
            }
        }
    });

    var api = new Entities.AccessesApi();

    Lampa.reqres.setHandler("access:entities", function () {
        return api.loadEntities();
    });

    Lampa.reqres.setHandler("access:entities:fresh", function () {
        return api.fetchEntities();
    });

    Lampa.reqres.setHandler("access:entity", function (id) {
        return api.loadEntity(id);
    });

    Lampa.reqres.setHandler("access:add", function (model) {
        return api.saveEntity(model);
    });

    Lampa.reqres.setHandler("access:delete", function (model) {
        return api.deleteEntity(model);
    });

    Lampa.reqres.setHandler("access:student", function (id) {
        return api.getStudentEntities(id);
    });

    Lampa.reqres.setHandler("access:student:load", function (id) {
        return api.loadStudentEntities(id);
    });

    Lampa.reqres.setHandler("access:get-active", function () {
        return api.getActiveEntity();
    });

    Lampa.reqres.setHandler("access:group:new-item", function () {
        return api.getNewEntity();
    });

    Lampa.reqres.setHandler("access:get:role", function () {
        return api.getCurrentEntityRole();
    });

    Lampa.reqres.setHandler("access:set:active", function (accessID) {
        return api.setEntity(accessID);
    });

    Lampa.on("access:set-active", function (access) {
        api.setEntity(access);
    });
});