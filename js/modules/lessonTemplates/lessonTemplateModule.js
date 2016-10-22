/**
 * Created by Roman on 14.7.14.
 */

Lampa.module("LessonTemplateModule", function (LessonTemplateModule, Lampa, Backbone, Marionette, $, _) {

    LessonTemplateModule.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "lessonTemplates": "showLessonTemplateListView",
            "lessonTemplate/add": "addLessonTemplate",
            "lessonTemplate/:id": "showLessonTemplate",
            "lessonTemplate/edit/:id": "editLessonTemplate"
        }
    });

    var API = {
        before: function () {
            Lampa.trigger("page:show");
            Lampa.trigger("header:show");
        },

        showLessonTemplateListView: function () {
            this.before();
            Lampa.request("page:title", 'Lesson Templates List');
            Lampa.LessonTemplateModule.List.Controller.listLessonTemplates();
        },

        addLessonTemplate: function () {
            this.before();
            Lampa.request("page:title", 'New Lesson Template');
            Lampa.LessonTemplateModule.Add.Controller.addLessonTemplate();
        },

        showLessonTemplate: function (id) {
            this.before();
            Lampa.request("page:title", 'Lesson Template');
            Lampa.LessonTemplateModule.Show.Controller.showLessonTemplate(id);
        },
        editLessonTemplate: function (id) {
            Lampa.request("page:title", 'Lesson Template / edit');
            this.before();
            Lampa.LessonTemplateModule.Edit.Controller.editLessonTemplate(id);
        }
    };

    Lampa.on("lessonTemplate:default", function () {
        Lampa.trigger("lessonTemplate:list");
    });

    Lampa.on("lessonTemplate:list", function () {
        Lampa.navigate("lessonTemplates");
        API.showLessonTemplateListView();
    });

    Lampa.on("lessonTemplate:add", function () {
        Lampa.navigate("lessonTemplate/add");
        API.addLessonTemplate();
    });

    Lampa.on("lessonTemplate:show", function (id) {
        Lampa.navigate("lessonTemplate/" + id);
        API.showLessonTemplate(id);
    });

    Lampa.on("lessonTemplate:edit", function (id) {
        Lampa.navigate("lessonTemplate/edit/" + id);
        API.editLessonTemplate(id);
    });

    Lampa.addInitializer(function () {
        new LessonTemplateModule.Router({
            controller: API
        })
    });

});