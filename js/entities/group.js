/**
 * Created by Roman on 28.7.14.
 */

Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Group = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity");
            return (this.get("groupID") === null)
                ? Lampa.restUrl + "/key/" + key + "/group"
                : Lampa.restUrl + "/key/" + key + "/group/" + this.get("groupID");
        },
        idAttribute: "groupID",
        defaults: {
            groupID: null,
            schoolID: null,
            courseID: null,
            abbr: "",
            name: "",
            capacity: 1,
            icon: 1,
            start: null,
            end: null,
            description: "",
            isSelected: false
        }
    });

    Entities.Groups = Backbone.Collection.extend({
        model: Entities.Group,
        comparator: "abbr",
        url: function () {
            var key = Lampa.request("key:entity");
            var params = "";
            if (this.keyword) {
                params += "&keyword=" + this.keyword;
            }
            if (this.limit) {
                params += "&limit=" + this.limit;
            }
            var url = Lampa.restUrl + "/key/" + key + "/groups";
            if (params !== "") {
                url += "?" + params.substr(1);
            }
            return url;
        }
    });

    Entities.GroupStudent = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity");
            var groupPersonID = this.get("groupPersonID");
            var link = Lampa.restUrl + "/key/" + key + "/group/" + this.get("groupID");
            return groupPersonID === null ? link + "/student" : link + "/studentGroupId/" + this.get("groupPersonID");
        },
        idAttribute: "groupPersonID",
        defaults: {
            groupPersonID: null,
            personID: null,
            groupID: null,
            start: null,
            end: null,
            email: null,
            fullName: null
        }
    });

    Entities.GroupStudents = Backbone.Collection.extend({
        model: Entities.GroupStudent,
        comparator: "fullName",
        groupID: null,
        url: function () {
            var key = Lampa.request("key:entity");
            return Lampa.restUrl + "/key/" + key + "/group/" + this.groupID + "/students";
        }
    });

    Entities.GroupLesson = Backbone.Model.extend(
        {
            url: function () {
                var key = Lampa.request("key:entity");
                return (this.get("lessonID") === null) ? "": Lampa.restUrl + "/key/" + key + "/lesson/" + this.get("lessonID");
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

    Entities.GroupLessons = Backbone.Collection.extend({
        model: Entities.GroupLesson,
        comparator: "start",
        groupID: null,
        url: function () {
            var key = Lampa.request("key:entity");
            return Lampa.restUrl + "/key/" + key + "/group/" + this.groupID + "/lessons";
        }
    });

    Entities.GroupAttendanceReport = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity");
            var link = "/group/" + this.get("groupID") + "/attendance/from/" + this.get("from") + "/to/" + this.get("to");
            return Lampa.restUrl + "/key/" + key + link;
        },
        idAttribute: "groupID",
        defaults: {
            groupID: null,
            from: null,
            to: null,
            periodID: null,
            schoolID: null,
            students: [],
            teachers: [],
            absence: []
        }
    });

    Entities.GroupsApi = Entities.Api.extend({
        search: "",
        entityName: "Group",
        idAttribute: "groupID",
        getNewEntity: function () {
            return new Entities.Group();
        },
        getNewEntities: function () {
            return new Entities.Groups();
        },
        getAttendanceReport: function (groupID, from, to) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            var entity = new Entities.GroupAttendanceReport({"groupID": groupID, "from": from, "to": to});
            entity.fetch({
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
        getStudents: function (groupID) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            var entities = new Entities.GroupStudents();
            entities.groupID = groupID;
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
        getNewStudent: function (groupID) {
            var entity = new Entities.GroupStudent();
            entity.set("groupID", groupID);
            return entity;
        },
        getLessons: function (groupID) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            var entities = new Entities.GroupLessons();
            entities.groupID = groupID;

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
            collection = this.getNewEntities();
            collection.keyword = keyword || null;
            collection.limit = limit || null;

            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            collection.fetch({
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
        }
    });

    var api = new Entities.GroupsApi();

    Lampa.reqres.setHandler("group:reset", function () {
        return api.cleanEntities();
    });

    Lampa.reqres.setHandler("group:entities", function () {
        return api.loadEntities();
    });

    Lampa.reqres.setHandler("group:search", function (collection, keyword, limit) {
        return api.searchEntities(collection, keyword, limit);
    });

    Lampa.reqres.setHandler("groups:refresh", function () {
        api.cleanEntities();
        return api.fetchEntities();
    });

    Lampa.reqres.setHandler("group:entity", function (id) {
        return api.loadEntity(id);
    });

    Lampa.reqres.setHandler("group:cached", function (id) {
        return api.getCachedEntity(id);
    });

    Lampa.reqres.setHandler("group:students", function (id) {
        return api.getStudents(id);
    });

    Lampa.reqres.setHandler("group:student", function (groupId) {
        return api.getNewStudent(groupId);
    });

    Lampa.reqres.setHandler("group:lessons", function (id) {
        return api.getLessons(id);
    });

    Lampa.reqres.setHandler("group:new", function () {
        return api.getNewEntity();
    });

    Lampa.reqres.setHandler("group:empty", function () {
        var empty = api.getNewEntity();
        empty.set("name", " select -");
        return empty;
    });

    Lampa.reqres.setHandler("group:save", function (model) {
        return api.saveEntity(model);
    });

    Lampa.reqres.setHandler("group:delete", function (model) {
        return api.deleteEntity(model);
    });

    Lampa.reqres.setHandler("group:attendance", function (groupID, from, to) {
        return api.getAttendanceReport(groupID, from, to);
    });

    Lampa.reqres.setHandler("group:clear", function () {
        return api.clear();
    });

    Lampa.on("groups:clear", function () {
        return api.cleanEntities();
    });
});