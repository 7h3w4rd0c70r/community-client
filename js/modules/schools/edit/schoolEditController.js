/**
 * Created by Roman on 18.7.14.
 */

Lampa.module("SchoolsModule.Edit", function (Edit, Lampa, Backbone, Marionette, $, _) {
    Edit.Controller = {
        main: function (model) {
            try {
                var skeleton = new Lampa.SkeletonView();
                $.when(Lampa.request("school:entity")).done(function (model) {
                    skeleton.page.show(new Edit.School({model: model}));
                });
            }
            catch (ex) {
                console.log(ex.message);
            }
        }
    }
});
