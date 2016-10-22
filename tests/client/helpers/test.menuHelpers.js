TestCase("test of all Menu Helpers", {
    "test not equal values returns empty string ": function () {
        assertEquals('', Lampa.request("helper:isSelected", 'a', 'b'));
    },
    "test equal values returns class selected string": function () {
        assertEquals('selected', Lampa.request("helper:isSelected", 'a', 'a'));
    },
    "test isOpened for not selected item return class sub-menu closed": function () {
        assertEquals('sub-menu closed', Lampa.request("helper:isOpened", 'x', 'a,b,c'));
    },
    "test isOpened for not empty item return class sub-menu closed": function () {
        assertEquals('sub-menu closed', Lampa.request("helper:isOpened", '', 'a,b,c'));
    },
    "test isOpened for space return class sub-menu closed": function () {
        assertEquals('sub-menu closed', Lampa.request("helper:isOpened", ' ', 'a,b,c'));
    },
    "test isOpened for selected item return class sub-menu opened": function () {
        assertEquals('sub-menu opened', Lampa.request("helper:isOpened", 'b', 'a,b,c'));
    },

    "test isActive for selected item return class active": function () {
        assertEquals('active', Lampa.request("helper:isActive", 'group-list-link', 'group-list-link,group-add-link'));
    }
});