/**
 * Created by Roman on 18.9.14.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.LessonAttendance = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity");
            if (!this.get("attendanceID")) {
                if (this.get("lessonID")) {
                    return Lampa.restUrl + "/key/" + key + "/lesson/" + this.get("lessonID") + "/attendance";
                }
                return Lampa.restUrl + "/key/" + key + "/lesson/attendance";
            } else {
                return Lampa.restUrl.concat("/key/", key, "/lesson/attendance/", this.get("attendanceID").toString());
            }
        },
        idAttribute: "attendanceID",
        defaults: {
            attendanceID: null,
            lessonID: null,
            personID: null,
            isPresent: 1,
            length: 0,
            isExcused: 1,
            note: ""
        }
    });

    Entities.LessonAttendances = Backbone.Collection.extend({
        model: Entities.LessonAttendance,
        id: null,
        url: function () {
            var key = Lampa.request("key:entity");

            if (!this.id) {
                return Lampa.restUrl + "/key/" + key + "/lesson/attendance";
            }

            return Lampa.restUrl + "/key/" + key + "/lesson/" + this.id + "/attendance";
        }
    });

    Entities.LessonAttendancesApi = Entities.Api.extend({
        search: "",
        getNewEntity: function () {
            return new Entities.LessonAttendance();
        },
        getNewEntities: function (lessonID) {
            var entities = new Entities.LessonAttendances();
            entities.id = lessonID;
            return entities;
        },
        saveEntity: function (model) {
            var defer = new $.Deferred();

            try {
                model.set("lessonID", this.lessonID);
                model.save(null, {
                    error: function () {
                        Lampa.trigger("error", this);
                    },
                    success: function () {
                        defer.resolve(true);
                    }
                });
            } catch (ex) {
                console.log(ex.message);
                defer.resolve(false);
            }
            return defer;
        },
        saveEntities: function (lessonID) {
            var defer = new $.Deferred();
            Lampa.trigger("progressBar:show");
            try {
                var collection = this.getEntities();
                if (!collection.length) {
                    defer.resolve(true);
                } else {
                    collection.each(function (model) {
                        model.set("lessonID", lessonID);
                        model.save(null, {
                            error: function () {
                                Lampa.trigger("progressBar:hide");
                                Lampa.trigger("error", this);
                                defer.resolve(false);
                            },
                            success: function () {
                                defer.resolve(true);
                                Lampa.trigger("progressBar:hide");
                            }
                        });
                    });
                }
            } catch (ex) {
                console.log(ex.message);
                defer.resolve(false);
            }
            return defer;
        },
        deleteEntity: function (model) {
            var message = "Delete Lesson " + model.get("name") + "\"\n" + "Are you sure?";

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
        loadEntity: function (attendanceID) {
            var defer = new $.Deferred();
            Lampa.trigger("progressBar:show");
            var entity = this.getNewEntity();
            entity.set("attendanceID", attendanceID);
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
        }
    });

    var api = new Entities.LessonAttendancesApi();

    Lampa.reqres.setHandler("lesson:attendance:load", function (lessonId) {
        return api.loadEntities(lessonId);
    });

    Lampa.reqres.setHandler("lesson:attendance:save", function (model) {
        return api.saveEntity(model);
    });
});
