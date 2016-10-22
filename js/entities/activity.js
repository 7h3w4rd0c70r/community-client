/**
 * Created by Roman on 23.5.14.
 */
/**
 * Created by Roman on 23.5.14.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Activity = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity");
            var link = Lampa.restUrl.concat("/key/", key, "/activity");
            return this.get("activityID") ? link + "/" + this.get("activityID") : link;
        },
        idAttribute: "activityID",
        defaults: {
            activityID: null,
            created: null,
            createdBy: 0,
            status: 0,
            activityType: 0,
            title: "",
            duration: 0,
            durationMax: 0,
            source: "",
            tags: "",
            skills: 0,
            isRepeatable: true,
            checked: false,
            checkedBy: 0,
            instructions: "",
            materials: "",
            preparation: "",
            resource: ""
        }
    });

    Entities.Activities = Backbone.Collection.extend({
        model: Entities.Activity,
        query: null,
        comparator: "activityID",
        offset: 0,
        limit: 1000,
        keyword: "",
        duration: 0,
        condition: "bigger",
        url: function () {
            var key = Lampa.request("key:entity");

            var params = "";
            if (this.keyword) {
                params += "&keyword=" + this.keyword;
            }

            if (this.duration && this.condition) {
                params += "&duration=" + this.duration;
                params += "&condition=" + this.condition;
            }

            var url = Lampa.restUrl + "/key/" + key + "/activities";
            if (params !== "") {
                url += "?" + params.substr(1);
            }
            return url;
        }
    });

    Entities.ActivityVote = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity");
            return (this.get("activityID")) ? Lampa.restUrl + "/key/" + key + "/activity/" +this.get("activityID") + "/vote" : "";
        },
        defaults: {
            voted: false
        }
    });

    Entities.ActivitiesApi = Entities.Api.extend({
        search: "",
        entities: null,
        duration: 0,
        condition: "bigger",
        loadEntities: function () {
            if (!this.entities) {
                this.entities = new Entities.Activities();
            }
            return this.entities;
        },
        getNewEntity: function () {
            return new Entities.Activity();
        },
        searchActivities: function (collection, limit, keyword, duration, condition) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            try {
                var entities = collection ? collection : this.getEntities();
                entities.keyword = keyword || "";
                entities.limit = limit || null;
                entities.condition = condition || "bigger";
                entities.duration = duration || 0;
                entities.fetch({
                    error: function (data, error, errorObject) {
                        defer.resolve(data);
                        Lampa.trigger("progressBar:hide");
                        console.log("error", errorObject);
                    },
                    success: function (data) {
                        Lampa.trigger("progressBar:hide");
                        defer.resolve(data);
                    }
                });
            } catch (ex) {
                console.log(ex.message);
            }
            return defer;
        },
        deleteEntity: function (activity) {
            var message = "Delete Activity " + activity.get("title") + "\"\n" + "Are you sure?";

            if (confirm(message) === true) {
                Lampa.trigger("progressBar:show");
                activity.destroy({
                    error: function () {
                        Lampa.trigger("error", this);
                    },
                    success: function () {
                        window.history.back();
                    }
                });
                Lampa.trigger("progressBar:hide");
            }
        },
        loadEntity: function (id) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            try {
                var entity = new Entities.Activity();
                entity.set("activityID", id);
                entity.fetch({
                    error: function () {
                        Lampa.trigger("progressBar:hide");
                        console.log("activity.fetch error!");
                    },
                    success: function () {
                        Lampa.trigger("progressBar:hide");
                        defer.resolve(entity);
                    }
                });
            } catch (ex) {
                console.log(ex.message);
            }
            return defer;
        },
        getVote: function (id) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            try {
                var entity = new Entities.ActivityVote();
                entity.set("activityID", id);
                entity.fetch({
                    error: function () {
                        Lampa.trigger("progressBar:hide");
                        console.log("activity.fetch error!");
                    },
                    success: function () {
                        Lampa.trigger("progressBar:hide");
                        defer.resolve(entity);
                    }
                });
            } catch (ex) {
                console.log(ex.message);
            }
            return defer;
        },
        saveVote: function (model) {
            var defer = new $.Deferred();
            model.save(null, {
                error: function () {
                    console.log("saveVote error!");
                    defer.resolve(model);
                },
                success: function () {
                    defer.resolve(model);
                }
            });
            return defer;
        },
        clipboard: [],
        getCountOfItemsInClipboard: function () {
            return this.clipboard.length;
        },
        pushEntityToClipboard: function (model) {
            var i = 0;
            var length = this.clipboard.length;
            for (i; i < length; i++) {
                if (this.clipboard[i].id === model.id) {
                    return;
                }
            }

            this.clipboard.push(model);
        },
        pasteEntityFromClipboard: function () {
            return this.clipboard.pop();
        },
        getClipboard: function () {
            return this.clipboard;
        },
        cleanClipboard: function () {
            this.clipboard = [];
        }
    });

    var api = new Entities.ActivitiesApi();
    Lampa.reqres.setHandler("activity:entities", function () {
        return api.loadEntities();
    });

    Lampa.reqres.setHandler("activity:clear", function () {
        return api.logout();
    });

    Lampa.reqres.setHandler("activity:search", function (collection, keyword, duration, condition) {
        return api.searchActivities(collection, 1000, keyword, duration, condition);
    });

    Lampa.reqres.setHandler("activity:new", function () {
        return api.getNewEntity();
    });

    Lampa.reqres.setHandler("activity:entity", function (id) {
        return api.loadEntity(id);
    });

    Lampa.reqres.setHandler("activity:save", function (activity) {
        return api.saveEntity(activity);
    });

    Lampa.reqres.setHandler("activity:delete", function (activity) {
        return api.deleteEntity(activity);
    });

    Lampa.reqres.setHandler("activity:get:vote", function (id) {
        return api.getVote(id);
    });

    Lampa.reqres.setHandler("activity:save:vote", function (model) {
        return api.saveVote(model);
    });

    Lampa.reqres.setHandler("activity:clipboard:push", function (activity) {
        return api.pushEntityToClipboard(activity);
    });

    Lampa.reqres.setHandler("activity:clipboard:count", function () {
        return api.getCountOfItemsInClipboard();
    });

    Lampa.reqres.setHandler("activity:clipboard:pop", function () {
        return api.pasteEntityFromClipboard();
    });

    Lampa.reqres.setHandler("activity:clipboard:get", function () {
        return api.getClipboard();
    });

    Lampa.reqres.setHandler("activity:clipboard:clean", function () {
        return api.cleanClipboard();
    });
});