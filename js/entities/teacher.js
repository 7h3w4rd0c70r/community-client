/**
 * Created by Roman on 28.7.14.
 */

Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Teacher = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity");
            return this.get("personID")
                ? Lampa.restUrl + "/key/" + key + "/teacher/" + this.get("personID")
                : Lampa.restUrl + "/key/" + key + "/teacher";
        },
        idAttribute: "personID",
        comparator: "abbr",
        defaults: {
            personID: null,
            schoolID: null,
            teacherID: null,
            abbr: null,
            firstName: null,
            lastName: null,
            fullName: null,
            email: null,
            icon: 1,
            start: null,
            end: null,
            isSelected: false
        }
    });

    Entities.Teachers = Backbone.Collection.extend({
        model: Entities.Teacher,
        comparator: function (m1, m2) {
            var str1, str2;

            str1 = (m1.get('lastName') == null ? '' : m1.get('lastName')) + (m1.get('firstName') == null ? '' : m1.get('firstName'));
            str2 = (m2.get('lastName') == null ? '' : m2.get('lastName')) + (m2.get('firstName') == null ? '' : m2.get('firstName'));

            if (str1 && str2) {
                str1 = str1.toLowerCase();
                str2 = str2.toLowerCase();

                if (str1 > str2) {
                    return 1;
                } else if (str2 > str1) {
                    return -1;
                }
            }
        },
        url: function () {
            var key = Lampa.request("key:entity");
            return Lampa.restUrl + "/key/" + key + "/teachers";
        }
    });

    Entities.LessonTeachers = Backbone.Collection.extend({
        model: Entities.Teacher,
        comparator: "lastName",
        lessonID: null,
        url: function () {
            var key = Lampa.request("key:entity");
            if (this.lessonID === null) {
                return Lampa.restUrl + "/key/" + key + "/lesson/teachers";
            }
            return Lampa.restUrl + "/key/" + key + "/lesson/" + this.lessonID + "/teachers";
        }
    });

    Entities.TeacherLesson = Backbone.Model.extend({
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

    Entities.TeacherLessons = Backbone.Collection.extend({
        model: Entities.TeacherLesson,
        comparator: "start",
        from: null,
        to: null,
        personID: null,
        url: function () {
            var key = Lampa.request("key:entity");
            var request = Lampa.restUrl + "/key/" + key + "/teacher/" + this.personID + "/lessons";
            var params = '';

            if (this.from !== null) {
                params += '&from=' + this.from;
            }

            if (this.to !== null) {
                params += '&to=' + this.to;
            }

            if (params !== '') {
                request += '?' + params.substr(1);
            }

            return request;
        }
    });

    Entities.TeacherLessonsReport = Backbone.Model.extend({
        from: null,
        to: null,
        personID: null,

        url: function () {
            var key = Lampa.request("key:entity");
            var request = Lampa.restUrl + "/key/" + key + "/teacher/" + this.personID + "/lessons/report";
            var params = '';

            if (this.from !== null) {
                params += '&from=' + this.from;
            }

            if (this.to !== null) {
                params += '&to=' + this.to;
            }

            if (params !== '') {
                request += '?' + params.substr(1);
            }

            return request;
        },
        idAttribute: "personID",

        defaults: {
            personID: null,
            from: null,
            to: null,
            lessons: []
        }
    });

    Entities.LessonTeachersApi = Entities.Api.extend({
        search: "",
        entities: null,

        getNewEntity: function () {
            return new Entities.Teacher();
        },
        getNewEntities: function () {
            return new Entities.Teachers();
        },
        getDeleteMessage: function (model) {
            return "Delete te acher \"" + model.get("fullName") + "\"\n" + "Are you sure?";
        },
        getLessonEntities: function (lessonID) {
            Lampa.trigger("progressBar:show");
            var defer = $.Deferred();
            var entities = new Entities.LessonTeachers();

            if (lessonID === null) {
                Lampa.trigger("progressBar:hide");
                defer.resolve(entities);
            } else {
                entities.lessonID = lessonID;
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
            }
            return defer;
        },
        getLessons: function (personID, from, to) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            var entities = new Entities.TeacherLessons();
            if (personID === null) {
                Lampa.trigger("progressBar:hide");
                defer.resolve(entities);
            } else {
                entities.personID = personID;
                entities.from = (from !== undefined) ? from : null;
                entities.to = (to !== undefined) ? to : null;

                entities.fetch({
                    error: function (data, error) {
                        Lampa.trigger("progressBar:hide");
                        Lampa.trigger("error", error);
                    },
                    success: function (data) {
                        Lampa.trigger("progressBar:hide");
                        defer.resolve(data);
                    }
                });
            }
            return defer;
        },
        getLessonsReport: function (personID, from, to) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            var entities = new Entities.TeacherLessonsReport();
            if (personID) {
                entities.personID = personID;
                entities.from = from ? from : null;
                entities.to = to ? to : null;

                entities.fetch({
                    error: function (data, error) {
                        Lampa.trigger("progressBar:hide");
                        Lampa.trigger("error", error);
                    },
                    success: function (data) {
                        Lampa.trigger("progressBar:hide");
                        defer.resolve(data);
                    }
                });
            } else {
                Lampa.trigger("progressBar:hide");
                defer.resolve(entities);
            }
            return defer;
        }
    });

    var api = new Entities.LessonTeachersApi();

    Lampa.reqres.setHandler("teacher:reset", function () {
        return api.reset();
    });

    Lampa.reqres.setHandler("teacher:entities", function () {
        return api.loadEntities();
    });

    Lampa.reqres.setHandler("teachers:refresh", function () {
        api.cleanEntities();
        return api.fetchEntities();
    });

    Lampa.reqres.setHandler("teacher:fresh:entities", function () {
        return api.fetchEntities();
    });

    Lampa.reqres.setHandler("teacher:entity", function (id) {
        return api.loadEntity(id);
    });

    Lampa.reqres.setHandler("teacher:cached", function (id) {
        return api.getCachedEntity(id);
    });

    Lampa.reqres.setHandler("teacher:new", function () {
        return api.getNewEntity();
    });

    Lampa.reqres.setHandler("teacher:save", function (model) {
        return api.saveEntity(model);
    });

    Lampa.reqres.setHandler("teacher:delete", function (model) {
        return api.deleteEntity(model);
    });

    Lampa.reqres.setHandler("teacher:empty", function () {
        var empty = api.getNewEntity();
        empty.set("fullName", "");
        empty.set("isSelected", true);
        return empty;
    });

    Lampa.reqres.setHandler("lesson:teachers", function (lessonId) {
        return api.getLessonEntities(lessonId);
    });

    Lampa.reqres.setHandler("teacher:lessons", function (personID, from, to) {
        return api.getLessons(personID, from, to);
    });

    Lampa.reqres.setHandler("teacher:lessons:report", function (personID, from, to) {
        return api.getLessonsReport(personID, from, to);
    });

    Lampa.on("teachers:clear", function () {
        return api.cleanEntities();
    });
});
