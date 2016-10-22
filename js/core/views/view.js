/**
 * Created by Roman Brhel on 01.02.15.
 */
_.extend(Marionette.View.prototype, {
    templateHelpers: function () {
        return {
            /**
             * @param accountID
             * @returns {*}
             */
            getUserName: function (accountID) {
                return Lampa.request("helper:getUserName", accountID);
            },
            getMyAccountID: function () {
                return Lampa.request("helper:getMyAccountID");
            },
            getMyName: function () {
                return Lampa.request("helper:getMyName");
            },
            getMyRole: function () {
                return Lampa.request("helper:myRole");
            },
            isAdmin: function () {
                return Lampa.request("helper:isAdmin");
            },
            /**
             * set checkbox state
             * @param state 1- checked
             * @returns {*}
             */
            checked: function (state) {
                return Lampa.request("helper:isChecked", state);
            },
            showOrHide: function (state) {
                return Lampa.request("helper:showOrHide", state);
            },
            isNotEmpty: function (value) {
                return Lampa.request("helper:isNotEmpty", value);
            },
            absenceCheck: function (state) {
                return Lampa.request("helper:absenceCheck", state);
            },
            getFullUserName: function (name, surname, degree) {
                return Lampa.request("helper:getFullUserName", name, surname, degree);
            },
            getShortUserName: function (name, surname, degree) {
                return Lampa.request("helper:getShortUserName", name, surname, degree);
            },
            labelName: function () {
                return 'Title';
            },
            labelDescriptionA: function () {
                return 'Focus';
            },
            labelDescriptionB: function () {
                return 'Theme';
            },
            labelDescriptionC: function () {
                return 'Outcomes';
            },
            totalCount: function () {
                try {
                    return this.collection === undefined ? 0 : this.collection.length;
                }
                catch (ex) {
                    console.log(ex.message);
                }
                return 0;
            },
            getDuration: function (startDatetime, finishDatetime) {
                return Lampa.request("helper:getDuration", startDatetime, finishDatetime);
            },
            getDurationInTotal: function (from, to) {
                return Lampa.request("helper:getDurationInTotal", from, to);
            },
            getDay: function (dateTime) {
                return Lampa.request("helper:getDay", dateTime);
            },
            getDatePart: function (text) {
                return Lampa.request("helper:getDatePart", text);
            },
            getTimePart: function (text) {
                return Lampa.request("helper:getTimePart", text);
            },
            getYear: function (dateTime) {
                return Lampa.request("helper:getYear", dateTime);
            },
            toString: function (dateTime) {
                return Lampa.request("helper:toString", dateTime);
            },
            toTime: function (hours, minutes) {
                return Lampa.request("helper:toTime", hours, minutes);
            },
            school: function (schoolID) {
                try {
                    var school = Lampa.request("school:entity", schoolID);
                    return school.get("name");
                }
                catch (ex) {
                    console.log(ex.message);
                }
                return 'unknown';
            },
            getDefaultLessonDuration: function () {
                return Lampa.request('school:lessonDuration');
            },
            getDefaultStartDate: function () {
                return Lampa.request('school:firstDay');
            },
            getDefaultEndDate: function () {
                return Lampa.request('school:lastDay');
            },
            getDefaultLessonTime: function () {
                return '08:00';
            },
            getStatusClass: function (status, role, dateTime) {
                return Lampa.request("helper:getStatusClass", status, role, dateTime);
            },
            getStatusClassText: function (status, role, dateTime) {
                return Lampa.request("helper:getStatusClassText", status, role, dateTime);
            },
            getUserRole: function () {
                return Lampa.request("helper:getUserRole");
            },
            getLogoOnBackground: function () {
                return Lampa.request("helper:getLogoOnBackground");
            },
            getLogoUri: function () {
                return Lampa.request("helper:getLogoUri");
            },
            isPresented: function (status) {
                return Lampa.request("helper:isPresented", status);
            },
            isStudentExcused: function (absenceID) {
                return Lampa.request("helper:isExcused", absenceID);
            },
            isValidDuration: function (start, end) {
                return Lampa.request("helper:isValidDuration ", start, end);
            },
            getDayName: function (day) {
                return Lampa.request("helper:getDayName", day);
            },
            getShortDayName: function (day) {
                return Lampa.request("helper:getShortDayName", day);
            },
            getMonthName: function (month) {
                return Lampa.request("helper:getMonthName", month);
            },
            dayIdentityCode: function (day) {
                return Lampa.request("helper:dayIdentityCode", day);
            },
            timeLineClass: function (day) {
                return Lampa.request("helper:timeLineClass", day);
            },
            lessonTimeOption: function (selected) {
                return Lampa.request("helper:lessonTimeOption", selected);
            },
            getDayAsNumber: function (day) {
                return Lampa.request("helper:getDayAsNumber", day);
            },
            getDateFromJSON: function (day) {
                return Lampa.request("helper:getDateFromJSON", day);
            },
            getTime: function (value) {
                return Lampa.request("helper:getTime", value);
            },
            getDate: function (value) {
                return Lampa.request("helper:getDay", value);
            },
            isMonthSelected: function (index, month) {
                return Lampa.request("helper:isMonthSelected", index, month);
            },
            getNameAndDescriptionName: function (name, description) {
                return Lampa.request("helper:getNameAndDescriptionName", name, description);
            },
            getAvatarOnBackground: function () {
                return Lampa.request("helper:getAvatarOnBackground");
            },
            getAvatarOnBackgroundByID: function (id) {
                return Lampa.request("helper:getAvatarOnBackgroundByID", id);
            },
            getAvatarUri: function () {
                return Lampa.request("helper:getAvatarUri");
            },
            getAvatarUriByID: function (id) {
                return Lampa.request("helper:getAvatarUriById", id);
            },
            getPublicityType: function (type) {
                return Lampa.request("helper:getPublicityType", type);
            },
            getDescriptionType: function (type) {
                return Lampa.request("helper:getDescriptionType", type);
            },
            getTextForActiveType: function (type) {
                return Lampa.request("helper:getTextForActiveType", type);
            },
            replaceNewlinesByBreaks: function (value) {
                return Lampa.request("helper:replaceNewlinesByBreaks", value);
            },
            getCountryName: function (value) {
                return Lampa.request("helper:getCountryName", value);
            },
            obligationOption: function (value) {
                try {

                    var option = '<option value="0"';
                    if (value === 0) {
                        option += " selected ";
                    }
                    option += '>Optional</option>';

                    option += '<option value="1" ';
                    if (value === 1) {
                        option += " selected ";
                    }
                    option += '>Required</option>';

                    return option;
                }
                catch (ex) {
                    console.log(ex.message);
                    return '<option value="0">Optional</option>' +
                        '<option value="1">Required</option>';
                }

            },
            moduleVersionOption: function (value) {
                try {
                    var option = '';

                    if (_.isNumber(value)) {
                        option += '<option value="0" ';
                        if (value === 0) {
                            option += " selected ";
                        }
                        option += '>Advanced</option>';

                        option += '<option value="1" ';
                        if (value === 1) {
                            option += " selected ";
                        }
                        option += '>Basic</option>';
                    }
                    else {
                        option += '<option value="basic" ';
                        if (value === 'basic') {
                            option += " selected ";
                        }
                        option += '>Basic</option>';

                        option += '<option value="advanced" ';
                        if (value === 'advanced') {
                            option += " selected ";
                        }
                        option += '>Advanced</option>';
                    }
                    return option;
                }
                catch (ex) {
                    console.log(ex.message);
                    return 'unknown';
                }
            },

            lessonsRightsOption: function (value) {
                try {
                    var option = '<option value="0"';
                    if (value === 0) {
                        option += " selected ";
                    }
                    option += '>Off</option>';

                    option += '<option value="1" ';
                    if (value === 1) {
                        option += " selected ";
                    }
                    option += '>On, Only Own Lessons</option>';

                    option += '<option value="2" ';
                    if (value === 2) {
                        option += " selected ";
                    }
                    option += '>On, All Lessons</option>';

                    return option;
                }
                catch (ex) {
                    console.log(ex.message);
                    return 'unknown';
                }
            },

            lessonTime: function () {
                try {
                    switch (this.LESSONtime) {
                        case 0:
                            return "By Lesson Time";
                            break;
                        case 1:
                            return "By Lesson Definition";
                    }
                }
                catch (ex) {
                    console.log(ex.message);
                    return 'unknown';
                }
            },

            obligation: function (value) {
                try {
                    switch (value) {
                        case 0:
                            return "Optional";
                            break;
                        case 1:
                            return "Required";
                    }
                }
                catch (ex) {
                    console.log(ex.message);
                }
                return 'unknown';
            },

            moduleVersion: function (value) {
                if (value === 0) {
                    return "Basic";
                }
                if (value === 1) {
                    return "Advanced";
                }
                if (value === "basic") {
                    return "Basic";
                }
                if (value === "advanced") {
                    return "Advanced";
                }
            },

            lessonsRights: function (state) {
                try {
                    switch (state) {
                        case 0:
                            return "Off";
                            break;
                        case 1:
                            return "On, Only Own Lessons";
                            break;
                        case 2:
                            return "On, All Lessons";
                    }
                }
                catch (ex) {
                    console.log(ex.message);
                    return "unknown";
                }
            },
            isPasteLessonEnabled: function () {
                //return Lampa.request('lesson:exist-paste-lesson') ? 'disabled="disabled"' : '';
                return "";
            },
            isSelected: function (selectedItem, item) {
                return Lampa.request("helper:isSelected", selectedItem, item);
            },
            isActive: function (selectedItem, item) {
                return Lampa.request("helper:isActive", selectedItem, item);
            },
            isOpened: function (selectedItem, items) {
                return Lampa.request("helper:isOpened", selectedItem, items);
            },
            getschoolTypeDescription: function (value) {
                return Lampa.request("helper:getschoolTypeDescription", value);
            },
            getMapImageURL: function (longitude, latitude, width, height) {
                return "http://maps.googleapis.com/maps/api/staticmap?"
                    + "center=" + longitude + "," + latitude
                    + "&size=" + width + "x" + height
                    + "&zoom=15"
                    + "&key=AIzaSyBvQnUtIdbyYRnyU-SRoTpvVM-IrjD9IjA";
            },

            isLessonInClipboard: function (currentLessonID) {
                return Lampa.request("lesson:exist-paste-lesson", currentLessonID);
            },
            getSum: function (collection, column) {
                return Lampa.request("helper:getSum", collection, column);
            },
            getAvatarVersion: function () {
                return Lampa.request("helper:getAvatarVersion");
            },
            getAvatarNewVersion: function () {
                return Lampa.request("helper:getAvatarNewVersion");
            },
            getSkill: function (id) {
                return Lampa.request("helper:getSkill", id);
            },
            getServerUrl: function () {
                return Lampa.restUrl + "/key/" + Lampa.request("key:entity");
            },
            getCountOfItemsInActivityClipboard: function () {
                return Lampa.request("activity:clipboard:count");
            },
            getAbsenceStatus: function (lessonStatus, role, dateTime, isPresent, isExcused) {
                return Lampa.request("helper:getAbsenceStatus", lessonStatus, role, dateTime, isPresent, isExcused);
            },
            getSortAndOrder: function (value, key, order) {
                return Lampa.request("helper:getSortAndOrder", value, key, order);
            }
        };
    }
});
