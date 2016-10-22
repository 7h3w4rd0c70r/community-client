/**
 * Created by Roman on 4.9.14.
 */

Lampa.module("Entities", function (Entities, Lampa, Backbone) {
    Entities.Batch = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity");
            return this.get("batchID") ? Lampa.restUrl + "/key/" + key + "/batch/" + this.get("batchID") : Lampa.restUrl + "/key/" + key + "/batch";
        },
        idAttribute: "batchID",
        defaults: {
            batchID: null,
            groupID: null,
            locationID: null,
            startDate: null,
            endDate: null,
            startTime: null,
            endTime: null,
            dayOfWeek: null,
            frequency: null,
            teacherID: null,
            lessons: []
        }
    });

    Entities.Batches = Backbone.Collection.extend({
        model: Entities.Batch,
        url: function () {
            var key = Lampa.request("key:entity");
            return Lampa.restUrl + "/key/" + key + "/batches";
        }
    });

    Entities.BatchHead = Backbone.Model.extend({
        url: "",
        defaults: {
            groupID: null
        }
    });

    Entities.BatchesApi = Entities.Api.extend({
        newEntity: function () {
            return new Entities.Batch();
        },
        newEntities: function (model) {
            return new Entities.Batches([model]);
        },
        newHead: function () {
            return new Entities.BatchHead();
        },
        generateLessons: function (batches) {
            try {
                var lessons = new Entities.Lessons();
                if (batches.length > 0) {
                    batches.each(function (batch) {
                        batch.save(null, {
                            error: function (data, message) {
                                console.log("error", message);
                            },
                            success: function (data) {
                                if (data.get("lessons")) {
                                    _.each(data.get("lessons"), function (lesson) {
                                        lessons.add(lesson);
                                    });
                                }
                            }
                        });
                    });
                }
                return lessons;
            } catch (ex) {
                console.log("error", ex.message);
            }
        }
    });

    var api = new Entities.BatchesApi();

    Lampa.reqres.setHandler("batch:head", function () {
        return api.newHead();
    });

    Lampa.reqres.setHandler("batch:entity", function () {
        return api.newEntity();
    });

    Lampa.reqres.setHandler("batch:entities", function (model) {
        return api.newEntities(model);
    });

    Lampa.reqres.setHandler("batches:run", function (batches) {
        return api.generateLessons(batches);
    });
});