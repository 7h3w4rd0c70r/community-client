/**
 * Created by Roman Brhel on 30.08.2016.
 */
var Lampa = Lampa || {};

Lampa.log = function () {
    if (arguments !== null) {
        switch (arguments.length) {
            case 1:
                console.log(arguments[0]);
                break;
            case 2:
                console.log(arguments[0], arguments[1]);
                break;
            case 3:
                console.log(arguments[0], arguments[1], arguments[3]);
                break;
            default:
                console.log(arguments);
        }
    } else {
        console.error("unknown error");
    }
};

Lampa.error = function () {
    if (arguments) {
        switch (arguments.length) {
            case 1:
                console.error(arguments[0]);
                break;
            case 2:
                console.error(arguments[0], arguments[1]);
                break;
            case 3:
                console.error(arguments[0], arguments[1], arguments[3]);
                break;
            default:
                console.error(arguments);
        }
    } else {
        console.error("unknown error");
    }
};