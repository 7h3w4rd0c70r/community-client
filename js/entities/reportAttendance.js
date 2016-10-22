/**
 * Created by Roman on 17.12.14.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.ReportAttendance = Backbone.Model.extend({
        url: '',
        defaults: {
            title: "",
            start: "",
            end: ""
        }
    });

    Entities.ReportAttendanceApi = Entities.Api.extend({
        loadEntity: function () {
            var params = new Entities.ReportAttendance();
            params.set('groups', Lampa.request('groups:entities'));
            params.set('start', Lampa.request('period:firstDay'));
            params.set('end', Lampa.request('period:lastDay'));
            return params;
        }
    });

    var api = new Entities.ReportAttendanceApi();

    Lampa.reqres.setHandler("report:attendance", function () {
        return api.loadEntity();
    });
});
