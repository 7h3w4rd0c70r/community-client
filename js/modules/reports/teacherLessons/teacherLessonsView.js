/**
 * Created by Roman on 17.12.14.
 */

Lampa.module("ReportsModule.TeacherLessons", function (TeacherLessons, Lampa, Backbone, Marionette) {
    TeacherLessons.Form = Marionette.LayoutView.extend({
        template: "reports/lessons",
        className: "container",
        regions: {
            teacherRegion: "#teachers",
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
            _.forEach(teacher.get('lessons'), function (item) {
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
                        stack: ['From:', 'To:', 'Teacher:']
                    },
                    {
                        width: 'auto',
                        alignment: 'right',
                        stack: [from, to, name]
                    }
                ]
            }
        },
        createDocument: function (publishMethod) {
            try {
                var fileName = 'TeacherLessonsReport.pdf';
                var teacherID = Lampa.request('helper:getElementValue', $('#teacher'));
                var from = $('#from').val();
                var to = $('#to').val();
                var report = this;
                var standardLessonDuration = $('#duration').val() || 60;
                var showLessons = $('#lessons').is(":checked");

                $.when(Lampa.request('teacher:lessons:report', teacherID, from, to)).done(
                    function (reportData) {
                        reportData.standardLessonDuration = standardLessonDuration;
                        reportData.showLessons = showLessons;

                        var docDefinition = Lampa.request("TeacherLessons:GetDocument", reportData);
                        if (docDefinition !== null) {
                            switch (publishMethod) {
                                case 'open':
                                    pdfMake.createPdf(docDefinition).print();
                                    break;
                                case 'create':
                                    pdfMake.createPdf(docDefinition).open();
                                    break;
                                default:
                                    fileName = reportData.get('abbr') + '_Lessons_' + reportData.from + '_to_' + reportData.to + '.pdf';
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

    TeacherLessons.Teacher = Marionette.ItemView.extend({
        template: "teacher/option",
        tagName: "option",
        attributes: function () {
            var attr = {};
            if (this.model.get('personID') !== undefined) {
                attr.value = this.model.get('personID');
            }
            return attr;
        }
    });

    TeacherLessons.Teachers = Marionette.CollectionView.extend({
        template: "teacher/select",
        tagName: "select",
        childView: TeacherLessons.Teacher,
        childViewContainer: "select",
        id: "teacher",
        className: "form-control"
    });
});