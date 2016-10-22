/**
 * Created by Patrik on 20.4.16.
 */

function statusChangeCallback(response) {
    if (response.status === 'connected') {
        testAPI();
    } else if (response.status === 'not_authorized') {

    } else {

    }
}

function registerUser(response) {
    if (response.status === 'connected') {
        var user = response;
        FB.api('/me?locale=en_US&fields=first_name,last_name,name,locale,email,gender,hometown,timezone,cover,context', function (response) {
            var user = response;
        });
        var model = Lampa.request('signup:entity');
        model.set({name: user.name, email: user.email});
       // console.log(model);
    }
}

function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

function registerWithFacebook() {
    FB.getLoginStatus(function (response) {
        registerUser(response);
    });
}

window.fbAsyncInit = function () {
    FB.init({
        appId: '1680332968899016',
        xfbml: true,
        version: 'v2.6'
    });

    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function testAPI() {
    FB.api('/me?locale=en_US&fields=first_name,last_name,name,locale,email,gender,hometown,timezone,cover,context', function (response) {
       // console.log('About me >>', response);
    });
}