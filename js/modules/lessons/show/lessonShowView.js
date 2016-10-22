Lampa.module("LessonsModule.Show", function (Show, Lampa, Backbone, Marionette, $) {
    Show.Lesson = Marionette.LayoutView.extend({
        template: "lesson/show",
        className: "container",
        regions: {
            statusTimeRegion: "#status-time",
            groupRegion: "#group",
            locationRegion: "#location",
            courseRegion: "#course",
            teacherRegion: "#teachers",
            headerRegion: "#header",
            outcomesRegion: "#outcomes",
            plansRegion: "#plans",
            plansStatisticsRegion: "#plan-statistics",
            lastPlansRegion: "#last-plan-detail",
            attendancesRegion: "#lesson-attendance",
            homeworkRegion: "#homework-area",
            lessonDictionaryRegion: "#lesson-dictionary",
            groupDictionaryRegion: "#group-dictionary",
            buttonsRegion: "#buttons"
        },

        ui: {},
        onShow: function () {
            try {
                var _this = this;
                var lessonID = _this.model.get('lessonID');
                var groupID = _this.model.get('groupID');

                _this.statusTimeRegion.show(new Show.LessonStatusTime({model: _this.model}));

                $.when(Lampa.request("lesson:neighbours", lessonID)).done(
                    function (model) {
                        _this.groupRegion.show(new Show.LessonGroup({model: model}));
                        if (model.get('lastLessonID')) {
                            $.when(Lampa.request("lesson:plans:done", model.get('lastLessonID')).done(
                                function (collection) {
                                    _this.lastPlansRegion.show(new Show.LastLessonPlans({collection: collection}));
                                }
                            ));
                        } else {
                            _this.lastPlansRegion.show(new Show.LastLessonPlans());
                        }
                    }
                );

                $.when(Lampa.request("lesson:header", lessonID)).done(
                    function (model) {
                        _this.headerRegion.show(new Show.LessonHeader({model: model}));
                    }
                );

                $.when(Lampa.request("location:entity", _this.model.get('locationID'))).done(
                    function (model) {
                        _this.locationRegion.show(new Show.LessonLocation({model: model}));
                    }
                );

                $.when(Lampa.request("course:entity", _this.model.get('courseID'))).done(
                    function (model) {
                        _this.courseRegion.show(new Show.LessonCourse({model: model}));
                    }
                );

                $.when(Lampa.request("homework:entities", lessonID)).done(
                    function (collection) {
                        var homeworkLayout = new Show.HomeworkList({collection: collection});
                        _this.homeworkRegion.show(homeworkLayout);
                    }
                );

                $.when(Lampa.request("lesson:teachers", lessonID)).done(
                    function (collection) {
                        _this.teacherRegion.show(new Show.LessonTeachers({collection: collection}));
                    }
                );

                $.when(Lampa.request("lesson:plans", lessonID)).done(
                    function (collection) {
                        _this.plansRegion.show(new Show.LessonPlans({collection: collection}));

                        var model = Lampa.request("lesson:plan:statistics");
                        model.set("totalTime", Lampa.request("helper:getSum", collection, "duration"));
                        var view = new Show.LessonPlanStatistics({model: model, collection: collection});
                        _this.plansStatisticsRegion.show(view);
                    }
                );

                $.when(Lampa.request("lesson:attendance:load", lessonID)).done(
                    function (collection) {
                        collection.each(function (model) {
                            if (model.get("status") === 0) {
                                model.set("status", 1);
                            }
                        });
                        var view = new Show.LessonAttendances({collection: collection});
                        _this.attendancesRegion.show(view);
                    }
                );

                $.when(Lampa.request("lesson:dictionary:entities", lessonID)).done(
                    function (collection) {
                        _this.lessonDictionaryRegion.show(new Show.LessonDictionary({collection: collection}));
                    }
                );

                $.when(Lampa.request("lessons:with:dictionary", groupID)).done(
                    function (collection) {
                        var layoutView = new Show.GroupLessonDictionary();
                        _this.groupDictionaryRegion.show(layoutView);

                        layoutView.lessons.show(new Show.GroupLessonList({collection: collection}));

                        collection.each(function (master) {
                            var masterID = master.get("lessonID");
                            var layoutId = "lesson-" + masterID;
                            layoutView.addRegion(layoutId, "#lesson-" + masterID);
                            $.when(Lampa.request("lesson:dictionary:get", masterID), layoutId).done(
                                function (dictionary, region) {
                                    layoutView[region].show(new Show.LessonDictionaryList({collection: dictionary}));
                                }
                            );
                        });
                    }
                );
            } catch (ex) {
                console.log(ex.message);
            }
        }
    });

    Show.None = Marionette.ItemView.extend({
        template: "lesson/none",
        className: "well well-sm",
        tagName: "li"
    });

    Show.LessonStatusTime = Marionette.ItemView.extend({
        template: "lesson/bar-status-time",
        className: "panel panel-default",
        modelEvents: {"change:status": "render"}
    });

    Show.LessonGroup = Marionette.ItemView.extend({
        template: "lesson/bar-group",
        events: {
            "click .clickable": "show"
        },
        show: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("group:show", this.model.get("groupID"));
        }
    });

    Show.LessonLocation = Marionette.ItemView.extend({
        template: "lesson/bar-location",
        className: "clickable",
        events: {
            "click": "show"
        },
        show: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("location:show", this.model.get("locationID"));
        }
    });

    Show.LessonCourse = Marionette.ItemView.extend({
        template: "lesson/bar-course",
        className: "panel-default, clickable",
        events: {
            "click": "show"
        },
        show: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("course:show", this.model.get("courseID"));
        }
    });

    Show.LessonNeighboursAccess = Marionette.ItemView.extend({
        template: "lesson/lesson-neighbours-template"
    });

    Show.LessonPlanStatisticsChild = Marionette.ItemView.extend({
        template: "core/empty"
    });

    Show.LessonPlanStatistics = Marionette.CompositeView.extend({
        template: "lesson/plans-statistics",
        childView: Show.LessonPlanStatisticsChild,
        childViewContainer: "div",
        counter: 0,
        collectionEvents: {
            "change": "recount"
        },
        recount: function () {
            this.model.set("totalTime", Lampa.request("helper:getSum", this.collection, "duration"));
        },
        modelEvents: {
            "change:totalTime": "render"
        }
    });

    Show.LastLessonPlanItem = Marionette.ItemView.extend({
        tagName: "li",
        template: "lesson/plan-item-done"
    });

    Show.LastLessonNothingDone = Marionette.ItemView.extend({
        tagName: "li",
        template: "lesson/plan-nothing"
    });

    Show.LastLessonPlans = Marionette.CompositeView.extend({
        template: "lesson/plans-done",
        childView: Show.LastLessonPlanItem,
        emptyView: Show.LastLessonNothingDone,
        childViewContainer: "ul"
    });

    Show.LessonPlanItem = Lampa.EditableItemView.extend({
        tagName: "li",
        template: "lesson/plan-item-edit",
        saveModelRequest: "plan:save",
        ui: {
            "duration": ".plan-duration",
            "name": ".plan-name",
            "done": ".plan-checkbox",
            "description": ".plan-description"
        },
        events: {
            "click .up": "positionUp",
            "click .down": "positionDown",
            "click .delete": "deleteItem",
            "click .export": "runExport",
            "click .import": "importItem",
            "click .show": "showResource",
            "click .to-edit": "setEditMode",
            "change @ui.name": "serialize",
            "change @ui.duration": "serialize",
            "change @ui.done": "serialize"
        },
        modelEvents: {
            "change:activityID": "render",
            "change:isEditing": "render"
        },
        setEditMode: function () {
            this.model.set("isEditing", true);
            this.ui.description.trumbowyg({
                autogrow: true,
                mobile: true,
                tablet: true,
                resetCss: true,
                removeformatPasted: true,
                btns: [
                    ['bold', 'italic'],
                    ['link'],
                    ['insertImage'],
                    'btnGrp-justify',
                    'btnGrp-lists',
                    ['horizontalRule'],
                    ['fullscreen']
                ]
            });
            this.ui.description.trumbowyg('html', this.model.get('description'));
            var parent = this;
            this.ui.description.on("focusout",
                function (e) {
                    try {
                        if (typeof (parent.setShowMode) === "function") {
                            parent.setShowMode();
                        }
                    } catch (ex) {
                        console.log('error', ex.message);
                    }
                }
            );
        },
        setShowMode: function () {
            this.model.set("description", this.ui.description.trumbowyg("html"));
            this.model.set("isEditing", false);
            if (this.model.id) {
                this.saveModel();
            }
        },
        serialize: function (e) {
            if (!this.model) {
                return;
            }
            try {
                this.model.set("name", this.ui.name.val());
                this.model.set("duration", this.ui.duration.val() * 1);
                this.model.set("status", this.ui.done[0].checked ? 1 : 0);

                if (this.model.get('lessonID') === null) {
                    var lesson = Lampa.request("lesson:current:entity");
                    this.model.set("lessonID", lesson.get('lessonID'));
                }
                this.model.set('isEditing', false);

                if (this.model.id != null) {
                    this.saveModel();
                }
            }
            catch (ex) {
                console.log('error', this.model.toJSON(), ex.message);
            }
        },
        deleteItem: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.model.destroy();
        },
        positionUp: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.request("plan:up", this.model);
        },
        positionDown: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.request("plan:down", this.model);
        },
        runExport: function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (this.model.get('activityID') !== null) {
                Lampa.trigger("activity:show", this.model.get('activityID'));
                return;
            }

            var activity = Lampa.request("activity:new");
            activity.set('duration', this.model.get('duration'));
            activity.set('title', this.model.get('name'));
            activity.set('instructions', this.model.get('description'));

            var parent = this;
            $.when(Lampa.request('activity:save', activity)).done(function (model) {
                parent.model.set('activityID', model.get('activityID'));
                $.when(Lampa.request('plane:save', parent.model)).done(function (savedEntity) {
                    parent.render();
                    Lampa.trigger("activity:add", model);
                });
            });
        },
        showResource: function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('show', this.model.get('activityID'));
            Lampa.trigger("activity:show", this.model.get('activityID'));
        }
    });

    Show.LessonPlans = Marionette.CompositeView.extend({
        template: "lesson/edit-plans",
        lessonID: null,
        lessonModel: null,
        childView: Show.LessonPlanItem,
        childViewContainer: "ul"
    });

    Show.LessonTeacher = Marionette.CompositeView.extend({
        template: "lesson/bar-teacher",
        className: "box last-box col-xs-6 col-sm-3",
        events: {
            "click .clickable": "show"
        },
        show: function () {
            Lampa.trigger('teacher:show', this.model.get('personID'));
        }
    });

    Show.LessonTeachers = Marionette.CollectionView.extend({
        childView: Show.LessonTeacher
    });

    Show.LessonHeader = Lampa.ItemView.extend({
        template: "lesson/edit-header",
        saveModelRequest: "lesson:save",
        ui: {
            "name": "#name",
            "description_a": "#description_a",
            "description_b": "#description_b",
            "materials": "#materials",
            "notes": "#notes"
        },
        events: {
            "change @ui.name": "getName",
            "change @ui.description_a": "getDescriptionA",
            "change @ui.description_b": "getDescriptionB",
            "change @ui.notes": "getNotes",
            "change @ui.materials": "getMaterials"
        },
        modelEvents: {
            "change name": "render",
            "change description_a": "render",
            "change description_b": "render",
            "change materials": "render",
            "change notes": "render"
        },
        getName: function (e) {
            this.model.set("name", this.ui.name.val());
            this.save(e);
        },
        getDescriptionA: function (e) {
            this.model.set("description_a", this.ui.description_a.val());
            this.save(e);

        },
        getDescriptionB: function (e) {
            this.model.set("description_b", this.ui.description_b.val());
            this.save(e);
        },
        getMaterials: function (e) {
            this.model.set("materials", this.ui.materials.val());
            this.save(e);
        },
        getNotes: function (e) {
            this.model.set("notes", this.ui.notes.val());
            this.save(e);
        },
        save: function (e) {
            var parent = this;
            parent.lockForm();
            $.when(Lampa.request(this.saveModelRequest, this.model)).done(function (newModel) {
                parent.model = newModel;
                parent.unlockForm();
            });
        }
    });

    Show.LessonAttendanceItem = Marionette.ItemView.extend({
        tagName: "tr",
        template: "lesson/attendance-item-edit",
        modelEvents: {
            "change:isPresent": "render"
        },
        serialize: function () {
            try {
                var lesson = Lampa.request('lesson:current:entity');
                var lessonDuration = Lampa.request("helper:getDuration", lesson.get('start'), lesson.get('end')) || 0;

                var isPresent = this.el.getElementsByClassName("is-present")[0] === undefined ? 0 : (this.el.getElementsByClassName("is-present")[0].checked === true ? 1 : 0);
                var isExcused = this.el.getElementsByClassName("is-excused")[0] === undefined ? 0 : (this.el.getElementsByClassName("is-excused")[0].checked === true ? 1 : 0);
                var length = this.el.getElementsByClassName("length")[0] === undefined ? lessonDuration : this.el.getElementsByClassName("length")[0].value * 1;
                var note = this.el.getElementsByClassName("note")[0] === undefined ? '' : this.el.getElementsByClassName("note")[0].value;

                this.model.set('isPresent', isPresent);
                this.model.set('isExcused', isExcused);
                this.model.set('length', length);
                this.model.set('note', note);
                this.model.save();

            } catch (ex) {
                console.log(ex.message);
            }
        },
        events: {
            "change": "serialize"
        }
    });

    Show.LessonAttendances = Marionette.CompositeView.extend({
        template: "lesson/attendance-list",
        childView: Show.LessonAttendanceItem,
        emptyView: Show.None,
        childViewContainer: "tbody",
        className: "table table-striped table-bordered table-hover",
        tagName: "table"
    });

    Show.HomeworkItem = Marionette.ItemView.extend({
        template: "lesson/homework-item",
        className: "alert alert-success"
    });

    Show.HomeworkList = Marionette.CollectionView.extend({
        template: "lesson/homework-list",
        childView: Show.HomeworkItem,
        emptyView: Show.None
    });

    Show.Reminder = Marionette.ItemView.extend({
        template: "lesson/reminder",
        className: function () {
            var className = "alert alert-danger";
            if (this.model.get('reminder') === null || this.model.get('')) {
                className += " hidden";
            }
            return className;
        }
    });

    Show.LessonNewReminder = Lampa.EditableItemView.extend({
        template: "lesson/reminder-new",
        saveModelRequest: "reminder:new:save",
        behaviors: {
            Tooltips: {},
            ElasticTextArea: {}
        },
        ui: {
            "reminder": "#reminder"
        }
    });

    Show.LessonDictionaryItem = Lampa.ItemView.extend({
        tagName: "tr",
        template: "lesson/vocabulary-item-edit",
        events: {
            "click .delete": "deleteItem",
            "change": "serialize"
        },
        modelEvents: {
            "change": "render"
        },
        ui: {
            "term": ".term",
            "translation": ".translation"
        },
        deleteItem: function (e) {
            e.preventDefault();
            e.stopPropagation();
            var item = this.model.get('term');
            var message = "Do you want to delete this vocabulary? ";
            if (confirm(message + (item === null ? '' : item)) === true) {
                this.model.destroy();
            }
        },
        serialize: function (e) {
            e.preventDefault();
            e.stopPropagation();

            this.model.set('term', this.el.getElementsByClassName('term')[0].value);
            this.model.set('translation', this.el.getElementsByClassName('translation')[0].value);

            if (this.model.get('lessonID') === null) {
                var lesson = Lampa.request("lesson:current:entity");
                this.model.set('lessonID', lesson.get('lessonID'));
            }

            var parent = this;
            this.lockForm();
            $.when(Lampa.request("dictionary:entity:save", this.model)).done(function (model) {
                parent.model = model;
                parent.unlockForm();
            });
        }
    });

    Show.LessonDictionary = Marionette.CompositeView.extend({
        template: "lesson/vocabulary-list-edit",
        childView: Show.LessonDictionaryItem,
        emptyView: Show.None,
        childViewContainer: "tbody"
    });

    Show.GroupDictionaryItem = Marionette.ItemView.extend({
        tagName: "li",
        template: "lesson/dictionary-short-item-show-template"
    });

    Show.GroupDictionary = Marionette.CompositeView.extend({
        template: "lesson/group-dictionary-template",
        childView: Show.GroupDictionaryItem,
        emptyView: Show.NoData,
        childViewContainer: "ul"
    });

    Show.NoData = Marionette.ItemView.extend({
        template: "core/no-data"
    });

    Show.LessonNext = Marionette.ItemView.extend({
        tagName: "option",
        template: "lesson/lesson-next",
        attributes: function () {
            var attr = {};
            attr.value = null;
            if (this.model.get('lessonID') !== undefined) {
                attr.value = this.model.get('lessonID');
            }
            if (this.model.get('selected')) {
                attr.selected = 'selected';
            }
            return attr;
        }
    });

    Show.LessonsNext = Marionette.CompositeView.extend({
        template: "lesson/lessons-next-select",
        className: "form-group",
        childView: Show.LessonNext,
        childViewContainer: "select"
    });

    Show.DictionarySimpleItem = Marionette.ItemView.extend({
        template: "lesson/group-lesson-dictionary-item",
        tagName: "li"
    });

    Show.LessonDictionaryList = Marionette.CollectionView.extend({
        template: "lesson/group-lesson-dictionary",
        childView: Show.DictionarySimpleItem,
        emptyView: Show.None,
        childViewContainer: "ul"
    });

    Show.GroupLesson = Marionette.ItemView.extend({
        template: "lesson/group-lesson-with-dictionary",
        tagName: "li"
    });

    Show.GroupLessonList = Marionette.CollectionView.extend({
        template: "lesson/group-lessons-with-dictionary",
        childView: Show.GroupLesson,
        childViewContainer: "ul"
    });

    Show.GroupLessonDictionary = Marionette.LayoutView.extend({
        template: "lesson/group-by-lessons-dictionary",
        regions: {
            "lessons": "#lessons"
        }
    });

    Show.LessonOutcome = Marionette.ItemView.extend({
        template: "lesson/outcome-item-edit",
        tagName: "li",
        ui: {
            "description": ".description",
            "delete": ".delete"
        },
        events: {
            "change": "serialize",
            "click @ui.delete": "deleteModel"
        },
        serialize: function (e) {
            this.model.set('description', this.ui.description.val());
            this.model.save();
        },
        deleteModel: function (e) {
            this.model.destroy();
        }
    });

    Show.LessonOutcomes = Marionette.CollectionView.extend({
        template: "lesson/outcomes-list",
        childView: Show.LessonOutcome,
        childViewContainer: "ul"
    });
});