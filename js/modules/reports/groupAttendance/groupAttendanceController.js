/**
 * Created by Roman on 17.12.14.
 */
Lampa.module("ReportsModule.GroupAttendance", function (GroupAttendance, Lampa, Backbone, Marionette, $) {
    GroupAttendance.Controller = {
        main: function () {
            try {
                var skeleton = new Lampa.SkeletonView();
                $.when(Lampa.request("school:entity")).done(function (model) {
                    var view = new GroupAttendance.Form({model: model});
                    skeleton.page.show(view);

                    $.when(Lampa.request("group:entities")).done(function (collection) {
                        view.groupRegion.show(new GroupAttendance.Groups({collection: collection}));
                    });
                });
            }
            catch (ex) {
                console.log(ex.message);
            }
        }
    }
});