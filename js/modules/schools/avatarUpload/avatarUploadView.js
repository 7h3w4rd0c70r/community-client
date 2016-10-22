/**
 * Created by Roman on 24.7.14.
 */


Lampa.module("SchoolsModule.AvatarUpload", function (AvatarUpload, Lampa, Backbone, Marionette) {
    AvatarUpload.File = Marionette.LayoutView.extend({
        template: "school/upload",

        modelEvents: {
            'change': 'showFile'
        },

        ui: {
            "form": "#attachment-upload",
            "file": "#attachment",
            "button": "#upload",
            "response": "#responce"
        },

        events: {
            "submit": "upload",
            "change @ui.file": "showFile",
            "load @ui.response": "loaded"
        },

        loaded: function (e) {
            alert('onload');
        },

        showFile: function (e) {
            //  this.render();
        },

        upload: function (e) {
            Lampa.trigger("progressBar:show");
        }
    });

    Lampa.on("avatar:load", function () {
        Lampa.trigger("progressBar:hide");
        $(".avatar").css("background-image",
            "url('" + Lampa.request("helper:getAvatarUri") + "?ver="+Lampa.request('helper:getAvatarNewVersion')+"')"
        );
    });
});

function onLoadFinish(frame) {
    Lampa.trigger('avatar:load');
}