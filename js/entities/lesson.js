/**
 * Created by Roman on 8.7.14.
 */

Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Lesson = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity");
            return (this.get("lessonID")) ? Lampa.restUrl + "/key/" + key + "/lesson/" + this.get("lessonID") : Lampa.restUrl + "/key/" + key + "/lesson";
        },
        idAttribute: "lessonID",
        defaults: {
            lessonID: null,
            schoolID: null,
            groupID: null,
            locationID: null,
            courseID: null,
            start: null,
            end: null,
            cancelREASON: "",
            status: 0,
            d: null
        }
    });

    Entities.Lessons = Backbone.Collection.extend({
        model: Entities.Lesson,
        comparator: "start",
        from: null,
        to: null,
        fromTime: null,
        toTime: null,
        groupID: null,
        locationID: null,
        teacher: null,
        teachers: null,
        day: null,
        url: function () {
            var key = Lampa.request("key:entity");
            var address = Lampa.restUrl + "/key/" + key + "/lessons";

            if (this.batch === true) {
                address += "/from/" + this.from;
                address += "/to/" + this.to;
                address += "/from/" + this.from;
                address += "/to/" + this.to;
                address += "/days/" + this.days;
                address += "/time/" + this.time;
                address += "/duration/" + this.duration;
                address += "/group/" + this.group;
                address += "/location/" + this.location;
                address += "/teachers/" + this.teachers;
                address += "/lessons/" + this.lessons;
                return address;
            }

            var params = "";

            if (this.group) {
                params += "&group=" + this.group;
            }

            if (this.course) {
                params += "&course=" + this.course;
            }

            if (this.location !== null) {
                params += "&location=" + this.location;
            }

            if (this.teacher) {
                params += "&teacher=" + this.teacher;
            }

            if (this.teachers) {
                params += "&teachers=" + this.teachers;
            }

            if (this.day) {
                params += "&day=" + this.day;
            }

            if (this.status) {
                params += "&status=" + this.status;
            }

            if (this.from) {
                params += "&from=" + this.from;
            }

            if (this.to) {
                params += "&to=" + this.to;
            }

            if (this.fromTime) {
                params += "&fromTime=" + this.fromTime;
            }

            if (this.toTime) {
                params += "&toTime=" + this.toTime;
            }

            if (this.dayOfWeek) {
                params += "&dayOfWeek=" + this.dayOfWeek;
            }

            if (this.lessons) {
                params += "&lessons=" + this.lessons;
            }

            if (params) {
                address += "?" + params.substr(1);
            }

            return address;
        }
    });

    Entities.LessonNeighbours = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity");
            return this.get("lessonID") ? Lampa.restUrl + "/key/" + key + "/lesson/" + this.get("lessonID") + "/neighbours" : Lampa.restUrl + "/key/" + key + "/lesson";
        },
        defaults: {
            lessonID: null,
            groupID: null,
            lastLessonID: null,
            nextLessonID: null,
            d: null
        }
    });

    Entities.LessonNeighboursAccess = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity");

            if (this.get("lessonID") && this.get("accessID")) {
                return Lampa.restUrl + "/key/" + key + "/lesson/" + this.get("lessonID") + "/neighbours/access/" + this.get("accessID");
            }
            return Lampa.restUrl + "/key/" + key + "/lesson";
        },
        defaults: {
            lessonID: null,
            lastLessonID: null,
            nextLessonID: null,
            d: null
        }
    });

    Entities.LessonPlaneReport = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity");

            if (this.get("lessonID")) {
                return Lampa.restUrl + "/key/" + key + "/lesson/" + this.get("lessonID") + "/report";
            }

            return "";
        },
        defaults: {}
    });

    Entities.ConflictLessons = Backbone.Collection.extend({
        model: Entities.Lesson,
        comparator: "start",
        lessonID: null,
        start: null,
        end: null,
        groupID: null,
        locationID: null,
        personID: null,

        url: function () {
            var address = Lampa.restUrl + "/key/" + Lampa.request("key:entity") + "/lesson/" + this.lessonID + "/conflict";

            if (this.groupID) {
                address += "/group/" + this.groupID;
            }

            if (this.locationID) {
                address += "/location/" + this.locationID;
            }

            if (this.personID) {
                address += "/person/" + this.personID;
            }

            address += "/start/" + this.start;
            address += "/end/" + this.end;

            return address;
        }
    });

    Entities.LessonsApi = Entities.Api.extend({
        search: "",
        getNewEntities: function () {
            return new Entities.Lessons();
        },
        loadEntities: function (params, isBatch) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            try {
                var entities = this.getNewEntities();
                entities.batch = false;
                entities.group = null;
                entities.location = null;
                entities.course = null;
                entities.from = null;
                entities.to = null;
                entities.fromTime = null;
                entities.toTime = null;
                entities.duration = null;
                entities.time = null;
                entities.days = null;
                entities.day = null;
                entities.teachers = null;
                entities.teacher = entities.teacher || null;
                entities.status = null;

                var attr = {};

                if (params[0]) {
                    attr = Lampa.request("helper:QueryStringToHash", params[0] || "");
                } else {
                    attr = params;
                }

                if (attr !== undefined && attr !== null) {
                    entities.day = attr.day || null;
                    entities.dayOfWeek = attr.dayOfWeek || null;
                    entities.batch = isBatch || null;
                    entities.group = attr.group || null;
                    entities.location = attr.location || null;
                    entities.course = attr.course || null;
                    entities.from = attr.from || null;
                    entities.to = attr.to || null;
                    entities.fromTime = attr.fromTime || null;
                    entities.toTime = attr.toTime || null;
                    entities.duration = attr.duration || null;
                    entities.time = attr.time || null;
                    entities.days = attr.days || null;
                    entities.day = attr.day || null;
                    entities.teachers = attr.teachers || null;
                    entities.teacher = attr.teacher || null;
                    entities.lessons = attr.lessons || null;
                    entities.status = attr.status || null;
                }

                entities.fetch({
                    error: function () {
                        Lampa.trigger("progressBar:hide");
                        Lampa.error(arguments);
                    },
                    success: function (data) {
                        Lampa.trigger("progressBar:hide");
                        defer.resolve(data);
                    }
                });
            } catch (ex) {
                Lampa.error(ex);
            }
            return defer;
        },
        useNewEntity: false,
        getNewEntity: function () {
            return new Entities.Lesson();
        },
        addEntities: function (collection) {
            var entities = collection;
            var counter = 0;
            var total = entities.length;

            var defer = new $.Deferred();
            entities.each(function (model) {
                if (model.get("lessonID") === null) {
                    model.save(null, {
                        type: "POST",
                        error: function () {
                            Lampa.trigger("progressBar:hide");
                            Lampa.error(arguments);
                            defer.resolve(false);
                        },
                        success: function (data) {
                            counter++;
                            model.set("status", 0);

                            if (total <= counter) {
                                defer.resolve(true);
                                Lampa.trigger("progressBar:hide");
                            }
                        }
                    });
                }
            });
            return defer;
        },
        deleteEntity: function (model) {
            var message = "Delete Lesson \"" + model.get("name") + "\"\n" + "Are you sure?";
            if (confirm(message) === true) {
                Lampa.trigger("progressBar:show");
                model.destroy({
                    error: function () {
                        Lampa.trigger("progressBar:hide");
                        Lampa.error(arguments);
                    },
                    success: function () {
                        Lampa.trigger("progressBar:hide");
                        window.history.back();
                    }
                });
            }
        },
        getNeighbours: function (id) {
            var defer = new $.Deferred();
            Lampa.trigger("progressBar:show");
            var entity = new Entities.LessonNeighbours();
            entity.set("lessonID", id);
            entity.fetch({
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    Lampa.error(arguments);
                },
                success: function () {
                    Lampa.trigger("progressBar:hide");
                    defer.resolve(entity);
                }
            });
            return defer;
        },
        getNeighboursAccess: function (id, access) {
            var defer = new $.Deferred();
            Lampa.trigger("progressBar:show");
            var entity = new Entities.LessonNeighboursAccess();
            entity.set("lessonID", id);
            entity.set("accessID", access);
            entity.fetch({
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    Lampa.error(arguments);
                },
                success: function () {
                    Lampa.trigger("progressBar:hide");
                    defer.resolve(entity);
                }
            });
            return defer;
        },
        getLessonPlaneReportData: function (lessonID) {
            var defer = new $.Deferred();
            Lampa.trigger("progressBar:show");
            var entity = new Entities.LessonPlaneReport({lessonID: lessonID});
            entity.set("lessonID", lessonID);
            entity.fetch({
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    Lampa.error(arguments);
                },
                success: function () {
                    Lampa.trigger("progressBar:hide");
                    defer.resolve(entity);
                }
            });
            return defer;
        },
        getLessonConflictGroup: function (lessonID, groupID, start, end) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            try {
                var entities = new Entities.ConflictLessons();
                entities.lessonID = lessonID;
                entities.groupID = groupID;
                entities.start = start;
                entities.end = end;
                entities.fetch({
                    error: function () {
                        Lampa.trigger("progressBar:hide");
                        Lampa.error(arguments);
                    },
                    success: function (data) {
                        Lampa.trigger("progressBar:hide");
                        defer.resolve(data);
                    }
                });
            } catch (ex) {
                Lampa.trigger("progressBar:hide");
                console.log(ex.message);
            }
            return defer;
        },
        getLessonConflictLocation: function (lessonID, locationID, start, end) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            try {
                var entities = new Entities.ConflictLessons();
                entities.lessonID = lessonID;
                entities.locationID = locationID;
                entities.start = start;
                entities.end = end;
                entities.fetch({
                    error: function () {
                        Lampa.trigger("progressBar:hide");
                        Lampa.error(arguments);
                    },
                    success: function (data) {
                        Lampa.trigger("progressBar:hide");
                        defer.resolve(data);
                    }
                });
            } catch (ex) {
                Lampa.trigger("progressBar:hide");
                Lampa.error(ex);
            }
            return defer;
        },
        getLessonConflictTeachers: function (lessonID, personID, start, end) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            try {
                var entities = new Entities.ConflictLessons();
                entities.lessonID = lessonID;
                entities.personID = personID;
                entities.start = start;
                entities.end = end;
                entities.fetch({
                    error: function () {
                        Lampa.trigger("progressBar:hide");
                        Lampa.error(arguments);
                    },
                    success: function (data) {
                        Lampa.trigger("progressBar:hide");
                        defer.resolve(data);
                    }
                });
            } catch (ex) {
                Lampa.trigger("progressBar:hide");
                Lampa.error(ex);
            }
            return defer;
        },
        changeLessonStatus: function (lessonID) {
            var lesson = this.getEntity();
            if (lesson.get("lessonID") === lessonID) {
                lesson.save();
            }
        }
    });

    var api = new Entities.LessonsApi();

    Lampa.reqres.setHandler("lesson:entities", function () {
        return api.loadEntities();
    });

    Lampa.reqres.setHandler("lesson:load", function (params) {
        this.useNewEntity = false;
        return api.loadEntities(params, false);
    });

    Lampa.reqres.setHandler("lesson:batch", function (params) {
        return api.loadEntities(params, true);
    });

    Lampa.reqres.setHandler("lesson:entity", function (id) {
        return api.loadEntity(id);
    });

    Lampa.reqres.setHandler("lesson:current:entity", function () {
        return api.getEntity();
    });

    Lampa.reqres.setHandler("lesson:new", function () {
        this.useNewEntity = true;
        return api.getNewEntity();
    });

    Lampa.reqres.setHandler("lesson:neighbours", function (id) {
        this.useNewEntity = true;
        return api.getNeighbours(id);
    });

    Lampa.reqres.setHandler("lesson:neighbours:access", function (id, access) {
        this.useNewEntity = true;
        return api.getNeighboursAccess(id, access);
    });

    Lampa.reqres.setHandler("lesson:save", function (model) {
        return api.saveEntity(model);
    });

    Lampa.reqres.setHandler("lessons:add", function (collection) {
        return api.addEntities(collection);
    });

    Lampa.reqres.setHandler("lesson:delete", function (model) {
        return api.deleteEntity(model);
    });

    Lampa.reqres.setHandler("lesson:set", function (model) {
        return api.setEntity(model);
    });

    // todo: delete
    Lampa.reqres.setHandler("lesson:report", function (lessonID) {
        return api.getLessonPlaneReportData(lessonID);
    });

    Lampa.reqres.setHandler("lesson:conflict:group", function (lessonID, groupID, start, end) {
        return api.getLessonConflictGroup(lessonID, groupID, start, end);
    });

    Lampa.reqres.setHandler("lesson:conflict:location", function (lessonID, locationID, start, end) {
        return api.getLessonConflictLocation(lessonID, locationID, start, end);
    });

    Lampa.reqres.setHandler("lesson:conflict:teachers", function (lessonID, teachers, start, end) {
        return api.getLessonConflictTeachers(lessonID, teachers, start, end);
    });

    Lampa.reqres.setHandler("lesson:change:status", function (lessonID) {
        return api.changeLessonStatus(lessonID);
    });
});
