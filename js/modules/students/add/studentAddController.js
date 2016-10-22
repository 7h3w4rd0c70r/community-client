/**
 * Created by Roman on 24.7.14.
 */

Lampa.module("StudentModule.Add", function (Add, Lampa, Backbone, Marionette, $) {
    Add.Controller = {
        main: function (model) {
            try {
                var skeleton = new Lampa.SkeletonView();
                skeleton.page.show(new Add.Layout({model: model}));
            }
            catch (ex) {
                console.log(ex.message);
            }
        }
    }
});