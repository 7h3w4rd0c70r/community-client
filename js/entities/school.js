/**
 * Created by Roman on 18.7.14.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.School = Backbone.Model.extend({
        url: function () {
            return Lampa.restUrl + "/key/" + Lampa.request("key:entity") + "/school";
        },
        idAttribute: "schoolID",
        defaults: {
            schoolID: null,
            abbr: '',
            name: '',
            email: '',
            www: '',
            lessonDuration: 60,
            businessHoursFrom: '06:00',
            businessHoursTo: '21:00',
            firstDate: '',
            lastDate: '',
            firstLessonDate: '',
            lastLessonDate: ''
        }
    });

    Entities.schoolApi = Entities.Api.extend({
        getNewEntity: function () {
            return new Entities.School();
        },
        firstDay: function () {
            var entity = this.getEntity();
            if (entity === null) {
                this.loadEntity();
                return '';
            }
            var day = entity.get("firstDate");

            if (day === null || day === '') {
                day = entity.get("firstLessonDate");
            }

            return day;
        },
        lastDay: function () {
            var entity = this.getEntity();
            if (entity === null) {
                this.loadEntity();
                return '';
            }
            var day = entity.get("lastDate");

            if (day === null || day === '') {
                day = entity.get("lastLessonDate");
            }

            return day;
        },
        getLessonDuration: function () {
            var entity = this.getEntity();
            if (entity === null) {
                this.loadEntity();
                return '60';
            }
            return entity.get("lessonDuration");
        },
        startTime: function () {
            var entity = this.getEntity();
            return Lampa.request('helper:toMinutes', (entity == null) ? "06:00" : entity.get("businessHoursFrom"));
        },
        endTime: function () {
            var entity = this.getEntity();
            return Lampa.request('helper:toMinutes', (entity == null) ? "21:00" : entity.get("businessHoursTo"));
        }
    });

    var api = new Entities.schoolApi();

    Lampa.reqres.setHandler("school:entity", function () {
        return api.loadEntity();
    });

    Lampa.reqres.setHandler("school:save", function (entity) {
        return api.saveEntity(entity);
    });

    Lampa.reqres.setHandler("school:lessonDuration", function () {
        return api.getLessonDuration();
    });
    Lampa.reqres.setHandler("school:firstDay", function () {
        return api.firstDay();
    });

    Lampa.reqres.setHandler("school:lastDay", function () {
        return api.lastDay();
    });

    Lampa.reqres.setHandler("school:startTime", function () {
        return api.startTime();
    });

    Lampa.reqres.setHandler("school:endTime", function () {
        return api.endTime();
    });

    Lampa.on("school:clear", function () {
        return api.setEntity(null);
    });
});