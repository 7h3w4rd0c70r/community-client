/**
 * Created by Roman on 19.6.14.
 */
function setCookie(cname, cvalue, exdays) {
    try {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    catch (ex) {
        console.log(ex.message);
    }
}

function getCookie(cname) {
    try {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
    }
    catch (ex) {
        console.log(ex.message);
    }
    return "";
}
