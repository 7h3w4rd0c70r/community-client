/**
 * Created by Roman on 11.8.14.
 */

Lampa.module("Helpers", function (Helpers, Lampa, Backbone, Marionette, $, _) {
    var API = {
        getUserRole: function () {
            return 'admin';
        },

        // todo rename to get GetLessonStatusClass
        getStatusClass: function (status, role, dateTime) {
            var r = "";

            var isInPast = dateTime < new Date();
            switch (status) {
                case -1:
                    return r + 'new';
                case 0:
                    if (isInPast) {
                        return r + "not-reported";
                    }
                    return r + "not-planned";
                case 1:
                    if (isInPast) {
                        return r + "not-reported";
                    }
                    return r + "planned";
                case 2:
                    return r + "reported";
                case 3:
                    return r + "no-show";
                case 100:
                    return r + "canceled";
                case 102:
                    return r + "to be postponed";
            }
            return r;
        },

        getStatusClassText: function (status, role, dateTime) {
            var r = "";

            var isInPast = dateTime < new Date();
            switch (status) {
                case -1:
                    return r + 'new';
                case 0:
                    if (isInPast) {
                        return r + "not reported";
                    }
                    return r + "not planned";
                case 1:
                    if (isInPast) {
                        return r + "not Reported";
                    }
                    return r + "planned";
                case 2:
                    return r + "reported";
                case 3:
                    return r + "no-show";
                case 100:
                    return r + "canceled";
                case 102:
                    return r + "to be postponed";
            }
            return r;
        },

        getLessonStatusClass: function (status, dateTime) {
            //role = Lampa.request('')
        },

        getAbsenceStatus: function (lessonStatus, dateTime, isPresent, isExcused) {
            var isInPast = dateTime < new Date();
            switch (isPresent) {
                case 1:
                    if (isInPast) {
                        switch (lessonStatus) {
                            case 0:
                            case 1:
                                return "";
                            case 2:
                                return "present";
                            case 3:
                                return (isExcused) ? "excused" : "unexcused";
                        }
                    }
                    return "";
                case 0:
                    return (isExcused) ? "excused" : "unexcused";
            }

            return "";
        }
    };

    Lampa.reqres.setHandler("helper:getUserRole", function () {
        return API.getUserRole();
    });

    Lampa.reqres.setHandler("helper:getStatusClass", function (status, role, dateTime) {
        return API.getStatusClass(status, role, dateTime);
    });

    Lampa.reqres.setHandler("helper:getStatusClassText", function (status, role, dateTime) {
        return API.getStatusClassText(status, role, dateTime);
    });

    Lampa.reqres.setHandler("helper:getLessonStatusClass", function (status, role, dateTime) {
        return API.getLessonStatusClass(status, role, dateTime);
    });

    Lampa.reqres.setHandler("helper:getAbsenceStatus", function (lessonStatus, dateTime, isPresent, isExcused) {
        return API.getAbsenceStatus(lessonStatus, dateTime, isPresent, isExcused);
    });
});