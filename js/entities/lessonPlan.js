/**
 * Created by Roman on 8.7.14.
 */

Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.LessonPlan = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity").toString();
            return this.get("planID") ? Lampa.restUrl.concat("/key/", key, "/lesson/", this.get("lessonID").toString(), "/plan/", this.get("planID").toString()) : Lampa.restUrl.concat("/key/", key, "/lesson/", this.get("lessonID").toString() + "/plan");
        },
        idAttribute: "planID",
        defaults: {
            planID: null,
            lessonID: null,
            position: 1,
            name: "",
            description: "",
            duration: 5,
            status: 0,
            activityID: null,
            canPasteActivity: false,
            isEditing: false
        }
    });

    Entities.LessonPlansStatistics = Backbone.Model.extend({
        url: "",
        defaults: {
            totalTime: 0
        }
    });

    Entities.LessonPlans = Backbone.Collection.extend({
        model: Entities.LessonPlan,
        comparator: "position",
        idValue: null,
        doneOnly: false,
        url: function () {
            var link = "/lesson/" + this.idValue + "/plans";
            if (this.doneOnly) {
                link += "/done";
            }
            return Lampa.restUrl + "/key/" + Lampa.request("key:entity") + link;
        },
        defaults: {
            lessonID: null
        }
    });

    Entities.LessonPlansApi = Entities.Api.extend({
        search: "",
        getNewEntity: function () {
            return new Entities.LessonPlan();
        },
        getNewEntities: function (idValue, doneOnly) {
            var entities = new Entities.LessonPlans();
            entities.idValue = idValue;
            entities.doneOnly = doneOnly;
            return entities;
        },
        entitiesCopy: null,
        getEntitiesCopy: function () {
            if (!this.entitiesCopy) {
                this.entitiesCopy = new Entities.LessonPlans();
            }
            return this.entitiesCopy;
        },
        setEntitiesCopy: function () {
            var sourceCollection = this.getLastEntities();

            if (!this.entitiesCopy) {
                this.entitiesCopy = new Entities.LessonPlans();
            } else {
                this.entitiesCopy.reset();
            }

            var parent = this;

            sourceCollection.each(function (sourceEntity) {
                var entityCopy = new Entities.LessonPlan();
                entityCopy.set("name", sourceEntity.get("name"));
                entityCopy.set("description", sourceEntity.get("description"));
                entityCopy.set("duration", sourceEntity.get("duration"));
                entityCopy.set("status", sourceEntity.get("status"));
                entityCopy.set("activityID", sourceEntity.get("activityID"));
                parent.entitiesCopy.add(entityCopy);
            });
        },
        getMaxItemPosition: function () {
            var collection = this.getEntities();
            var maximum = 0;
            var i = 0;
            var length = collection.length;
            for (i; i < length; i++) {
                if (collection[i]) {
                    if (collection[i].get("position") > maximum) {
                        maximum = collection[i];
                    }
                }
            }
            return maximum;
        },
        pasteEntitiesCopy: function (clearFirst, onlyNotDoneActivities) {
            try {
                var currentLessonId = Lampa.request("lesson:current:entity").get("lessonID");
                var sourceCollection = this.getEntitiesCopy();
                var destinationCollection = this.getEntities();

                if (clearFirst) {
                    destinationCollection.each(function (plan) {
                        plan.destroy();
                    });
                }

                var position = this.getMaxItemPosition() + 1;

                sourceCollection.each(function (sourceEntity) {
                    if ((onlyNotDoneActivities && sourceEntity.get("status") === 0) || !onlyNotDoneActivities) {
                        var entityCopy = new Entities.LessonPlan();
                        entityCopy.set("position", position++);
                        entityCopy.set("lessonID", currentLessonId);
                        entityCopy.set("name", sourceEntity.get("name"));
                        entityCopy.set("description", sourceEntity.get("description"));
                        entityCopy.set("duration", sourceEntity.get("duration"));
                        entityCopy.set("activityID", sourceEntity.get("activityID"));
                        destinationCollection.add(entityCopy);
                    }
                });
                this.reorganizeEntities();
                this.saveEntities(currentLessonId);
                this.entitiesCopy.reset();
            } catch (ex) {
                console.log("error", ex.message);
            }
        },
        reorganizeEntities: function () {
            var collection = this.getEntities();
            if (collection.length > 0) {
                _.each(collection.models, function (model, index) {
                    model.set("position", index);
                });
            }
        },
        getEntityPosition: function (model) {
            if (!model) {
                return null;
            }
            try {
                var collection = this.getEntities();
                var i = 0;
                var length = collection.length;
                for (i; i < length; i++) {
                    if (collection.models[i].cid === model.cid) {
                        return i;
                    }
                }
            } catch (ex) {
                console.log(ex.message);
            }
            return null;
        },
        getEntityBefore: function (model) {
            try {
                if (model) {
                    var collection = this.getEntities();
                    var position = this.getEntityPosition(model);
                    return collection.at(position - 1);
                }
            } catch (ex) {
                console.log(ex.message);
            }
            return null;
        },
        getEntityAfter: function (model) {
            try {
                if (model) {
                    var collection = this.getEntities();
                    var position = this.getEntityPosition(model);
                    return collection.at(position + 1);
                }
            } catch (ex) {
                console.log(ex.message);
            }
            return null;
        },
        saveEntities: function (lessonID) {
            try {
                var collection = this.getEntities();
                if (collection.length > 0) {
                    collection.each(function (model) {
                        model.set("lessonID", lessonID);
                        model.save(null, {
                            error: function () {
                                console.log("error", message);
                            }
                        });
                    });
                }
            } catch (ex) {
                console.log("error", ex.message);
            }
        },
        saveEntity: function (model) {
            var defer = new $.Deferred();
            model.save(null, {
                error: function () {
                    Lampa.trigger("error", this);
                    defer.resolve(false);
                },
                success: function (data) {
                    Lampa.request("lesson:change:status", data.get("lessonID"));
                    defer.resolve(data);
                }
            });
            return defer;
        },
        addToCollection: function (model) {
            try {
                var collection = this.getEntities();
                model.set("position", collection.length * 10);
                collection.add(model);
                this.reorganizeEntities();
            } catch (ex) {
                console.log(ex.message);
            }
        },
        deleteEntity: function (model) {
            var message = "Delete Lesson ".concat(model.get("name"), "\nAre you sure?");
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
            var defer = new $.Deferred();
            Lampa.trigger("progressBar:show");
            var entity = new Entities.LessonPlan();
            entity.set("planID", id);
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
        getStatisticalModel: function () {
            return new Entities.LessonPlansStatistics();
        }
    });

    var api = new Entities.LessonPlansApi();

    Lampa.reqres.setHandler("lesson:plans", function (lessonId) {
        return api.loadEntities(lessonId);
    });

    Lampa.reqres.setHandler("lesson:plans:done", function (lessonId) {
        return api.fetchEntities(lessonId, true);
    });

    Lampa.reqres.setHandler("lesson:plans:copy", function () {
        return api.getEntitiesCopy();
    });

    Lampa.reqres.setHandler("lesson:plan:statistics", function () {
        return api.getStatisticalModel();
    });

    Lampa.reqres.setHandler("lesson:plan:entities", function () {
        return api.loadEntities();
    });

    Lampa.reqres.setHandler("lesson:plan:new-item", function (lessonID) {
        var entity = new Entities.LessonPlan();
        entity.set("lessonID", lessonID);
        return entity;
    });

    Lampa.reqres.setHandler("lesson:plan:add", function (model) {
        api.addToCollection(model);
    });

    Lampa.reqres.setHandler("lesson:plan:save", function (lessonID) {
        return api.saveEntities(lessonID);
    });

    Lampa.reqres.setHandler("plan:entity", function (planID) {
        return api.loadEntity(planID);
    });

    Lampa.reqres.setHandler("plan:new", function () {
        return api.getNewEntity();
    });

    Lampa.reqres.setHandler("plans:save", function () {
        return api.saveEntities();
    });

    Lampa.reqres.setHandler("plan:save", function (model) {
        return api.saveEntity(model);
    });

    Lampa.on("plans:copy", function () {
        return api.setEntitiesCopy();
    });

    Lampa.reqres.setHandler("plans:paste", function (clearFirst, onlyDone) {
        return api.pasteEntitiesCopy(clearFirst, onlyDone);
    });

    Lampa.reqres.setHandler("plan:delete", function (model) {
        return api.deleteEntity(model);
    });

    Lampa.reqres.setHandler("plan:up", function (item) {
        try {
            var collection = api.getEntities();
            var itemBefore = api.getEntityBefore(item);

            if (itemBefore !== undefined) {
                var a = itemBefore.get("position");
                var b = item.get("position");

                item.set("position", a);
                itemBefore.set("position", b);
                collection.sort();
                item.save();
                itemBefore.save();
            }

        } catch (ex) {
            console.log(ex.message);
        }
    });

    Lampa.reqres.setHandler("plan:down", function (item) {
        try {
            var collection = api.getEntities();
            var itemAfter = api.getEntityAfter(item);

            if (itemAfter !== null) {
                var a = itemAfter.get("position");
                var b = item.get("position");
                item.set("position", a);
                itemAfter.set("position", b);
                collection.sort();
                item.save();
                itemAfter.save();
            }
        } catch (ex) {
            console.log(ex.message);
        }
    });
});