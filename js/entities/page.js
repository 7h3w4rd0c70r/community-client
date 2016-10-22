/**
 * Created by Roman on 17.7.14.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Page = Backbone.Model.extend({
        defaults: {
            title: ""
        }
    });

    var page;

    Entities.PageApi = Entities.Api.extend({
        setPageEntity: function (title) {
            if (page === undefined) {
                page = new Entities.Page();
            }
            page.set('title', title);
            return page;
        },

        getPageEntity: function () {
            if (page === undefined) {
                page = new Entities.Page();
            }
            return page;
        }
    });

    var api = new Entities.PageApi();

    Lampa.reqres.setHandler("page:title", function (title) {
        return api.setPageEntity(title);
    });

    Lampa.reqres.setHandler("page:entity", function () {
        return api.getPageEntity();
    });
});