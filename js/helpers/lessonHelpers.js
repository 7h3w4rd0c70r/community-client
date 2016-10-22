/**
 * Created by Roman on 3.2.15.
 */
Lampa.module("Helpers", function (Helpers, Lampa, Backbone, Marionette, $, _) {
    var API;
    API = {
        timeLineClass: function (datetime) {
            datetime = datetime || null;

            if (typeof(datetime) === "string") {
                datetime = moment(datetime, "YYYY-MM-DD HH:mm").toDate();
            }

            if (typeof(datetime) !== "object") {
                console.log('helper:timeLineClass', datetime.toString(), 'Param is typeOf ' + typeof(datetime) + ', but object expected!');
            }

            if (!datetime) {
                return "";
            }

            if (datetime.getDate() === new Date().getDate() && datetime.getMonth() === new Date().getMonth() && datetime.getFullYear() === new Date().getFullYear()) {
                return "now";
            }

            return datetime < new Date() ? "history" : "future";
        },

        lessonTimeOption: function (selected) {
            var option = '<option value="0"';
            if (selected === 0) {
                option += " selected";
            }
            option += ">By Lesson Time</option>";

            option += '<option value="1"';
            if (selected === 1) {
                option += " selected";
            }
            return option + ">By Lesson Definition</option>";
        },

        absenceCheck: function (state) {
            return (state === 1) ? " checked " : "";
        },

        getTimeFromClickPosition: function (x, w, firstHour, lastHour) {
            return '8:00';
            /*
             try {
             var date = new Date();
             date.setMinutes(0);
             date.setHours((firstHour + (lastHour - firstHour) * (x / w)));
             return Lampa.request('helper:getTime')
             }
             catch (ex) {
             return '8:00';
             }
             */
        }
    };

    Lampa.reqres.setHandler("helper:timeLineClass", function (datetime) {
        return API.timeLineClass(datetime);
    });

    Lampa.reqres.setHandler("helper:lessonTimeOption", function (selected) {
        return API.lessonTimeOption(selected);
    });

    Lampa.reqres.setHandler("helper:absenceCheck", function (state) {
        return API.absenceCheck(state);
    });

    Lampa.reqres.setHandler("helper:getTimeFromClickPosition", function (x, width, min, max) {
        return API.getTimeFromClickPosition(x, width, min, max);
    });

});