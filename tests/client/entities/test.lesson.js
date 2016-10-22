/**
 * Created by Roman on 23.3.15.
 */

var Entities = Lampa.module('Entities');
TestCase("test lesson methods", {
    "setUp": function () {
        Lampa.request("lesson:erase-paste-lesson");
    },
    "test lesson:entity returns Object": function () {
        assertTrue(typeof (Lampa.request('lesson:entity', 45156)) === 'object');
    }
});

