/**
 * Created by Roman on 18.7.14.
 */

Lampa.module("SchoolsModule.Show", function (Show, Lampa, Backbone, Marionette, $, _) {
    Show.School = Lampa.EditableItemViewShow.extend({
        template: "school/show",
        className: "container",
        entity: 'school'
    });
});