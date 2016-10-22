/**
 * Created by Roman on 14.7.14.
 */

Lampa.module("Core.Header", function (Header, Lampa, Backbone, Marionette, $, _) {
    Header.Controller = {
        main: function () {
            Lampa.headRegion.show(new Header.Layout());
        }
    };
});