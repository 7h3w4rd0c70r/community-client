TestCase("test form helpers", {
    "test getImageNumberFromPath for 0": function () {
        var imageNumber = Lampa.request("helper:getImageNumberFromPath", 'images/activity/activity-0.svg');
        assertEquals("0", imageNumber);
    },
    "test getImageNumberFromPath for 1": function () {
        var imageNumber = Lampa.request("helper:getImageNumberFromPath", 'images/activity/activity-1.svg');
        assertEquals("1", imageNumber);
    },
    "test getImageNumberFromPath for 22": function () {
        var imageNumber = Lampa.request("helper:getImageNumberFromPath", 'images/activity/activity-22.svg');
        assertEquals("22", imageNumber);
    },
    "test if ToNumber returns 0 for off": function () {
        assertEquals(0, Lampa.request("helper:toNumber", $('<input type="checkbox" />')));
    },
    "test if ToNumber returns 1 for on": function () {
        assertEquals(1, Lampa.request("helper:toNumber", $('<input type="checkbox" checked="checked" />')));
    },
    "test if ToNumber returns 1 for Select": function () {
        assertEquals(1, Lampa.request("helper:toNumber", $('<select><option value="0">zero</option><option value="1" selected>One</option></select>')));
    },
    "test get name and description with divider A - Ahoj": function () {
        assertEquals('A - Ahoj', Lampa.request("helper:getNameAndDescriptionName", 'A', 'Ahoj'));
    },
    "test get name and null description with divider A -  ": function () {
        assertEquals('A', Lampa.request("helper:getNameAndDescriptionName", 'A', ''));
    },
    "test getElementValue text value from input element": function () {
        var element = $('<input type="text" value="ABCD">');
        assertEquals('ABCD', Lampa.request("helper:getElementValue", element));
    },
    "test getElementValue for numeric value from input element": function () {
        var element = $('<input type="numeric" value="124">');
        assertEquals(124, Lampa.request("helper:getElementValue", element));
    },
    "test getElementValue for numeric value from select element": function () {
        var element = $('<select>' +
            '<option value="1">A</option>' +
            '<option value="2" selected="selected">B</option>' +
            '<option value="3">C</option>' +
            '</select>');
        assertEquals(2, Lampa.request("helper:getElementValue", element));
    },
    "test getElementValue for string value from select element": function () {
        var element = $('<select>' +
            '<option value="a">A</option>' +
            '<option value="b" selected="selected">B</option>' +
            '<option value="c">C</option>' +
            '</select>');
        assertEquals("b", Lampa.request("helper:getElementValue", element));
    },
    "test revert params string": function () {
        var obj = {teacher: 2614, location: 456};
        var nObj = Lampa.request("helper:QueryStringToHash", 'teacher=2614&location=456');
        assertEquals(obj.teacher, nObj.teacher);
        assertEquals(obj.location, nObj.location);
    },
    "test isChecked for 0 returns empty string": function () {
        assertEquals("", Lampa.request("helper:isChecked", 0));
    },
    "test isChecked for '0' returns empty string": function () {
        assertEquals("", Lampa.request("helper:isChecked", '0'));
    },
    "test isChecked for 1 returns checked": function () {
        assertEquals(" checked ", Lampa.request("helper:isChecked", 1));
    },
    "test isChecked for '1' returns checked": function () {
        assertEquals(" checked ", Lampa.request("helper:isChecked", '1'));
    },
    "test isChecked for true returns checked": function () {
        assertEquals(" checked ", Lampa.request("helper:isChecked", true));
    },
    "test getOppositeValue for true returns false": function () {
        assertFalse(Lampa.request("helper:getOppositeValue", true));
    },
    "test getOppositeValue for false returns true": function () {
        assertTrue(Lampa.request("helper:getOppositeValue", false));
    },
    "test getschoolTypeDescription for value 3 return Language School": function () {
        assertEquals('Language School', Lampa.request("helper:getschoolTypeDescription", 3));
    },
    "test getschoolTypeDescription for value 1 return Independent Teacher": function () {
        assertEquals('Independent Teacher', Lampa.request("helper:getschoolTypeDescription", 1));
    },
    "test getschoolTypeDescription for value empty value return empty string": function () {
        assertEquals('', Lampa.request("helper:getschoolTypeDescription"));
    },
    "test isNotEmpty for null value return false": function () {
        assertFalse(Lampa.request("helper:isNotEmpty", null));
    },
    "test isNotEmpty for text value return true": function () {
        assertTrue(Lampa.request("helper:isNotEmpty", 'ABC'));
    },
    "test isNotEmpty for empty text value return false": function () {
        assertFalse(Lampa.request("helper:isNotEmpty", ''));
    },
    "test isNotEmpty for only spaces text value return false": function () {
        assertFalse(Lampa.request("helper:isNotEmpty", '     '));
    },
    "test replaceNewlinesByBreaks for text with no spaces and no new lines return same text": function () {
        var value = 'abcdaabcd';
        assertEquals(value, Lampa.request("helper:replaceNewlinesByBreaks", value));
    },
    "test replaceNewlinesByBreaks for text with spaces on begin and end with no new lines return trimmed text": function () {
        assertEquals('abcdaabcd', Lampa.request("helper:replaceNewlinesByBreaks", '   abcdaabcd   '));
    },
    "test replaceNewlinesByBreaks for text with new lines return text with </br> instead": function () {
        var value = 'abcd\naabcd';
        assertEquals('abcd<br/>aabcd', Lampa.request("helper:replaceNewlinesByBreaks", value));
    },
    "test getSum for collection 1,2,3 sum return 6": function () {
        var collection = new Backbone.Collection([
            {duration: 1},
            {duration: 2},
            {duration: 3}
        ]);
        assertEquals(6, Lampa.request("helper:getSum", collection, 'duration'));
    },
    "test getSum for collection 10,20,3 sum return 33": function () {
        var collection = new Backbone.Collection([
            {duration: 10},
            {duration: 20},
            {duration: 3}
        ]);
        assertEquals(33, Lampa.request("helper:getSum", collection, 'duration'));
    },
    "test getSum for collection '10',20,3 sum return 33": function () {
        var collection = new Backbone.Collection([
            {duration: '10'},
            {duration: 20},
            {duration: 3}
        ]);
        assertEquals(33, Lampa.request("helper:getSum", collection, 'duration'));
    },
    "test getSortAndOrder always return string": function () {
        assertEquals("string", typeof Lampa.request("helper:getSortAndOrder"));
    },
    "test getSortAndOrder for key == value return string with span": function () {
        assertEquals(0, Lampa.request("helper:getSortAndOrder", "term", "term").lastIndexOf("<span "));
    },
    "test getSortAndOrder for key !== value returns empty string": function () {
        assertEquals("", Lampa.request("helper:getSortAndOrder", "termA", "termB"));
    },
    "test getSortAndOrder foe  key == value and order == descending return include triangle-bottom": function () {
        assertTrue(Lampa.request("helper:getSortAndOrder", "term", "term", "descending").lastIndexOf("triangle-bottom") > 0);
    },
    "test getSortAndOrder foe  key == value and order == ascending return include triangle-top": function () {
        assertTrue(Lampa.request("helper:getSortAndOrder", "term", "term", "ascending").lastIndexOf("triangle-top") > 0);
    }
});