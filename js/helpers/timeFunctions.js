/**
 * Created by Roman on 4.8.14.
 */

Lampa.module("Helpers", function (Helpers, Lampa, Backbone, Marionette, $, _) {
    var API = {
        addZero: function (number) {
            number = '' + number;
            if (number.length < 2) {
                number = '0' + number;
            }
            return number;
        },
        getDateFromJSON: function (dateTime) {
            if (_.isDate(dateTime)) {
                return dateTime;
            }
            return new Date(dateTime.replace(/-/g, "/"));
        },
        getDateFromString: function (date) {
            return (_.isString(date)) ? new Date(date.substr(0, 4), (date.substr(5, 2)) - 1, date.substr(8, 2), 0, 0, 0, 0) : null;
        },
        toString: function (date) {
            var day = null;

            if (_.isString(date)) {
                day = this.getDateFromString(date);
            }
            if (_.isDate(date)) {
                day = date;
            }
            return (day === null) ? '' : '' + day.getDate() + ' ' + this.getMonthShortName(day.getMonth() + 1) + ' ' + day.getFullYear() + ' / ' + this.getTime(date);
        },
        getDayCode: function (date) {
            var month = '00' + (date.getMonth() + 1) + '';
            var day = '00' + (date.getDate()) + '';
            return date.getFullYear() + '-' + month[month.length - 2] + month[month.length - 1] + '-' + day[day.length - 2] + day[day.length - 1];
        },
        getDayName: function (dateTime) {
            var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var day;
            if (dateTime !== null) {
                day = this.getDateFromJSON(dateTime);
                return weekday[day.getDay()];
            }
            return '';
        },
        getShortDayName: function (dateTime) {
            return this.getDayName(dateTime).substr(0, 3);
        },
        getDayFromString: function (dateString) {
        },
        getMonthName: function (index) {
            var months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return months[parseInt(index)];
        },
        getMonthShortName: function (index) {
            var months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return months[parseInt(index)];
        },
        getTime: function (dateTime) {
            if (dateTime !== null) {
                var day = this.getDateFromJSON(dateTime);
                return this.addZero(day.getHours()) + ':' + this.addZero(day.getMinutes());
            }
            return '';
        },
        toTime: function (hours, minutes) {
            if (minutes >= 59) {
                hours += Math.floor(minutes / 60);
                minutes %= 60;
            }

            return this.addZero(hours) + ':' + this.addZero(minutes);
        },
        toDate: function (day, month, year) {
            return year + '-' + this.addZero(month) + '-' + this.addZero(day);
        },
        toDateTime: function (day, month, year, hours, minutes) {
            return this.toDate(day, month, year) + ' ' + this.toTime(hours, minutes);
        },
        getDay: function (dateTime) {
            var date = '';
            if (dateTime !== null) {
                var day = this.getDateFromJSON(dateTime);
                date += day.getDate() + ' ' + this.getMonthShortName(day.getMonth() + 1) + ' ' + day.getFullYear();
            }
            return date;
        },
        getDayAsNumber: function (day) {
            return parseInt(day);
        },
        getDuration: function (start, finish) {
            return (start !== null || finish !== null ) ? ((this.getDateFromJSON(finish).getTime() - this.getDateFromJSON(start).getTime()) / 60000) : 0;
        },
        getWeekNumber: function (day) {
            // Copy date so don't modify original
            day = new Date(+day);
            day.setHours(0);
            // Set to nearest Thursday: current date + 4 - current day number
            // Make Sunday's day number 7
            day.setDate(day.getDate() + 4 - (day.getDay() || 7));
            // Get first day of year
            var yearStart = new Date(day.getFullYear(), 0, 1);
            // Calculate full weeks to nearest Thursday
            var weekNo = Math.ceil(( ( (day - yearStart) / 86400000) + 1) / 7);
            // Return array of year and week number
            return [day.getFullYear(), weekNo];
        },
        getWeekDayIndex: function (day) {
            return (day.getDay() < 1) ? 6 : day.getDay() - 1;
        },
        getLessonPosition: function (dateTime, startTime, endTime) {
            return (dateTime === null) ? 0 : ((dateTime.getHours() * 60 + dateTime.getMinutes() - startTime) * 100 / (endTime - startTime));
        },
        getLessonWidth: function (startDateTime, endDateTime, startTime, endTime) {
            if (startTime - endTime === 0) {
                return 0;
            }

            var start = startDateTime.getHours() * 60 + startDateTime.getMinutes() - startTime;
            var end = endDateTime.getHours() * 60 + endDateTime.getMinutes() - startTime;
            return (end - start) * 100 / (endTime - startTime);
        },
        addDayToArray: function (days, daytime) {
            if (daytime !== null) {
                var day = daytime.substr(0, 10);
                days.push(day);
            }
            return days;
        },
        toMinutes: function (time) {
            try {
                return 1 * time.substr(3, 2) + 60 * time.substr(0, 2);
            }
            catch (ex) {
                return 0;
            }
        },
        isMonthSelected: function (index, month) {
            return (index === month) ? "selected='selected'" : '';
        },
        getYear: function (date) {
            return (date === null) ? '' : date.substr(0, 4);
        },
        isValidDuration: function (start, end) {
            return false;
        },
        dayIdentityCode: function (dateText) {
            return (typeof(dateText) === "string") ? 'D' + dateText.replace('-', '').replace('-', '') : '';
        },
        getOldestDay: function (days) {
            var oldest, day;

            if (days.length > 0) {
                for (var i = 0; i < days.length; i++) {
                    day = this.getDateFromString(days[i]);
                    if (oldest === undefined) oldest = day;
                    if (day < oldest)oldest = day;
                }

            } else {
                return new Date();
            }

            return oldest;
        },
        getLatestDay: function (days) {
            var latest, day, i = 0;

            if (days.length > 0) {
                for (i; i < days.length; i++) {
                    day = this.getDateFromString(days[i]);
                    if (latest === undefined) latest = day;
                    if (day > latest)latest = day;
                }

            } else {
                return new Date();
            }

            return latest;
        },
        getNumberOfDaysBetween: function (fromDay, toDay) {
            if (fromDay === undefined || toDay === undefined) return 0;
            fromDay = this.getDateFromString(fromDay);
            toDay = this.getDateFromString(toDay);
            fromDay = new Date(fromDay.getFullYear(), fromDay.getMonth(), fromDay.getDate(), 0, 0, 0, 1);
            toDay = new Date(toDay.getFullYear(), toDay.getMonth(), toDay.getDate(), 23, 59, 59, 999);
            return Math.abs(Math.ceil((toDay.getTime() - fromDay.getTime()) / (1000 * 60 * 60 * 24)));
        },
        getNextDay: function (day) {
            return new Date(day.getTime() + (1000 * 60 * 60 * 24));
        },
        getLastDay: function (day) {
            return new Date(day.getTime() - (1000 * 60 * 60 * 24));
        },
        getDaysInterval: function (fromDay, toDay) {
            var days = [], count, day, i = 1;
            if (fromDay === undefined || toDay === undefined) return days;
            count = this.getNumberOfDaysBetween(fromDay, toDay);

            var from = this.getDateFromString(fromDay);
            day = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 0, 0, 0, 1);
            var item;
            for (i; i <= count; i++) {
                item = Lampa.request("day:entity", day);
                days.push(this.getDayCode(day));
                day = this.getNextDay(day);
            }
            return days;
        },
        getUserFormatDay: function (value, format) {
            return '';
        },
        getTodayDate: function () {
            return this.getDayCode(new Date());
        },
        getDatePart: function (text) {
            return typeof(text) === "string" ? text.substring(0, 10) : "";
        },
        getTimePart: function (text) {
            return typeof(text) === "string" ? text.substr(11, 5) : "";
        },
        getEnd: function (date, time, duration) {
            var start = moment(date.toString().concat(" ", time), "YYYY-MM-DD HH:mm").toDate();
            start.setMinutes(start.getMinutes() + duration);
            return this.toStringDateTime(start);
        },
        toStringDateTime: function (date) {
            return this.toDateTime(date.getDate(), date.getMonth() + 1, date.getFullYear(), date.getHours(), date.getMinutes());
        }
    };

    Lampa.reqres.setHandler("helper:addZero", function (number) {
        return API.addZero(number);
    });
    Lampa.reqres.setHandler("helper:getDateFromJSON", function (dateTime) {
        return API.getDateFromJSON(dateTime);
    });
    Lampa.reqres.setHandler("helper:getDateFromString", function (dateTime) {
        return API.getDateFromString(dateTime);
    });
    Lampa.reqres.setHandler("helper:getDayName", function (dateTime) {
        return API.getDayName(dateTime);
    });
    Lampa.reqres.setHandler("helper:getMonthName", function (month) {
        return API.getMonthName(month);
    });
    Lampa.reqres.setHandler("helper:getMonthShortName", function (month) {
        return API.getMonthShortName(month);
    });
    Lampa.reqres.setHandler("helper:toTime", function (hours, minutes) {
        return API.toTime(hours, minutes);
    });
    Lampa.reqres.setHandler("helper:toDate", function (day, month, year) {
        return API.toDate(day, month, year);
    });
    Lampa.reqres.setHandler("helper:toDateTime", function (day, month, year, hours, minutes) {
        return API.toDateTime(day, month, year, hours, minutes);
    });
    Lampa.reqres.setHandler("helper:getDay", function (dateTime) {
        return API.getDay(dateTime);
    });
    Lampa.reqres.setHandler("helper:getDuration", function (startDatetime, finishDatetime) {
        return API.getDuration(startDatetime, finishDatetime);
    });
    Lampa.reqres.setHandler("helper:getWeekNumber", function (day) {
        return API.getWeekNumber(day);
    });
    Lampa.reqres.setHandler("helper:getWeekDayIndex", function (day) {
        return API.getWeekDayIndex(day);
    });
    Lampa.reqres.setHandler("helper:getLessonPosition", function (dateTime, startTime, endTime) {
        return API.getLessonPosition(dateTime, startTime, endTime);
    });
    Lampa.reqres.setHandler("helper:getLessonWidth", function (startDateTime, endDateTime, startTime, endTime) {
        return API.getLessonWidth(startDateTime, endDateTime, startTime, endTime);
    });
    Lampa.reqres.setHandler("helper:addDayToArray", function (days, daytime) {
        return API.addDayToArray(days, daytime);
    });
    Lampa.reqres.setHandler("helper:toMinutes", function (time) {
        return API.toMinutes(time);
    });
    Lampa.reqres.setHandler("helper:isMonthSelected", function (index, month) {
        return API.isMonthSelected(index, month);
    });
    Lampa.reqres.setHandler("helper:getYear", function (date) {
        return API.getYear(date);
    });
    Lampa.reqres.setHandler("helper:isValidDuration", function (start, end) {
        return API.isValidDuration(start, end);
    });
    Lampa.reqres.setHandler("helper:dayIdentityCode", function (dateText) {
        return API.dayIdentityCode(dateText);
    });
    Lampa.reqres.setHandler("helper:getTime", function (dateTime) {
        return API.getTime(dateTime);
    });
    Lampa.reqres.setHandler("helper:getDayAsNumber", function (day) {
        return API.getDayAsNumber(day);
    });
    Lampa.reqres.setHandler("helper:toString", function (dateString) {
        return API.toString(dateString);
    });
    Lampa.reqres.setHandler("helper:getOldestDay", function (days) {
        return API.getOldestDay(days);
    });
    Lampa.reqres.setHandler("helper:getLatestDay", function (days) {
        return API.getLatestDay(days);
    });
    Lampa.reqres.setHandler("helper:getDaysInterval", function (from, to) {
        return API.getDaysInterval(from, to);
    });
    Lampa.reqres.setHandler("helper:getNumberOfDaysBetween", function (from, to) {
        return API.getNumberOfDaysBetween(from, to);
    });
    Lampa.reqres.setHandler("helper:getNextDay", function (day) {
        return API.getNextDay(day);
    });
    Lampa.reqres.setHandler("helper:getLastDay", function (day) {
        return API.getLastDay(day);
    });
    Lampa.reqres.setHandler("helper:getDayCode", function (day) {
        return API.getDayCode(day);
    });
    Lampa.reqres.setHandler("helper:getShortDayName", function (dayTime) {
        return API.getShortDayName(dayTime);
    });
    Lampa.reqres.setHandler("helper:getDayFromString", function (string) {
        return API.getDayFromString(string);
    });
    Lampa.reqres.setHandler("helper:getUserFormatDay", function (string, format) {
        return API.getUserFormatDay(string, format);
    });
    Lampa.reqres.setHandler("helper:getTodayDate", function () {
        return API.getTodayDate();
    });
    Lampa.reqres.setHandler("helper:getDatePart", function (text) {
        return API.getDatePart(text);
    });
    Lampa.reqres.setHandler("helper:getTimePart", function (text) {
        return API.getTimePart(text);
    });
    Lampa.reqres.setHandler("helper:getEnd", function (date, time, duration) {
        return API.getEnd(date, time, duration);
    });
    Lampa.reqres.setHandler("helper:DateToISOString", function (date) {
        return API.toStringDateTime(date);
    });
});