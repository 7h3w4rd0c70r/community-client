/**
 * Created by Roman on 23.6.14.
 */

Lampa.module("LessonsModule.Edit", function (Edit, Lampa, Backbone, Marionette, $) {
    Edit.Controller = {
        model: Edit.Lesson,
        show: function (layout) {
            try {
                var lessonID = layout.model.get("lessonID");
                var groupID = layout.model.get("groupID");
                var lessonPlansCopyCollection = Lampa.request("lesson:plans:copy");

                layout.buttonsRegion.show(new Edit.LessonButtons({
                    model: layout.model,
                    collection: lessonPlansCopyCollection
                }));

                $.when(Lampa.request("lesson:neighbours", lessonID)).done(
                    function (model) {
                        layout.groupRegion.show(new Edit.LessonGroup({model: model}));
                        if (model.get("lastLessonID")) {
                            $.when(Lampa.request("lesson:plans:done", model.get("lastLessonID")).done(
                                function (collection) {
                                    layout.lastPlansRegion.show(new Edit.LastLessonPlans({collection: collection}));
                                }
                            ));
                        } else {
                            layout.lastPlansRegion.show(new Edit.LastLessonPlans());
                        }
                    }
                );

                $.when(Lampa.request("lesson:header", lessonID)).done(
                    function (model) {
                        layout.headerRegion.show(new Edit.LessonHeader({model: model}));
                    }
                );

                $.when(Lampa.request("outcome:entities", lessonID)).done(
                    function (collection) {
                        layout.outcomesRegion.show(new Edit.LessonOutcomes({collection: collection}));
                    }
                );

                layout.outcomeNewRegion.show(new Edit.LessonOutcomeAdd());

                $.when(Lampa.request("location:entity", layout.model.get("locationID"))).done(
                    function (model) {
                        layout.locationRegion.show(new Edit.LessonLocation({model: model}));
                    }
                );

                $.when(Lampa.request("course:entity", layout.model.get("courseID"))).done(
                    function (model) {
                        layout.courseRegion.show(new Edit.LessonCourse({model: model}));
                    }
                );

                $.when(Lampa.request("homework:entities", lessonID)).done(
                    function (collection) {
                        var homeworkLayout = new Edit.HomeworkList({collection: collection});
                        layout.homeworkRegion.show(homeworkLayout);
                    }
                );

                $.when(Lampa.request("homework:new", lessonID)).done(
                    function (model) {
                        layout.newHomeworkRegion.show(new Edit.LessonNewHomework({model: model}));
                    }
                );

                $.when(Lampa.request("lesson:teachers", lessonID)).done(
                    function (collection) {
                        layout.teacherRegion.show(new Edit.LessonTeachers({collection: collection}));
                    }
                );

                $.when(Lampa.request("lesson:plans", lessonID)).done(
                    function (collection) {
                        layout.plansRegion.show(new Edit.LessonPlans({collection: collection}));

                        var model = Lampa.request("lesson:plan:statistics");
                        model.set("totalTime", Lampa.request("helper:getSum", collection, "duration"));
                        var view = new Edit.LessonPlanStatistics({model: model, collection: collection});
                        layout.plansStatisticsRegion.show(view);
                    }
                );

                $.when(Lampa.request("lesson:attendance:load", lessonID)).done(
                    function (collection) {
                        collection.each(function (model) {
                            if (model.get("status") === 0) {
                                model.set("status", 1);
                            }
                        });
                        var view = new Edit.LessonAttendances({collection: collection});
                        layout.attendancesRegion.show(view);
                    }
                );

                $.when(Lampa.request("lesson:dictionary:entities", lessonID)).done(
                    function (collection) {
                        layout.lessonDictionaryRegion.show(new Edit.LessonDictionary({collection: collection}));
                    }
                );

                $.when(Lampa.request("lesson:reminder", lessonID)).done(
                    function (model) {
                        layout.reminderRegion.show(new Edit.Reminder({model: model}));
                    }
                );

                $.when(Lampa.request("reminder:new", lessonID)).done(
                    function (model) {
                        layout.reminderNewRegion.show(new Edit.LessonNewReminder({model: model}));
                    }
                );

                $.when(Lampa.request("lessons:with:dictionary", groupID)).done(
                    function (collection) {
                        var layoutView = new Edit.GroupLessonDictionary();
                        layout.groupDictionaryRegion.show(layoutView);

                        layoutView.lessons.show(new Edit.GroupLessonList({collection: collection}));

                        collection.each(function (master) {
                            var masterID = master.get("lessonID");
                            var layoutId = "lesson-" + masterID;
                            layoutView.addRegion(layoutId, "#lesson-" + masterID);
                            $.when(Lampa.request("lesson:dictionary:get", masterID), layoutId).done(
                                function (dictionary, region) {
                                    layoutView[region].show(new Edit.LessonDictionaryList({collection: dictionary}));
                                }
                            );
                        });
                    }
                );

                var lessonNewPlanItemView = new Edit.LessonNewPlanItem({model: Lampa.request("lesson:plan:new-item", lessonID)});
                layout.plansNewItemRegion.show(lessonNewPlanItemView);
                layout.lessonAddDictionaryItemRegion.show(new Edit.LessonNewDictionaryItem());
                layout.statusTimeRegion.show(new Edit.LessonStatusTime({model: layout.model}));
                layout.pasteLessonRegion.show(new Edit.PasteLesson({model: Lampa.request("lesson-paste:get")}));
            } catch (ex) {
                console.log(ex.message);
            }
        },
        main: function (model) {
            try {
                this.model = model;
                var layout = new Edit.Layout({model: model});

                layout.on("show", function () {
                    Edit.Controller.show(layout);
                });

                (new Lampa.SkeletonView()).page.show(layout);
            } catch (ex) {
                console.log(ex.message);
            }
        }
    };
});
