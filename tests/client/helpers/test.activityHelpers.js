TestCase("test of all Activity Helpers", {

    "test get duration for 5 to 10 minutes ": function () {
        assertEquals('5-10', Lampa.request("helper:getDurationInTotal", 5, 10));
    },

    "test get duration for 50 to 55 minutes ": function () {
        assertEquals('50-55', Lampa.request("helper:getDurationInTotal", 50, 55));
    },

    "test get duration for equal values 50 to 50 minutes ": function () {
        assertEquals('50', Lampa.request("helper:getDurationInTotal", 50, 50));
    },

    "test get duration if second values is null": function () {
        assertEquals('50', Lampa.request("helper:getDurationInTotal", 50, null));
    }
});