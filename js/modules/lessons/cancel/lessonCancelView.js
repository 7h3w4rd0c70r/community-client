/**
 * Created by Roman on 24.9.14.
 */

Lampa.module("LessonsModule.Cancel", function (Cancel, Lampa, Backbone, Marionette, $) {
    Cancel.Layout = Marionette.LayoutView.extend({
        template: "lesson/cancel",
        className: "container",
        regions: {
            statusTimeRegion: "#status-time",
            groupRegion: "#group",
            locationRegion: "#location",
            courseRegion: "#course",
            teacherRegion: "#teachers"
        },
        events: {
            "click #do-cancel": "cancelLesson",
            "click #do-postpone": "postponeLesson",
            "click #do-un-postpone": "unPostponeLesson",
            "click #do-delete": "deleteLesson",
            "click #do-no-show": "noShowLesson",
            "click #back": "goBack"
        },
        initialize: function () {
            this.model = this.model || Lampa.request("lesson:current:entity");
        },
        setModel: function (column, columnType) {
            try {
                var formItem = $("#" + column);
                switch (columnType) {
                    case 'number':
                        this.model.set(column, Lampa.request("helper:toNumber", formItem));
                        break;
                    default :
                        this.model.set(column, formItem.val());
                }
            } catch (ex) {
                console.log(ex.message);
            }
        },
        cancelLesson: function (e) {
            try {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (confirm("Do you want cancel this lesson?") === true) {
                    var lesson = this.model;
                    lesson.set('action', 'cancel');
                    lesson.set('status', 100);
                    this.setModel('cancel', 'string');
                    $.when(Lampa.request("lesson:save", lesson)).done(function (model) {
                        lesson.set('action', null);
                        Lampa.trigger("lesson:show-edit", model.get('lessonID'));
                    });
                }
            }
            catch (ex) {
                console.log(ex.message);
            }
        },
        postponeLesson: function (e) {
            try {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (confirm("Do you want postpone this lesson?") === true) {
                    var lesson = this.model;
                    lesson.set('action', 'cancel');
                    lesson.set('status', 102);
                    this.setModel('cancel', 'string');
                    $.when(Lampa.request("lesson:save", lesson)).done(function (model) {
                        lesson.set('action', null);
                        Lampa.trigger("lesson:show-edit", model.get('lessonID'));
                    });
                }
            }
            catch (ex) {
                console.log(ex.message);
            }
        },
        unPostponeLesson: function (e) {
            try {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (confirm("Do you want unpostpone this lesson?") === true) {
                    var lesson = this.model;
                    lesson.set('action', 'cancel');
                    lesson.set('status', 0); //todo: get correct status
                    this.setModel('cancel', 'string');
                    $.when(Lampa.request("lesson:save", lesson)).done(function (model) {
                        lesson.set('action', null);
                        Lampa.trigger("lesson:reschedule", model.get('lessonID'));
                    });
                }
            }
            catch (ex) {
                console.log(ex.message);
            }
        },
        noShowLesson: function (e) {
            try {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (confirm("Do you want set No-Show to this lesson?") === true) {
                    var lesson = this.model;
                    lesson.set('action', 'cancel');
                    lesson.set('status', 3);
                    this.setModel('cancel', 'string');
                    $.when(Lampa.request("lesson:save", lesson)).done(function (model) {
                        lesson.set('action', null);
                        Lampa.trigger("lesson:show-edit", model.get('lessonID'));
                    });
                }
            }
            catch (ex) {
                console.log(ex.message);
            }
        },
        deleteLesson: function (e) {
            try {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                var item = this.model.get('name');
                var message = "Do you want to delete this lesson?";
                if (confirm(message + (item === null ? '' : item)) === true) {
                    this.model.destroy();
                    Lampa.trigger("lesson:default");
                }
            }
            catch (ex) {
                console.log(ex.message);
            }
        },
        goBack: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            window.history.back();
        }
    });

    Cancel.LessonStatusTime = Marionette.ItemView.extend({
        template: "lesson/bar-status-time",
        className: "panel panel-default",
        modelEvents: {"change:status": "render"}
    });

    Cancel.LessonGroup = Marionette.ItemView.extend({
        template: "lesson/bar-group",
        events: {
            "click .clickable": "show"
        },
        show: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            Lampa.trigger('group:show', this.model.get('groupID'));
        }
    });

    Cancel.LessonLocation = Marionette.ItemView.extend({
        template: "lesson/bar-location",
        className: "clickable",
        events: {
            "click": "show"
        },
        show: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            Lampa.trigger('location:show', this.model.get('locationID'));
        }
    });

    Cancel.LessonCourse = Marionette.ItemView.extend({
        template: "lesson/bar-course",
        className: "panel-default, clickable",
        events: {
            "click": "show"
        },
        show: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            Lampa.trigger('course:show', this.model.get('courseID'));
        }
    });

    Cancel.LessonNeighbours = Marionette.ItemView.extend({
        template: "lesson/neighbours"
    });

    Cancel.LessonTeacher = Marionette.ItemView.extend({
        template: "lesson/bar-teacher",
        className: "box last-box col-xs-6 col-sm-3",
        events: {
            "click .clickable": "show"
        },
        show: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            Lampa.trigger('teacher:show', this.model.get('personID'));
        }
    });

    Cancel.LessonTeachers = Marionette.CollectionView.extend({
        childView: Cancel.LessonTeacher
    });
});
