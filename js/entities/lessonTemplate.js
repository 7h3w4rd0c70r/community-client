/**
 * Created by Roman on 11.7.14.
 */

Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {

    Entities.LessonTemplate = Backbone.Model.extend(
        {
            url: function () {
                var key = Lampa.request("key:entity");

                return (this.get('templateId') === null)
                    ? Lampa.restUrl + "/rest/key/" + key + "/lessonTemplate"
                    : Lampa.restUrl + "/key/" + key + "/lessonTemplate/" + this.get('templateId');
            },

            idAttribute: "templateId",

            defaults: {
                templateId: null,
                created: null,
                createdBy: 0,
                status: 0,
                title: '',
                duration: 0,
                descriptionA: '',
                descriptionB: '',
                descriptionC: '',
                materials: ''
            }
        });

    Entities.LessonTemplates = Backbone.Collection.extend({
        model: Entities.LessonTemplate,
        query: null,
        comparator: "templateId",
        offset: 0,
        rows: 1000,
        search: '',
        url: function () {
            var key = Lampa.request("key:entity");

            if (this.search === null) {
                this.search = '';
            }
            return Lampa.restUrl + "/key/" + key
                + "/lessonTemplates?offset=" + this.offset + '&rows=' + this.rows + '&search=' + this.search;
        }
    });

    var lessonTemplates = null;

    var loadEntities = function (search) {
        Lampa.trigger("progressBar:show");

        if (lessonTemplates === null) {
            lessonTemplates = new Entities.LessonTemplates();
        }

        lessonTemplates.fetch({
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    throw new Error('error model - not found', '');
                },
                success: function () {
                    Lampa.trigger("progressBar:hide");
                }
            }
        )
    };

    Entities.LessonTemplatesApi = Entities.Api.extend({
        search: '',

        getLessonTemplateEntities: function (search) {
            loadEntities(search);
            return lessonTemplates;
        },

        getNewLessonTemplateEntity: function () {
            return new Entities.LessonTemplate();
        },

        saveEntity: function (entity) {
            Lampa.trigger("progressBar:show");

            entity.save(null, {
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    Lampa.trigger("error", this);
                },
                success: function () {
                    try {
                        Lampa.trigger("progressBar:hide");
                    }
                    catch (ex) {
                        console.log(ex.message);
                    }
                }
            });
        },

        deleteEntity: function (entity) {
            var message = 'DELETE Template "' + entity.get('title') + '"\n' + 'Are you sure?';

            if (confirm(message) === true) {
                Lampa.trigger("progressBar:show");
                entity.destroy({
                    error: function () {
                        Lampa.trigger("error", this);
                    },
                    success: function () {
                        window.history.back();
                    }
                });
                Lampa.trigger("progressBar:hide");
            }
        },

        getPeriodEntity: function (id) {
            Lampa.trigger("progressBar:show");
            var entity = new Entities.LessonTemplate();
            entity.set('templateId', id);

            entity.fetch({
                    error: function () {
                        console.log('fetch error!')
                    }
                }
            );
            Lampa.trigger("progressBar:hide");
            return entity;
        },

        logout: function () {
        }
    });

    var api = new  Entities.LessonTemplatesApi();

    Lampa.reqres.setHandler("lessonTemplates:entities", function (search) {
        return api.getLessonTemplateEntities(search);
    });

    Lampa.reqres.setHandler("lessonTemplates:clear", function () {
        return api.logout();
    });

    Lampa.reqres.setHandler("lessonTemplate:new", function () {
        return api.getNewLessonTemplateEntity();
    });

    Lampa.reqres.setHandler("lessonTemplate:entity", function (id) {
        return api.getPeriodEntity(id);
    });

    Lampa.reqres.setHandler("lessonTemplate:save", function (entity) {
        return api.saveEntity(entity);
    });

    Lampa.reqres.setHandler("lessonTemplate:delete", function (entity) {
        return api.deleteEntity(entity);
    });
});