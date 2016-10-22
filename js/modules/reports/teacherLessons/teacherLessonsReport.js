/**
 * Created by Roman on 23.11.2015.
 */

Lampa.module("ReportsModule.TeacherLessons", function (TeacherLessons, Lampa, Backbone, Marionette) {
    TeacherLessons.Report = Marionette.Object.extend({
        getStyles: function () {
            return {
                headers: {
                    fontSize: 8,
                    alignment: 'center'
                },
                table: {
                    fontSize: 8,
                    alignment: 'left'
                },
                number: {
                    alignment: 'right'
                },
                footer: {
                    italic: true,
                    fontSize: 8
                }
            };
        },
        getLessonsTable: function (lesson) {
            var table = {
                fontSize: 7,
                headerRows: 1,
                widths: [25, 70, 61, 30, 50, 50, 50, '*', 50],
                body: [
                    ['#', 'Status', 'Date', 'Time', 'Location', 'Group', 'Duration']
                ]
            };
            var i = 0, length = lesson.length;
            for (i; i < length; i++) {
                table.body.push(this.getLessonLine(lesson[i], i));
            }
            return table;
        },
        getDurationsTable: function (duration) {
            var table = {
                headerRows: 1,
                widths: [50, 50],
                body: [
                    ['Duration', 'Count']
                ]
            };
            var i = 0, length = duration.length;
            for (i; i < length; i++) {
                table.body.push(this.getDurationLine(duration[i], i));
            }
            return table;
        },
        getLessonLine: function (item, count) {
            return [
                {text: (count + 1) + '.', alignment: 'right'},
                Lampa.request('helper:getStatusClassText', item.status, 'teacher', item.start),
                {text: Lampa.request('helper:getDatePart', item.start)},
                {text: Lampa.request('helper:getTimePart', item.start)},
                this.location[item.locationID] || '',
                this.group[item.groupID] || '',
                item.duration + ' min'
            ];
        },
        getDurationLine: function (item) {
            return [
                {text: item.duration + '', alignment: 'right'},
                {text: item.numb + '', alignment: 'right'}
            ];
        },
        getTotalLine: function (total, standardLessonDuration) {
            var units = 0;
            if (standardLessonDuration > 0) {
                units = Math.round(total.duration / standardLessonDuration);
            }

            return {
                headerRows: 0,
                widths: [190, 90],
                body: [
                    ['In Total', {text: (total.duration || 0) + ' minutes', alignment: 'right'}],
                    ['One Standard Lesson Duration', {text: standardLessonDuration + ' minutes', alignment: 'right'}],
                    ['Rounded Standard Lessons Count', {text: units + '', alignment: 'right'}]
                ]
            };
        },
        getDocumentSkeleton: function (data) {
            var parent = this;
            var creator = data.get('created');
            return {
                pageSize: 'A4',
                pageOrientation: 'portrait',
                pageMargins: [30, 70, 30, 30],     // [left, top, right, bottom] or [horizontal, vertical]
                images: {
                    'logo': 'data:image/jpeg;base64,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'
                },
                styles: parent.getStyles(),
                header: function () {
                    return {
                        columnGap: 10,
                        margin: [30, 30, 30, 30],
                        columns: [
                            {
                                image: 'logo',
                                width: 40,
                                height: 32
                            },
                            {
                                margin: [0, 0, 20, 0],
                                width: 'auto',
                                text: 'Teacher Lessons',
                                fontSize: 32,
                                bold: true
                            },
                            {
                                width: 'auto',
                                fontSize: 10,
                                stack: ['Teacher:', 'From:', 'To:']
                            },
                            {
                                width: 'auto',
                                fontSize: 10,
                                alignment: 'right',
                                stack: [data.get('fullName'), Lampa.request('helper:getDay', data.from), Lampa.request('helper:getDay', data.to)]
                            }
                        ]
                    };
                },
                footer: function (currentPage, pageCount) {
                    return {
                        margin: [20, 10, 20, 20],
                        style: 'footer',
                        columns: [
                            {
                                text: 'Printed '
                                + Lampa.request('helper:getDay', new Date())
                                + ' '
                                + Lampa.request('helper:getTime', new Date())
                                + ' by '
                                + creator.fullName
                            },
                            {
                                alignment: 'right',
                                text: [
                                    {text: currentPage.toString(), italics: true},
                                    ' of ',
                                    {text: pageCount.toString(), italics: true}
                                ]
                            }
                        ]
                    };
                },
                content: [],
                margin: [20, 0, 20, 20]
            };
        },
        group: [],
        setGroups: function (collection) {
            var parent = this;

            _.each(collection, function (group) {
                parent.group[group.groupID] = group.abbr;
            });
        },
        location: [],
        setLocations: function (collection) {
            var parent = this;
            _.each(collection, function (location) {
                parent.location[location.locationID] = location.abbr;
            });
        },
        createDocument: function (data) {
            var document = this.getDocumentSkeleton(data);

            if (data.showLessons) {
                this.setGroups(data.get('groups'));
                this.setLocations(data.get('locations'));
                document.content.push({table: this.getLessonsTable(data.get('lessons'))});
                document.content.push({text: ' '});
            }

            if (data.get('durations').length > 0) {
                document.content.push({table: this.getDurationsTable(data.get('durations'))});
                document.content.push({text: ' '});
            }

            document.content.push({table: this.getTotalLine(data.get('total'), data.standardLessonDuration || 60)});
            return document;
        }
    });

    var reportApi = new TeacherLessons.Report();

    Lampa.reqres.setHandler("TeacherLessons:GetDocument", function (data) {
        return reportApi.createDocument(data);
    });
});