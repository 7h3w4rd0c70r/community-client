/**
 * Created by Roman on 18.7.14.
 */

Lampa.module("SchoolsModule.Show", function (Show, Lampa, Backbone, Marionette, $, _) {
    Show.Controller = {
        main: function (id) {
            try {
                var skeleton = new Lampa.SkeletonView();                
                $.when(Lampa.request("school:entity")).done(function (model) {
                    skeleton.page.show(new Show.School({model: model}));
                });
            }
            catch (ex) {
                console.log(ex.message);
            }
        }
    }
});
