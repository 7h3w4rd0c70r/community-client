/**
 * Created by Roman on 17.12.14.
 */

Lampa.module("ReportsModule.GroupAttendance", function (GroupAttendance, Lampa, Backbone, Marionette) {
    GroupAttendance.Form = Marionette.LayoutView.extend({
        template: "reports/attendance",
        className: "container",
        regions: {
            groupRegion: "#groups",
            locationRegion: "#location",
            subjectRegion: "#course"
        },
        events: {
            "click #open": "open",
            "click #print": "print",
            "click #download": "download"
        },
        behaviors: {
            DateTimePicker: {}
        },
        getReportPage: function (report, line, pageNumber) {
            _.forEach(group.get('lessons'), function (item) {
                report.table.widths.push(20);

                var lessonTime = Lampa.request('helper:getDateFromJSON', item.start);

                line.push({
                    style: 'lessons',
                    text: [
                        {text: Lampa.request('helper:getShortDayName', lessonTime) + '    '},
                        {text: lessonTime.getDate() + '    '},
                        {text: Lampa.request('helper:getMonthShortName', lessonTime.getMonth() + 1)},
                        {text: lessonTime.getFullYear() + ''},
                        {text: Lampa.request('helper:getTime', item.start)}
                    ]
                });
            });
        },
        printHeader: function (name, from, to, logo) {
            return {
                columnGap: 10,
                margin: [0, 0, 0, 0],
                columns: [
                    {
                        image: 'logo',
                        width: 40,
                        height: 35
                    },

                    {
                        margin: [0, 0, 20, 0],
                        width: 'auto',
                        text: 'Attendance Report',
                        fontSize: 32,
                        bold: true
                    },

                    {
                        width: 'auto',
                        stack: ['From:', 'To:', 'Group:']
                    },

                    {
                        width: 'auto',
                        alignment: 'right',
                        stack: [from, to, name]
                    },
                    {
                        width: '*',
                        alignment: 'right',
                        stack: ['    Legend:', '', '']
                    },
                    {
                        width: 'auto',
                        stack: ['P', 'E']
                    },
                    {
                        width: 'auto',
                        alignment: 'right',
                        stack: ['Present', 'Excused']
                    }
                ]
            }
        },
        createDocument: function (publishMethod) {
            try {
                var fileName = 'AttendanceReport.pdf';
                var groupID = Lampa.request('helper:getElementValue', $('#group'));
                var from = $('#from').val();
                var to = $('#to').val();
                var report = this;

                $.when(Lampa.request('group:attendance', groupID, from, to)).done(
                    function (reportData) {
                        var docDefinition = Lampa.request("GroupAttendance:GetDocument", reportData);
                        if (docDefinition !== null) {
                            switch (publishMethod) {
                                case 'open':
                                    pdfMake.createPdf(docDefinition).print();
                                    break;
                                case 'create':
                                    pdfMake.createPdf(docDefinition).open();
                                    break;
                                default:
                                    fileName = reportData.get('name') + '_AttendanceReport_' + reportData.get('from') + '_' + reportData.get('to') + '.pdf';
                                    pdfMake.createPdf(docDefinition).download(fileName);
                                    break;
                            }
                        }
                    }
                )

            } catch (ex) {
                console.log(ex.message);
                alert('This report was not generated properly: ' + ex.message);
            }
        },

        print: function () {
            this.createDocument('print');
        },
        open: function () {
            this.createDocument('open');
        },
        download: function () {
            this.createDocument('download');
        }
    });

    GroupAttendance.Attendance = Marionette.LayoutView.extend({
        template: "reports/simple-attendance",
        regions: {
            subjectRegion: "#lessons",
            studentRegion: "#student"
        }
    });

    GroupAttendance.Group = Marionette.ItemView.extend({
        template: "group/option",
        tagName: "option",
        attributes: function () {
            var attr = {};
            if (this.model.get('groupID') !== undefined) {
                attr.value = this.model.get('groupID');
            }
            return attr;
        }
    });

    GroupAttendance.Groups = Marionette.CollectionView.extend({
        template: "group/select",
        tagName: "select",
        childView: GroupAttendance.Group,
        childViewContainer: "select",
        id: "group",
        className: "form-control"
    });
});