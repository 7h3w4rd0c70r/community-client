/**
 * Created by Roman on 12.8.14.
 */

Lampa.module("Helpers", function (Helpers, Lampa, Backbone, Marionette, $, _) {
    var API = {
        getMyAccountID: function () {
            return Lampa.request("user:accountID");
        },
        getMyName: function () {
            return Lampa.request("user:name");
        },
        getUserName: function (accountID) {
            var helper = this;
            $.when(Lampa.request("account:entity", accountID), helper).done(function (account) {
                return account.get('fullName');
            });
        },
        getUserNameClass: function (id) {
            return '<span class="created-by-' + id + '"></span>';
        },
        getShortUserName: function (name, surname, degree) {
            return this.getFullUserName(name, surname, degree).substr(0, 25);
        },
        getFullUserName: function (name, surname, degree) {
            return ((degree || '') + ' ' + (name || '') + ' ' + (surname || '')).trim();
        },
        getPublicityType: function (type) {
            return (type === 1) ? 'Public' : 'Private';
        },
        getPublicOptions: function () {
            return '<option value="0" selected>Private</option><option value="1">Public</option>';
        },
        getDescriptionTypeOptions: function () {
            return '<option value="m" selected>Mobile</option><option value="d">Home</option><option value="f">Fax</option><option value="p">Work</option>';
        },
        getTextForActiveType: function (type) {
            return type === 1 ? 'can' : "can't";
        },
        isPresented: function (status) {
            switch (status) {
                case 1:
                    return "Yes";
                case 2:
                    return "No";
            }
            return 'Not Reported';
        },
        isExcused: function (absenceID) {
            return absenceID === 1 ? 'Yes' : 'No';
        },
        getAvatarUri: function () {
            var key = Lampa.request("key:entity");
            return Lampa.restUrl + '/key/' + key + '/account/avatar/big';
        },
        getAvatarByIDUri: function (id) {
            var key = Lampa.request("key:entity");
            return Lampa.restUrl + '/key/' + key + '/account/' + id + '/avatar/big';
        },
        getAvatarUriVersioned: function () {
            return this.getAvatarUri() + "?version=" + this.getAvatarVersion();
        },
        getAvatarNewUriVersioned: function () {
            return this.getAvatarUri() + "?version=" + this.getAvatarNewVersion();
        },
        getAvatarByIDUriVersioned: function (id) {
            return this.getAvatarByIDUri(id) + "?version=" + this.getAvatarVersion();
        },
        getAvatarOnBackground: function () {
            return "background-image: url('" + this.getAvatarUriVersioned() + "');";
        },
        getNewAvatarOnBackground: function () {
            return "background-image: url('" + this.getAvatarNewUriVersioned() + "');";
        },
        getAvatarOnBackgroundByID: function (id) {
            return "background-image: url('" + this.getAvatarByIDUriVersioned(id) + "');";
        },
        getAvatarOnImgByID: function (id) {
            return this.getAvatarByIDUriVersioned(id);
        },
        getLogoUri: function () {
            return Lampa.restUrl + '/key/' + Lampa.request("key:entity") + '/school/avatar/big';
        },
        getLogoOnBackground: function () {
            return "background-image: url('" + this.getLogoUri() + "');";
        },
        isKeyValid: function (key) {
            if (key === undefined || key === null) return false;
            return (key.length === 32);
        },
        counter: 0,
        getAvatarVersion: function () {
            return this.counter + "";
        },
        getAvatarNewVersion: function () {
            return this.counter++ + "";
        },
        isPwdMatchingPolicy: function (pwd) {
            return false;
        },
        myRole: function () {
            switch (Lampa.request('role:get')) {
                case 'a':
                    return 'Admin';
                case 't':
                    return 'Teacher';
                case 's':
                    return 'Student';
                default:
                    return 'unknown';
            }
        },
        isAdmin: function () {
            var role = Lampa.request('role:get');
            return Lampa.request('role:get') == 'a';
        },
        isTeacher: function () {
            var role = Lampa.request('role:get');
            return Lampa.request('role:get') == 't';
        },
        isStudent: function () {
            var role = Lampa.request('role:get');
            return Lampa.request('role:get') == 's';
        },
        isClient: function () {
            var role = Lampa.request('role:get');
            return Lampa.request('role:get') == 'c';
        }
    };

    Lampa.reqres.setHandler("helper:getMyAccountID", function () {
        return API.getMyAccountID();
    });

    Lampa.reqres.setHandler("helper:getMyName", function () {
        return API.getMyName();
    });

    Lampa.reqres.setHandler("helper:getUserName", function (accountID) {
        return API.getUserName(accountID);
    });

    Lampa.reqres.setHandler("helper:getUserNameClass", function (accountID) {
        return API.getUserNameClass(accountID);
    });

    Lampa.reqres.setHandler("helper:getShortUserName", function (name, surname, degree) {
        return API.getShortUserName(name, surname, degree);
    });

    Lampa.reqres.setHandler("helper:getFullUserName", function (name, surname, degree) {
        return API.getFullUserName(name, surname, degree);
    });

    Lampa.reqres.setHandler("helper:getPublicityType", function (type) {
        return API.getPublicityType(type);
    });

    Lampa.reqres.setHandler("helper:getPublicOptions", function () {
        return API.getPublicOptions();
    });

    Lampa.reqres.setHandler("helper:getDescriptionTypeOptions", function () {
        return API.getDescriptionTypeOptions();
    });

    Lampa.reqres.setHandler("helper:getTextForActiveType", function (type) {
        return API.getTextForActiveType(type);
    });

    Lampa.reqres.setHandler("helper:isPresented", function (status) {
        return API.isPresented(status);
    });

    Lampa.reqres.setHandler("helper:isExcused", function (absenceID) {
        return API.isExcused(absenceID);
    });

    Lampa.reqres.setHandler("helper:getAvatarUri", function () {
        return API.getAvatarUri();
    });

    Lampa.reqres.setHandler("helper:getAvatarUriById", function (id) {
        return API.getAvatarByIDUriVersioned(id);
    });

    Lampa.reqres.setHandler("helper:getAvatarUriVersioned", function () {
        return API.getAvatarUriVersioned();
    });

    Lampa.reqres.setHandler("helper:getAvatarOnBackground", function () {
        return API.getAvatarOnBackground();
    });

    Lampa.reqres.setHandler("helper:getAvatarOnBackgroundByID", function (id) {
        return API.getAvatarOnBackgroundByID(id);
    });

    Lampa.reqres.setHandler("helper:getNewAvatarOnBackground", function () {
        return API.getNewAvatarOnBackground();
    });

    Lampa.reqres.setHandler("helper:getLogoUri", function () {
        return API.getLogoUri();
    });

    Lampa.reqres.setHandler("helper:getLogoOnBackground", function () {
        return API.getLogoOnBackground();
    });

    Lampa.reqres.setHandler("helper:isKeyValid", function (key) {
        return API.isKeyValid(key);
    });

    Lampa.reqres.setHandler("helper:getAvatarVersion", function () {
        return API.getAvatarVersion();
    });

    Lampa.reqres.setHandler("helper:getAvatarNewVersion", function () {
        return API.getAvatarNewVersion();
    });

    Lampa.reqres.setHandler("helper:isPwdMatchingPolicy", function () {
        return API.isPwdMatchingPolicy();
    });

    Lampa.reqres.setHandler("helper:getAvatarOnImgByID", function (id) {
        return API.getAvatarOnImgByID(id);
    });

    Lampa.reqres.setHandler("helper:myRole", function () {
        return API.myRole();
    });

    Lampa.reqres.setHandler("helper:isAdmin", function () {
        return API.isAdmin();
    });
});