TestCase("test time functions", {
    "test conversion to datetime from php format": function () {
        var result = new Date(2014, 7, 4, 17, 29, 40, 0);
        assertEquals(result, Lampa.request("helper:getDateFromJSON", '2014-08-04 17:29:40'));
    },
    "test getting a name of day": function () {
        assertEquals('Friday', Lampa.request("helper:getDayName", '2014-08-01 17:29:40'));
    },
    "test getShortDayName for Friday returns Fri": function () {
        assertEquals('Fri', Lampa.request("helper:getShortDayName", '2014-08-01 17:29:40'));
    },
    "test getting a time without zeros late part from Date": function () {
        assertEquals('17:29', Lampa.request("helper:getTime", '2014-08-01 17:29:40'));
    },
    "test getting a time with zeros part from Date": function () {
        assertEquals('07:05', Lampa.request("helper:getTime", '2014-08-01 07:05:40'));
    },
    "test getTime for string 2014-09-01 08:00:00 return 08:00": function () {
        assertEquals('08:00', Lampa.request("helper:getTime", '2014-09-01 08:00:00'));
    },
    "test getting a date with zeros part from Date": function () {
        assertEquals('1 Aug 2014', Lampa.request("helper:getDay", '2014-08-01 07:05:40'));
    },
    "test convert number to string width leading zero for two digits number": function () {
        assertEquals('05', Lampa.request("helper:addZero", 5));
    },
    "test convert number to string width leading zero for two digits number,but no zero required on first place": function () {
        assertEquals('15', Lampa.request("helper:addZero", 15));
    },
    "test getting duration in minutes for normal lesson": function () {
        assertEquals(50, Lampa.request("helper:getDuration", '2014-08-01 07:05:40', '2014-08-01 07:55:40'));
    },
    "test getting week number for some date": function () {
        assertEquals([2014, 34], Lampa.request("helper:getWeekNumber", new Date(2014, 7, 18, 0, 0, 0, 0)));
    },
    "test getting day number for some monday": function () {
        assertEquals(0, Lampa.request("helper:getWeekDayIndex", new Date(2014, 7, 18, 0, 0, 0, 0)));
    },
    "test getting day number for some tuesday": function () {
        assertEquals(1, Lampa.request("helper:getWeekDayIndex", new Date(2014, 7, 19, 0, 0, 0, 0)));
    },
    "test getting day number for some sunday": function () {
        assertEquals(6, Lampa.request("helper:getWeekDayIndex", new Date(2014, 3, 13, 0, 0, 0, 0)));
    },
    "test lesson position in percentage for 8 am ": function () {
        assertEquals(100 / 3, Lampa.request("helper:getLessonPosition", new Date(2014, 3, 13, 8, 0, 0, 0), 0, 1440));
    },
    "test lesson position in percentage for 12 am ": function () {
        assertEquals(50, Lampa.request("helper:getLessonPosition", new Date(2014, 3, 13, 12, 0, 0, 0), 0, 1440));
    },
    "test lesson position in percentage for 15:30 ": function () {
        assertEquals(64.58333333333333, Lampa.request("helper:getLessonPosition", new Date(2014, 3, 13, 15, 30, 0, 0), 0, 1440));
    },
    "test lesson position in percentage for null ": function () {
        assertEquals(0, Lampa.request("helper:getLessonPosition", null, 0, 1440));
    },
    "test lesson position in percentage for 12 am day start at 6 am ": function () {
        assertEquals(100 / 3, Lampa.request("helper:getLessonPosition", new Date(2014, 3, 13, 12, 0, 0, 0), 360, 1440));
    },
    "test lesson width in percentage for 0-8 day start at 0": function () {
        var start = new Date(2014, 3, 13, 0, 0, 0, 0);
        var end = new Date(2014, 3, 13, 8, 0, 0, 0);
        assertEquals(100 / 3, Lampa.request("helper:getLessonWidth", start, end, 0, 1440));
    },
    "test lesson width in percentage for 6-7 day start at 6": function () {
        var start = new Date(2014, 3, 13, 6, 0, 0, 0);
        var end = new Date(2014, 3, 13, 7, 0, 0, 0);
        assertEquals(5.555555555555555, Lampa.request("helper:getLessonWidth", start, end, 360, 1440));
    },
    "test non-real lesson width in percentage for 6-7 day start at 6 business hours are nonsense": function () {
        var start = new Date(2014, 3, 13, 6, 0, 0, 0);
        var end = new Date(2014, 3, 13, 7, 0, 0, 0);
        assertEquals(0, Lampa.request("helper:getLessonWidth", start, end, 360, 360));
    },
    "test getting week number": function () {
        var date = new Date(2014, 7, 21, 10, 35, 0, 0);
        assertEquals([2014, 34], Lampa.request("helper:getWeekNumber", date));
    },
    "test adding a one datetime to array ": function () {
        var date = '2011-10-13 15:00:00';
        var days = [];
        days = Lampa.request("helper:addDayToArray", days, date);
        assertEquals(['2011-10-13'], days);
    },
    "test adding a other datetime to array ": function () {
        var date = '2011-10-14 15:00:00';
        var days = [];
        days = Lampa.request("helper:addDayToArray", days, date);
        assertEquals(['2011-10-14'], days);
    },
    "test adding a two datetime to array ": function () {
        var days = [];
        days = Lampa.request("helper:addDayToArray", days, '2011-10-14 15:00:00');
        days = Lampa.request("helper:addDayToArray", days, '2012-10-15 15:00:00');
        assertEquals(['2011-10-14', '2012-10-15'], days);
    },

    "test adding null datetime to array return array": function () {
        var days = [];
        days = Lampa.request("helper:addDayToArray", days, '2012-10-15 15:00:00');
        days = Lampa.request("helper:addDayToArray", days, null);
        assertEquals(['2012-10-15'], days);
    },
    "test convert time from 00:00 to 0": function () {
        assertEquals(0, Lampa.request("helper:toMinutes", '00:00'));
    },
    "test convert time from 00:22 to 22": function () {
        assertEquals(22, Lampa.request("helper:toMinutes", '00:22'));
    },
    "test convert time from 01:02 to 62": function () {
        assertEquals(62, Lampa.request("helper:toMinutes", '01:02'));
    },
    "test convert time from 08:00 to 480": function () {
        assertEquals(480, Lampa.request("helper:toMinutes", "08:00"));
    },
    "test convert time from null to 0": function () {
        assertEquals(0, Lampa.request("helper:toMinutes", null));
    },
    "test to, how get Date object from string in format Y-M-D, 2011-01-30": function () {
        assertEquals(new Date(2011, 0, 30, 0, 0, 0, 0), Lampa.request("helper:getDateFromString", "2011-01-30"));
    },
    "test to, how get Date object from string in format Y-M-D, 2011-02-01": function () {
        assertEquals(new Date(2011, 1, 1, 0, 0, 0, 0), Lampa.request("helper:getDateFromString", "2011-02-01"));
    },
    "test getDateFromString for null returns null": function () {
        assertEquals(null, Lampa.request("helper:getDateFromString", null));
    },
    "test get year from date 2014-08-31": function () {
        assertEquals(2014, Lampa.request("helper:getYear", "2014-08-31"));
    },
    "test get year from date 2013-08-31": function () {
        assertEquals(2013, Lampa.request("helper:getYear", "2013-08-31"));
    },
    "test get year from null": function () {
        assertEquals('', Lampa.request("helper:getYear", null));
    },
    "test get dayIdentityCode for 2011-05-06": function () {
        assertEquals('D20110506', Lampa.request("helper:dayIdentityCode", '2011-05-06'));
    },
    "test convert time 12h 30min to 12:30 ": function () {
        assertEquals('12:30', Lampa.request("helper:toTime", 12, 30));
    },
    "test convert time 8h 0min to 08:00 ": function () {
        assertEquals('08:00', Lampa.request("helper:toTime", 8, 0));
    },
    "test convert time 0h 90min to 01:30 ": function () {
        assertEquals('01:30', Lampa.request("helper:toTime", 0, 90));
    },
    "test convert time 0h 540min to 09:00 ": function () {
        assertEquals('09:00', Lampa.request("helper:toTime", 0, 540));
    },
    "test convert date 10.11.2010 to date": function () {
        assertEquals('2010-11-10', Lampa.request("helper:toDate", 10, 11, 2010));
    },
    "test convert date 1.3.2015 to date": function () {
        assertEquals('2015-03-01', Lampa.request("helper:toDate", 1, 3, 2015));
    },
    "test convert 1.3.2015 10:30 to datetime": function () {
        assertEquals('2015-03-01 10:30', Lampa.request("helper:toDateTime", 1, 3, 2015, 10, 30));
    },
    "test if index 0 is January": function () {
        assertEquals("selected='selected'", Lampa.request("helper:isMonthSelected", 0, 0));
    },
    "test getMonthName 1 position is January": function () {
        assertEquals("January", Lampa.request("helper:getMonthName", 1));
    },
    "test getMonthName 12 position is December": function () {
        assertEquals("December", Lampa.request("helper:getMonthName", 12));
    },
    "test getMonthName 01 position is January": function () {
        assertEquals("January", Lampa.request("helper:getMonthName", '01'));
    },
    "test getDayAsNumber for 01 returns 1": function () {
        assertEquals(1, Lampa.request("helper:getDayAsNumber", '01'));
    },
    "test isValidDuration always return false": function () {
        assertFalse(Lampa.request("helper:isValidDuration"));
    },
    "test convert datetime 2015-02-26 10:30:00 to string": function () {
        assertEquals('26 Feb 2015 / 10:30', Lampa.request("helper:toString", '2015-02-26 10:30:00'));
    },
    "test convert datetime 2015-02-01 08:03:00 to string": function () {
        assertEquals('1 Feb 2015 / 08:03', Lampa.request("helper:toString", '2015-02-01 08:03:00'));
    },
    "test getOldestDay always returns datetime": function () {
        var days = ['2015-01-01 08:03:00', '2015-02-01 08:03:00', '2015-03-01 08:03:00', '2014-02-01 08:03:00', '2015-06-01 08:03:00'];
        var day = Lampa.request("helper:getOldestDay", days);
        assertTrue(_.isDate(day));
    },
    "test getOldestDay for empty list returns today": function () {
        var days = [];
        var toDay = new Date();
        var day = Lampa.request("helper:getOldestDay", days);
        assertEquals(day.getDay(), toDay.getDay());
        assertEquals(day.getMonth(), toDay.getMonth());
        assertEquals(day.getYear(), toDay.getYear());
    },
    "test getOldestDay always oldest datetime": function () {
        var days = ['2015-01-01 08:03:00', '2015-02-01 08:03:00', '2015-03-01 08:03:00', '2014-02-01 08:03:00', '2015-06-01 08:03:00'];
        var oldestDay = new Date(2014, 01, 01);
        var day = Lampa.request("helper:getOldestDay", days);
        assertEquals(day.toString(), oldestDay.toString());
        assertEquals(oldestDay.toString(), day.toString());
    },
    "test getLatestDay always returns datetime": function () {
        var days = ['2015-01-01 08:03:00', '2015-02-01 08:03:00', '2015-03-01 08:03:00', '2014-02-01 08:03:00', '2015-06-01 08:03:00'];
        var day = Lampa.request("helper:getLatestDay", days);
        assertTrue(_.isDate(day));
    },
    "test getLatestDay for empty list returns today": function () {
        var days = [];
        var toDay = new Date();
        var day = Lampa.request("helper:getLatestDay", days);
        assertEquals(day.getDay(), toDay.getDay());
        assertEquals(day.getMonth(), toDay.getMonth());
        assertEquals(day.getYear(), toDay.getYear());
    },
    "test getLatestDay always returns latest datetime": function () {
        var days = ['2015-01-01 08:03:00', '2016-02-01 08:03:00', '2015-03-01 08:03:00', '2014-02-01 08:03:00', '2015-06-01 08:03:00'];
        var latestDay = new Date(2016, 01, 01);
        var day = Lampa.request("helper:getLatestDay", days);
        assertEquals(latestDay.toString(), day.toString());
    },
    "test getDaysInterval always return array": function () {
        var days = Lampa.request("helper:getDaysInterval");
        assertTrue(_.isArray(days));
    },

    "test getNumberOfDaysBetween undefined from and to returns 0": function () {
        var days = Lampa.request("helper:getNumberOfDaysBetween");
        assertEquals(0, days);
    },

    "test getNumberOfDaysBetween for year interval returns 365": function () {
        var daysCount = Lampa.request("helper:getNumberOfDaysBetween", '2015-01-01', '2015-12-31');
        assertEquals(365, daysCount);
    },

    "test getDaysInterval for one year interval returns 365 items array": function () {
        var days = Lampa.request("helper:getDaysInterval", '2015-01-01', '2015-12-31');
        assertEquals(365, days.length);
    },

    "test getNextDay always returns date": function () {
        var nextDay = Lampa.request("helper:getNextDay", new Date(2015, 0, 1, 0, 0, 0, 0));
        assertTrue(_.isDate(nextDay));
    },

    "test getNextDay for 2015-01-01 return 2015-01-02": function () {
        var day = new Date(2015, 0, 1, 0, 0, 0, 0);
        var nextDay = new Date(2015, 0, 2, 0, 0, 0, 0);
        var givenDay = Lampa.request("helper:getNextDay", day);
        assertEquals(nextDay.getDate(), givenDay.getDate());
        assertEquals(nextDay.getMonth(), givenDay.getMonth());
        assertEquals(nextDay.getFullYear(), givenDay.getFullYear());
    },

    "test getDaysInterval for one year interval returns 365 items array all are string": function () {
        var days = Lampa.request("helper:getDaysInterval", '2015-01-01', '2015-12-31');
        var dates = 0;
        var i = 0;

        for (i; i < days.length; i++) {
            if (_.isString(days[i])) {
                dates++;
            }
        }
        assertEquals(365, dates);
    },

    "test getDaysInterval for year 2015 interval returns last day 31.12.2015": function () {
        var days = Lampa.request("helper:getDaysInterval", '2015-01-01', '2015-12-31');
        assertEquals('2015-12-31', days[days.length - 1]);
    },

    "test getDayCode always returns string": function () {
        assertTrue(_.isString(Lampa.request("helper:getDayCode", new Date(2015, 01, 1, 20, 5, 10, 100))));
    },

    "test getDayCode for 31.12.2015 returns 2015-12-31": function () {
        assertEquals('2015-12-31', Lampa.request("helper:getDayCode", new Date(2015, 11, 31, 20, 5, 10, 100)));
    },
    "test getDayCode for 1.2.2015 returns 2015-02-01": function () {
        assertEquals('2015-02-01', Lampa.request("helper:getDayCode", new Date(2015, 01, 1, 20, 5, 10, 100)));
    },

    "test getTodayDate for now returns Date in string format 2015-02-01": function () {
        var today = new Date();
        var month = ('00' + (today.getMonth() + 1)).substr(-2, 2);
        var day = ('00' + (today.getDate())).substr(-2, 2);

        var todayString = today.getFullYear() + '-' + month + '-' + day;
        assertEquals(todayString, Lampa.request("helper:getTodayDate"));
    },

    "test getEnd for values return nonempty string": function () {
        var endDate = Lampa.request('helper:getEnd', '2016-01-31', '10:10', 60);
        assertEquals('string', typeof endDate);
    },
    "test getEnd for values return string length is 16 characters": function () {
        var endDate = Lampa.request('helper:getEnd', '2016-01-31', '10:10', 60);
        assertEquals(16, endDate.length);
    },
    "test getEnd for valid values return datetime one hour later than input datetime": function () {
        assertEquals('2016-01-31 11:10', Lampa.request('helper:getEnd', '2016-01-31', '10:10', 60));
    },
    "test getEnd for valid values return datetime 90min later than input datetime": function () {
        assertEquals('2016-01-31 11:30', Lampa.request('helper:getEnd', '2016-01-31', '10:00', 90));
    }
});
