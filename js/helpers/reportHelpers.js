/**
 * Created by Roman on 10.9.15.
 */

Lampa.module("Helpers", function (Helpers, Lampa, Backbone, Marionette, $, _) {
    var API = {
        /**
         * @param lessons {Array}
         * @param absence {Backbone.Model}
         * @returns {Array}
         */
        getLessonAbsenceList: function (lessons, absence) {
            var results = [];
            _.forEach(lessons, function (lesson) {
                    if (absence.get(lesson.lessonID) !== undefined) {
                        results.push(absence.get(lesson.lessonID));
                    } else {
                        results.push('');
                    }
                }
            );
            return results;
        },
        /**
         *
         * @param total {int}
         * @param value {int}
         * @returns {string}
         */
        getPercentage: function (total, value) {
            return (Math.round((value / (total / 100)) * 10) / 10) + '';
        }
    };

    Lampa.reqres.setHandler("helper:getLessonAbsenceList", function (lessons, absence) {
        return API.getLessonAbsenceList(lessons, absence);
    });

    Lampa.reqres.setHandler("helper:getPercentage", function (total, value) {
        return API.getPercentage(total, value);
    });
});