TestCase("test status helpers", {
    "test get status for canceled lesson in future for admin": function () {
        assertEquals('canceled', Lampa.request("helper:getStatusClass", 100, 'admin', new Date(2016, 3, 13, 12, 0, 0, 0)));
    },
    "test get status for no-show lesson in future for admin": function () {
        assertEquals('no-show', Lampa.request("helper:getStatusClass", 3, 'admin', new Date(2016, 3, 13, 12, 0, 0, 0)));
    },
    "test get status for not prepared lesson in past for admin": function () {
        assertEquals('not-reported', Lampa.request("helper:getStatusClass", 0, 'admin', new Date(2010, 3, 13, 12, 0, 0, 0)));
    },
    "test get status for prepared lesson in past for admin": function () {
        assertEquals('not-reported', Lampa.request("helper:getStatusClass", 1, 'admin', new Date(2014, 3, 13, 12, 0, 0, 0)));
    },
    "test get status for filled report of activities during lesson in past for admin": function () {
        assertEquals('reported', Lampa.request("helper:getStatusClass", 2, 'admin', new Date(2010, 3, 13, 12, 0, 0, 0)));
    },
    "test get status for postponed lesson in future for admin": function () {
        assertEquals('to be postponed', Lampa.request("helper:getStatusClass", 102, 'admin', new Date(2010, 3, 13, 12, 0, 0, 0)));
    },
    "test get status for status -1 returns class new": function () {
        assertEquals('new', Lampa.request("helper:getStatusClass", -1, 'admin', new Date(2010, 3, 13, 12, 0, 0, 0)));
    },
    "test get status for status unknown value returns empty class": function () {
        assertEquals('', Lampa.request("helper:getStatusClass", -11242, 'admin', new Date(2010, 3, 13, 12, 0, 0, 0)));
    },
    "test get current user role  for status unknown value returns empty class": function () {
        assertEquals('admin', Lampa.request("helper:getUserRole"));
    },
    "test get absence status for reported lesson an student was present returns present ": function () {
        assertEquals('present', Lampa.request("helper:getAbsenceStatus", 2, new Date(2010, 3, 13, 12, 0, 0, 0), 1));
    },
    "test get absence status for reported lesson an student was not present but excused returns excused ": function () {
        assertEquals('excused', Lampa.request("helper:getAbsenceStatus", 2, new Date(2010, 3, 13, 12, 0, 0, 0), 0, 1));
    },
    "test get absence status for reported lesson an student was not present but unexcused returns unexcused ": function () {
        assertEquals('unexcused', Lampa.request("helper:getAbsenceStatus", 2, new Date(2010, 3, 13, 12, 0, 0, 0), 0, 0));
    },
    "test get absence status for planed lesson an student excused returns excused ": function () {
        assertEquals('excused', Lampa.request("helper:getAbsenceStatus", 1, new Date(2018, 3, 13, 12, 0, 0, 0), 0, 1));
    },
    "test get absence status for no-show lesson an student excused returns excused string ": function () {
        assertEquals('excused', Lampa.request("helper:getAbsenceStatus", 3, new Date(2018, 3, 13, 12, 0, 0, 0), 0, 1));
    },
    "test get absence status for no-show lesson an student excused returns was there but unexcused string ": function () {
        assertEquals('unexcused', Lampa.request("helper:getAbsenceStatus", 3, new Date(2014, 3, 13, 12, 0, 0, 0), 1, 0), true, false);
    },
    "test get absence status for planned lesson an student will come returns empty string": function () {
        assertEquals("", Lampa.request("helper:getAbsenceStatus", 2, new Date(2020, 3, 13, 12, 0, 0, 0), true));
    }
});

