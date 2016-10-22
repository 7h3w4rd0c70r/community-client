/**
 * Created by Roman on 23.5.14.
 */

Lampa.module("LessonsModule.List", function (List, Lampa, Backbone, Marionette, $, _) {
    List.Controller = {
        main: function (params) {
            var p = "";
            $.when(Lampa.request("role:load"), Lampa.request("account:my")).then(
                function (role, account) {
                    var request;
                    switch (role.get("role")) {
                        case "s":
                            p = "myself";
                            request = "student:lessons";
                            break;
                        case "c":
                            p = params[0] || account.get("accountID");
                            request = "student:lessons";
                            break;
                        case "t":
                            p = "myself";
                            request = "lesson:load";
                            break;
                        case "a":
                            p = params[0] || "myself";
                            request = "lesson:load";
                            break;
                        default:
                            console.log("role", role);
                    }

                    $.when(Lampa.request(request, p))
                        .then(function (collection) {
                            (new Lampa.SkeletonView()).page.show(new List.Layout({collection: collection}));
                        });
                }
            );
        }
    };
});