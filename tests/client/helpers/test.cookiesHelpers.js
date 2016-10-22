/**
 * Created by romanbrhel on 08.02.15.
 */
TestCase("test cookies helpers", {
    "test deleteCookie result empty cookies": function () {
        document.cookie = "a=123456789";
        Lampa.request("helper:deleteCookie", 'a');
        assertFalse(document.cookie.indexOf("a=") === -1);
    },
    "test setCookies key, value, days is not in document before but it is after set cookies": function () {
        var key = 'test';
        Lampa.request("helper:deleteCookie", 'test');
        var value = '123456';
        assertEquals(-1, document.cookie.indexOf(key + "=" + value));
        Lampa.request("helper:setCookie", key, value);
        assertFalse(document.cookie.indexOf("test=123456") === -1);

    },
    "test getCookies after setting value return key value": function () {
        var value = '0123456789';
        document.cookie = "a=123456789";
        assertNotEquals(value, Lampa.request("helper:getCookie", "a"));

        document.cookie = "a=" + value + ";";
        assertEquals(value, Lampa.request("helper:getCookie", "a"));
    }
});