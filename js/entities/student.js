/**
 * Created by Roman on 8.9.14.
 */

Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Student = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity");
            return this.get("personID")
                ? Lampa.restUrl + "/key/" + key + "/student/" + this.get("personID")
                : Lampa.restUrl + "/key/" + key + "/student";
        },
        idAttribute: "personID",
        defaults: {
            personID: null,
            fullName: null,
            firstName: null,
            lastName: null,
            email: null
        }
    });

    Entities.Students = Backbone.Collection.extend({
        model: Entities.Student,
        comparator: "lastName",
        keyword: null,
        limit: null,
        url: function () {
            var key = Lampa.request("key:entity");

            var params = "";
            if (this.keyword !== null) {
                params += "&keyword=" + this.keyword;
            }
            if (this.limit !== null) {
                params += "&limit=" + this.limit;
            }
            var url = Lampa.restUrl + "/key/" + key + "/students";
            if (params !== "") {
                url += "?" + params.substr(1);
            }
            return url;
        }
    });

    Entities.StudentGroup = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity");
            return (this.get("groupPersonID") === null)
                ? Lampa.restUrl + "/key/" + key + "/group-person "
                : Lampa.restUrl + "/key/" + key + "/group-person/" + this.get("groupPersonID");
        },
        idAttribute: "groupPersonID",
        defaults: {
            groupPersonID: null,
            groupID: null,
            personID: null,
            start: null,
            end: null,
            abbr: null,
            name: null
        }
    });

    Entities.StudentGroups = Backbone.Collection.extend({
        model: Entities.StudentGroup,
        comparator: "fullName",
        idAttribute: "groupPersonID",
        personID: null,
        url: function () {
            var key = Lampa.request("key:entity");
            return Lampa.restUrl + "/key/" + key + "/student/" + this.personID + "/groups";
        }
    });

    Entities.StudentLesson = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity");
            return (this.get("lessonID") === null) ? "" : Lampa.restUrl + "/key/" + key + "/lesson/" + this.get("lessonID");
        },
        idAttribute: "lessonID",
        defaults: {
            givenID: null,
            lessonID: null,
            start: null,
            end: null,
            courseID: null,
            name: "",
            locationID: null,
            status: null,
            teachers: []
        }
    });

    Entities.StudentLessons = Backbone.Collection.extend({
        model: Entities.StudentLesson,
        comparator: "start",
        personID: null,
        url: function () {
            var key = Lampa.request("key:entity");
            return Lampa.restUrl + "/key/" + key + "/student/" + this.personID + "/lessons";
        }
    });

    Entities.StudentsApi = Entities.Api.extend({
        search: "",
        getNewEntities: function () {
            return new Entities.Students();
        },
        loadEntities: function (collection) {
            var defer = new $.Deferred();
            var entities = collection ? collection : this.getNewEntities();
            Lampa.trigger("progressBar:show");

            entities.fetch({
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    Lampa.trigger("error", this);
                },
                success: function () {
                    Lampa.trigger("progressBar:hide");
                    defer.resolve(entities);
                }
            });

            return defer;
        },
        getStudentGroupsEntities: function (id) {
            var defer = new $.Deferred();

            var entities = new Entities.StudentGroups();
            entities.personID = id;

            Lampa.trigger("progressBar:show");

            entities.fetch({
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    Lampa.trigger("error", this);
                },
                success: function () {
                    Lampa.trigger("progressBar:hide");
                    defer.resolve(entities);
                }
            });
            return defer;
        },
        getNewStudentGroupEntity: function (personID) {
            return new Entities.StudentGroup({"personID": personID});
        },
        getEmptyEntity: function () {
            return new Entities.Student();
        },
        getNewEntity: function () {
            return new Entities.Student();
        },
        deleteEntity: function (model) {
            var message = "Delete student \"" + model.get('fullName') + '"\n' + 'Are you sure?';

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
            var entity = this.getEmptyEntity();
            entity.set("personID", id);
            entity.fetch({
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    console.log('fetch error!');
                },
                success: function () {
                    Lampa.trigger("progressBar:hide");
                    defer.resolve(entity);
                }
            });
            return defer;
        },
        getLessons: function (personID) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            var entities = new Entities.StudentLessons();
            entities.personID = personID;
            entities.fetch({
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    console.log("fetch error!");
                },
                success: function (data) {
                    Lampa.trigger("progressBar:hide");
                    defer.resolve(data);
                }
            });
            return defer;
        },
        searchEntities: function (collection, keyword, limit) {
            collection = collection || this.getNewEntities();
            collection.keyword = keyword || null;
            collection.limit = limit || null;
            return this.loadEntities(collection);
        }
    });

    var api = new Entities.StudentsApi();
    Lampa.reqres.setHandler("student:entities", function () {
        return api.loadEntities();
    });

    Lampa.reqres.setHandler("students:refresh", function () {
        api.cleanEntities();
        return api.fetchEntities();
    });

    Lampa.reqres.setHandler("student:entity", function (id) {
        return api.loadEntity(id);
    });

    Lampa.reqres.setHandler("student:new", function () {
        return api.getNewEntity();
    });

    Lampa.reqres.setHandler("student:save", function (model) {
        return api.saveEntity(model);
    });

    Lampa.reqres.setHandler("student:search", function (collection, keyword, limit) {
        return api.searchEntities(collection, keyword, limit);
    });

    Lampa.reqres.setHandler("student:delete", function (model) {
        return api.deleteEntity(model);
    });

    Lampa.reqres.setHandler("student:groups", function (id) {
        return api.getStudentGroupsEntities(id);
    });

    Lampa.reqres.setHandler("student:lessons", function (personID) {
        return api.getLessons(personID);
    });

    Lampa.reqres.setHandler("student:group", function (personID) {
        return api.getNewStudentGroupEntity(personID);
    });

    Lampa.reqres.setHandler("student:empty", function () {
        var empty = api.getNewEntity();
        empty.set("fullName", "");
        empty.set("email");
        return empty;
    });

    Lampa.on("students:clear", function () {
        return api.cleanEntities();
    });
});
