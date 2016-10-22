/**
 * Created by romanbrhel on 07.02.15.
 */

TestCase("test entity key", {
    "test setCookie 0123456789 getKeyEntity return same": function () {
        var key = '1234567890';
        Lampa.request('helper:setCookie', 'key', key, 1);
        assertEquals(key, Lampa.request("key:entity"));
    }
});
