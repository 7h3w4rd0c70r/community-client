/**
 * Created by Roman on 15.12.14.
 */

Lampa.module("CommunityModule.Ask", function (Ask, Lampa, Backbone, Marionette, $, _) {
    Ask.Controller = {
        asks: function () {
            try {
                (new Lampa.SkeletonView()).page.show(new Ask.Index({ }));
            }
            catch (ex) {
                console.log(ex.message);
            }
        },
        ask: function (askID) {
            try {
                Lampa.request('ask:entity', askID).then(function (ask) {
                    (new Lampa.SkeletonView()).page.show(new Ask.Ask({
                        model: ask,
                        _caller: 'controller.ask'
                    }));
                });
            }
            catch (ex) {
                console.log(ex);
            }
        },
        edit: function (type, id) {
            try {
                Lampa.trigger('progressBar:show');
                var skeleton = new Lampa.SkeletonView();
                $.when(Lampa.request('AAC:edit', type, id)).done(function (entity) {
                    skeleton.page.show(new Ask.Edit({
                        model: entity,
                        type: type
                    }));
                    Lampa.request('progressBar:hide');
                });
            }
            catch (ex) {
                console.log(ex);
            }
        }
    }
});