/**
 * Created by Roman on 18.7.14.
 */
Lampa.module("SchoolsModule", function (SchoolsModule, Lampa, Backbone, Marionette, $, _) {
    SchoolsModule.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "school": "edit",
            "school/edit": "edit"
        }
    });
    var API = {
        before: function () {
            Lampa.trigger("page:show");
            Lampa.trigger("header:show");
        },

        show: function () {
            this.before();
            Lampa.request("page:title", 'School');
            Lampa.SchoolsModule.Show.Controller.main();
        },


        edit: function () {
            Lampa.request("page:title", 'School');
            this.before();
            Lampa.SchoolsModule.Edit.Controller.main();
        }
    };

    Lampa.on("school:show", function () {
        Lampa.navigate("school");
        API.show();
    });

    Lampa.on("school:edit", function (model) {
        Lampa.navigate("school/edit");
        return (model === null) ? API.edit() : API.editModel(model);
    });

    Lampa.addInitializer(function () {
        try {
            new SchoolsModule.Router({controller: API});
        } catch (ex) {
            console.log(ex.message);
        }
    });
});