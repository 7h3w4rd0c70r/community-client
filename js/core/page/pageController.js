/**
 * Created by Roman on 17.7.14.
 */
Lampa.module("Core.Page", function (Page, Lampa, Backbone, Marionette, $, _) {
    Page.Controller = {
        show: function () {
            try {
                //var model = Lampa.request("page:entity");
                //var view = new Page.View({model: model});
                //Lampa.pageNameRegion.show(view);
            } catch (ex) {
                console.log(ex.message);
            }
        }
    };
});