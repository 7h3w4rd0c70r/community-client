TestCase("test user helpers", {
    "test getShortUserName short teacher name for real name": function () {
        assertEquals('roman brhel', Lampa.request("helper:getShortUserName", 'roman', 'brhel', null));
    },
    "test getShortUserName short teacher name for real name with degree": function () {
        assertEquals('Ing. roman brhel', Lampa.request("helper:getShortUserName", 'roman', 'brhel', 'Ing.'));
    },
    "test get short teacher name for long name with": function () {
        assertEquals('Milagros Judith Blazek Ab', Lampa.request("helper:getShortUserName", 'Milagros Judith', 'Blazek Abon', null));
    },
    "test get getTextForActiveType fot type 1": function () {
        assertEquals('can', Lampa.request("helper:getTextForActiveType", 1));
    },
    "test get getTextForActiveType fot type 0": function () {
        assertEquals("can't", Lampa.request("helper:getTextForActiveType", 0));
    },
    "test if isPresented return for status 0 value Yes ": function () {
        assertEquals("Not Reported", Lampa.request("helper:isPresented", 0));
    },
    "test if isPresented return for status 1 value Yes ": function () {
        assertEquals("Yes", Lampa.request("helper:isPresented", 1));
    },
    "test if isPresented return for status 2 value No ": function () {
        assertEquals("No", Lampa.request("helper:isPresented", 2));
    },
    "test if isExcused return for status 1 value Yes ": function () {
        assertEquals("Yes", Lampa.request("helper:isExcused", 1));
    },
    "test if isExcused return for status 0 value No": function () {
        assertEquals("No", Lampa.request("helper:isExcused", 0));
    },
    "test if isPresented return for status 0 value Not Reported ": function () {
        assertEquals("Not Reported", Lampa.request("helper:isPresented", 0));
    },
    "test author for id return for span with id ": function () {
        assertEquals('<span class="created-by-0"></span>', Lampa.request("helper:getUserNameClass", 0));
    },
    "test getDescriptionTypeOptions always return options for Description": function () {
        var options = '<option value="m" selected>Mobile</option><option value="d">Home</option><option value="f">Fax</option><option value="p">Work</option>';
        assertEquals(options, Lampa.request("helper:getDescriptionTypeOptions"));
    },
    "test getPublicOptions always return options for Public/Private": function () {
        var options = '<option value="0" selected>Private</option><option value="1">Public</option>';
        assertEquals(options, Lampa.request("helper:getPublicOptions"));
    },

    "test getAvatarUri for key return uri": function () {
        Lampa.request('helper:setCookie', 'key', '1234567890', 1);
        var options = Lampa.restUrl + '/key/1234567890/account/avatar/big';
        assertEquals(options, Lampa.request("helper:getAvatarUri"));
    },
    "test getAvatarOnBackground for key return uri": function () {
        Lampa.request('helper:setCookie', '1234567890', 1);
        var options = "background-image: url('" + Lampa.restUrl + "/key/1234567890/account/avatar/big?version=";
        var response = Lampa.request("helper:getAvatarOnBackground");
       assertEquals(0,response.lastIndexOf(options));
    },

    "test getLogoUri for key return uri": function () {
        Lampa.request('helper:setCookie', '1234567890', 1);
        var options = Lampa.restUrl + '/key/1234567890/school/avatar/big';
        assertEquals(options, Lampa.request("helper:getLogoUri"));
    },
    "test getLogoOnBackground for key return uri": function () {
        Lampa.request('helper:setCookie', '1234567890', 1);
        var options = "background-image: url('" + Lampa.restUrl + "/key/1234567890/school/avatar/big');";
        assertEquals(options, Lampa.request("helper:getLogoOnBackground"));
    },
    "test isKeyValid for null key return false": function () {
        assertFalse(Lampa.request('helper:isKeyValid', null));
    },
    "test isKeyValid for valid key return true": function () {
        assertTrue(Lampa.request('helper:isKeyValid', 'edc59edfe82416d97ed21a8175cd6505'));
    },
    "test isKeyValid for small sized key return false": function () {
        assertFalse(Lampa.request('helper:isKeyValid', '505'));
    },
    "test getVersion always return string": function () {
        var stamp = Lampa.request('helper:getAvatarVersion');
        assertTrue(_.isString(stamp));
    },
    "test getNewVersion always return string": function () {
        var stamp = Lampa.request('helper:getAvatarNewVersion');
        assertTrue(_.isString(stamp));
    },
    "test getVersion always return same values": function () {
        var stamp1 = Lampa.request('helper:getAvatarVersion');
        var stamp2 = Lampa.request('helper:getAvatarVersion');
        assertEquals(stamp1, stamp2);
    },
    "test getNewVersion always return different values": function () {
        var stamp1 = Lampa.request('helper:getAvatarNewVersion');
        var stamp2 = Lampa.request('helper:getAvatarNewVersion');
        assertNotEquals(stamp1, stamp2);
    }
});
