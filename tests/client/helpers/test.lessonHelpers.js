/**
 * Created by romanbrhel on 03.02.15.
 */
TestCase("test lesson helpers", {
    "test timeLineClass undefined params returns empty string": function () {
        assertEquals('', Lampa.request("helper:timeLineClass"));
    },
    "test timeLineClass null params returns empty string": function () {
        assertEquals('', Lampa.request("helper:timeLineClass", null));
    },
    "test timeLineClass for current day returns now": function () {
        assertEquals('now', Lampa.request("helper:timeLineClass", new Date()));
    },
    "test timeLineClass for historical day returns history": function () {
        assertEquals('history', Lampa.request("helper:timeLineClass", new Date(2000, 1, 30)));
    },
    "test timeLineClass for future day returns future": function () {
        assertEquals('future', Lampa.request("helper:timeLineClass", new Date(2100, 1, 30)));
    },
    "test timeLineClass for param type number raise exception": function () {
        try {
            var exceptionRaised = false;
            Lampa.request("helper:timeLineClass", 2014);
        }
        catch (ex) {
            exceptionRaised = true;
        }
        assertTrue(exceptionRaised);
    },
    "test timeLineClass for 2015-01-01 returns history": function () {
        assertEquals('history', Lampa.request("helper:timeLineClass", '2015-01-30'));
    },
    "test timeLineClass for 2014-09-01 returns history": function () {
        assertEquals('history', Lampa.request("helper:timeLineClass", '2014-09-01'));
    },
    "test absenceCheck 0 returns empty string": function () {
        assertEquals('', Lampa.request("helper:absenceCheck", 0));
    },
    "test absenceCheck 1 returns checked string": function () {
        assertEquals(' checked ', Lampa.request("helper:absenceCheck", 1));
    },
    "test lessonTimeOption not defined select returns select tag with no selected option": function () {
        assertEquals('<option value="0">By Lesson Time</option><option value="1">By Lesson Definition</option>', Lampa.request("helper:lessonTimeOption"));
    },
    "test lessonTimeOption select 0 returns select tag first option selected": function () {
        assertEquals('<option value="0" selected>By Lesson Time</option><option value="1">By Lesson Definition</option>', Lampa.request("helper:lessonTimeOption", 0));
    },
    "test lessonTimeOption select 1 returns select tag first option selected": function () {
        assertEquals('<option value="0">By Lesson Time</option><option value="1" selected>By Lesson Definition</option>', Lampa.request("helper:lessonTimeOption", 1));
    },
    "test helper:getTimeFromClickPosition select 1 returns select tag first option selected": function () {
        assertEquals('8:00', Lampa.request("helper:getTimeFromClickPosition", 900, 1800, 8, 16));
    }
});