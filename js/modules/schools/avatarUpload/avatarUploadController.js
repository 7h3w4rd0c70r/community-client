/**
 * Created by Roman on 24.7.14.
 */


Lampa.module("SchoolsModule.AvatarUpload", function (AvatarUpload, Lampa, Backbone, Marionette, $, _) {
    AvatarUpload.Controller = {
        main: function (model) {
            var skeleton = new Lampa.SkeletonView();
            skeleton.page.show(new AvatarUpload.File({model: model}));
        }
    };
});