/**
 * Created by Roman on 27.3.15.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Reminder = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity");

            return (this.get('lessonID') === null)
                ? Lampa.restUrl + "/key/" + key + "/lesson/reminder"
                : Lampa.restUrl + "/key/" + key + "/lesson/" + this.get('lessonID') + '/reminder';
        },

        idAttribute: "lessonID",
        defaults: {
            lessonID: null,
            message: ''
        }
    });

    Entities.ReminderApi = Entities.Api.extend({
        loadEntity: function (lessonID) {
            var defer = $.Deferred();
            try {
                Lampa.trigger("progressBar:show");
                var entity = new Entities.Reminder();
                entity.set('lessonID', lessonID);
                entity.fetch({
                        error: function () {
                            Lampa.trigger("progressBar:hide");
                            console.log('fetch error!');
                            defer.resolve(entity);
                        },
                        success: function () {
                            Lampa.trigger("progressBar:hide");
                            defer.resolve(entity);
                        }
                    }
                );
            }
            catch (ex) {
                console.log(ex.message);
            }
            return defer;
        }
    });

    var api = new Entities.ReminderApi();
    Lampa.reqres.setHandler("lesson:reminder", function (lessonID) {
        return api.loadEntity(lessonID);
    });
});
