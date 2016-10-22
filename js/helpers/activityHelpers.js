/**
 * Created by Roman on 16.8.14.
 */

Lampa.module("Helpers", function (Helpers, Lampa, Backbone, Marionette, $, _) {
    Helpers.Api = Marionette.Object.extend({
        getDurationInTotal: function (from, to) {
            return from === to || to === null ? from : from + "-" + to;
        },
        setActivityIcon: function (index) {
            try {
                var element = document.getElementById("skills");
                var node = document.createElement("span").setAttribute("class", ("icon-very-big glyphicon " + this.getSkill(index)));
                element.addChild(node);
            } catch (ex) {
                console.log("error", ex);
            }
        },
        getSkill: function (index) {
            switch (index) {
                case 1:
                    return "glyphicon-pencil";
                case 2:
                    return "glyphicon-headphones";
                case 4:
                    return "glyphicon-book";
                case 8:
                    return "glyphicon-comment";
            }
            return "";
        },
        getCountOfItemsInClipboard: function () {
            return Lampa.request("activity:clipboard:count");
        }
    });

    var api = new Helpers.Api();

    Lampa.reqres.setHandler("helper:getDurationInTotal", function (from, to) {
        return api.getDurationInTotal(from, to);
    });

    Lampa.reqres.setHandler("helper:setActivityIcon", function (index) {
        api.setActivityIcon(index & 1);
        api.setActivityIcon(index & 2);
        api.setActivityIcon(index & 4);
        api.setActivityIcon(index & 8);
    });

    Lampa.reqres.setHandler("helper:getSkill", function (index) {
        return api.getSkill(index);
    });
});