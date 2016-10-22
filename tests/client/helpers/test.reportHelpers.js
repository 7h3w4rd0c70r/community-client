/**
 * Created by Roman on 10.9.15.
 */
TestCase("test of all report Helpers", {

    "test getSortedAbsence for sorted absence returns same lessonAbsenceList": function () {
        var lessons = [
            {lessonID: 1, start: "2015-01-09"},
            {lessonID: 2, start: "2015-02-09"},
            {lessonID: 3, start: "2015-03-09"},
            {lessonID: 4, start: "2015-04-09"}
        ];
        var absence = new Backbone.Model({1: "P", 2: "A", 3: "A", 4: "P"});

        assertEquals(["P", "A", "A", "P"], Lampa.request("helper:getLessonAbsenceList", lessons, absence));
    },
    "test getSortedAbsence for unsorted absence returns sorted lessonAbsenceList": function () {
        var lessons = [
            {lessonID: 1, start: "2015-01-09"},
            {lessonID: 2, start: "2015-02-09"},
            {lessonID: 3, start: "2015-03-09"},
            {lessonID: 4, start: "2015-04-09"}
        ];

        var absence = new Backbone.Model({3: "A", 2: "A", 4: "P", 1: "P"});
        assertEquals(["P", "A", "A", "P"], Lampa.request("helper:getLessonAbsenceList", lessons, absence));
    },
    "test getSortedAbsence for absence list smaller than lessons list returns sorted lessonAbsenceList": function () {
        var lessons = [
            {lessonID: 1, start: "2015-01-09"},
            {lessonID: 2, start: "2015-02-09"},
            {lessonID: 3, start: "2015-03-09"},
            {lessonID: 4, start: "2015-04-09"}
        ];

        var absence = new Backbone.Model({1: "P", 3: "A", 4: "P"});

        assertEquals(["P", "", "A", "P"], Lampa.request("helper:getLessonAbsenceList", lessons, absence));
    },
    "test getSortedAbsence for absence list bigger than lessons list returns lessonAbsenceList": function () {
        var lessons = [
            {lessonID: 1, start: "2015-01-09"},
            {lessonID: 2, start: "2015-02-09"},
            {lessonID: 3, start: "2015-03-09"},
            {lessonID: 4, start: "2015-04-09"}
        ];

        var absence = new Backbone.Model({1: "P", 3: "A", 2: "A", 4: "P", 5: "P", 0: "P"});
        assertEquals(["P", "A", "A", "P"], Lampa.request("helper:getLessonAbsenceList", lessons, absence));
    },

    "test getPercentage for 20 from 100 returns 20": function () {
        assertEquals(20, Lampa.request("helper:getPercentage", 100, 20));
    },
    "test getPercentage for 200 from 1000 returns 20": function () {
        assertEquals(20, Lampa.request("helper:getPercentage", 1000, 200));
    },
    "test getPercentage for 20 from 34 returns 58.8": function () {
        assertEquals(58.8, Lampa.request("helper:getPercentage", 34, 20));
    },
    "test getPercentage for 31 from 34 returns 91.2": function () {
        assertEquals(91.2, Lampa.request("helper:getPercentage", 34, 31));
    },
    "test getPercentage for 32 from 34 returns 91.2": function () {
        assertEquals(94.1, Lampa.request("helper:getPercentage", 34, 32));
    },
    "test getPercentage for 32 from 34 returns string": function () {
        assertEquals('string', typeof (Lampa.request("helper:getPercentage", 34, 32)));
    }
});