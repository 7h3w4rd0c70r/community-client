/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("GroupsModule.Edit", function (Edit, Lampa, Backbone, Marionette, $, _) {
    Edit.Controller = {
        main: function (model) {
            try {
                $.when(Lampa.request("school:entity")).done(function () {
                    (new Lampa.SkeletonView()).page.show(new Edit.Group({model: model}));
                });
            }
            catch (ex) {
                console.log(ex.message);
            }
        }
    };
});