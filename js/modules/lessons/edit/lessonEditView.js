/**
 * Created by Roman on 3.6.14.
 */

Lampa.module("LessonsModule.Edit", function (Edit, Lampa, Backbone, Marionette, $, _) {
    Edit.Layout = Lampa.EditableItemView.extend({
        template: "lesson/edit",
        className: "container",
        isSaving: true,
        regions: {
            statusTimeRegion: "#status-time",
            groupRegion: "#group",
            locationRegion: "#location",
            courseRegion: "#course",
            teacherRegion: "#teachers",
            headerRegion: "#header",
            outcomesRegion: "#outcomes",
            outcomeNewRegion: "#outcome-new",
            plansRegion: "#plans",
            plansNewItemRegion: "#plan-new",
            plansStatisticsRegion: "#plan-statistics",
            lastPlansRegion: "#last-plan-detail",
            attendancesRegion: "#lesson-attendance",
            homeworkRegion: "#homework-area",
            newHomeworkRegion: "#new-homework",
            lessonDictionaryRegion: "#lesson-dictionary",
            lessonAddDictionaryItemRegion: "#dictionary-add-item",
            groupDictionaryRegion: "#group-dictionary",
            reminderRegion: "#reminder-area",
            reminderNewRegion: "#reminder-new",
            buttonsRegion: "#buttons",
            pasteLessonRegion: "#paste-lesson-modal"
        },
        ui: {},
        lessonPlan: null,
        saveModelRequest: "lesson:save",
        saveModel: function () {
            var _this = this;
            $.when(Lampa.request(this.saveModelRequest, this.model)).done(function (newModel) {
                _this.model = newModel;
            });
        }
    });

    Edit.None = Marionette.ItemView.extend({
        template: "lesson/none",
        className: "well well-sm",
        tagName: "li"
    });

    Edit.LessonStatusTime = Marionette.ItemView.extend({
        template: "lesson/bar-status-time",
        className: "panel panel-default",
        modelEvents: {"change:status": "render"}
    });

    Edit.LessonGroup = Marionette.ItemView.extend({
        template: "lesson/bar-group",
        events: {
            "click .clickable": "show"
        },
        show: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            Lampa.trigger("group:show", this.model.get("groupID"));
        }
    });

    Edit.LessonLocation = Marionette.ItemView.extend({
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
            Lampa.trigger("location:show", this.model.get("locationID"));
        }
    });

    Edit.LessonCourse = Marionette.ItemView.extend({
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
            Lampa.trigger("course:show", this.model.get("courseID"));
        }
    });

    Edit.LessonNeighboursAccess = Marionette.ItemView.extend({
        template: "lesson/lesson-neighbours-template"
    });

    Edit.LessonPlanStatisticsChild = Marionette.ItemView.extend({
        template: "core/empty"
    });

    Edit.LessonPlanStatistics = Marionette.CompositeView.extend({
        template: "lesson/plans-statistics",
        childView: Edit.LessonPlanStatisticsChild,
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

    Edit.LastLessonPlanItem = Marionette.ItemView.extend({
        tagName: "li",
        template: "lesson/plan-item-done"
    });

    Edit.LastLessonNothingDone = Marionette.ItemView.extend({
        tagName: "li",
        template: "lesson/plan-nothing"
    });

    Edit.LastLessonPlans = Marionette.CompositeView.extend({
        template: "lesson/plans-done",
        childView: Edit.LastLessonPlanItem,
        emptyView: Edit.LastLessonNothingDone,
        childViewContainer: "ul"
    });

    Edit.LessonNewPlanItem = Marionette.ItemView.extend({
        template: "lesson/plan-item-new",
        ui: {
            "button": "#add-plan",
            "clipboard": "#pop-clipboard"
        },
        events: {
            "click @ui.button": "addPlanItem",
            "click @ui.clipboard": "addActivityClipboardItems"
        },
        addPlanItem: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            var model = this.model.clone();
            Lampa.request("lesson:plan:add", model);
            Lampa.request("plan:save", model);
        },
        addActivityClipboardItems: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            var _this = this;
            _.forEach(Lampa.request("activity:clipboard:get"), function (activity) {
                var model = _this.model.clone();
                model.set("activityID", activity.get("activityID"));
                model.set("duration", activity.get("duration"));
                model.set("name", activity.get("title"));
                model.set("description", activity.get("instructions"));
                Lampa.request("lesson:plan:add", model);
                Lampa.request("plan:save", model);
            });
            Lampa.request("activity:clipboard:clean");
            this.render();
        }
    });

    Edit.LessonPlanItem = Lampa.EditableItemView.extend({
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
                    ["bold", "italic"],
                    ["link"],
                    ["insertImage"],
                    "btnGrp-justify",
                    "btnGrp-lists",
                    ["horizontalRule"],
                    ["fullscreen"]
                ]
            });
            this.ui.description.trumbowyg("html", this.model.get("description"));
            var _this = this;
            this.ui.description.on("focusout", function () {
                try {
                    if (typeof _this.setShowMode === "function") {
                        _this.setShowMode();
                    }
                } catch (ex) {
                    console.log("error", ex.message);
                }
            });
        },
        setShowMode: function () {
            this.model.set("description", this.ui.description.trumbowyg("html"));
            this.model.set("isEditing", false);
            if (this.model.id) {
                this.saveModel();
            }
        },
        serialize: function () {
            if (!this.model) {
                return;
            }
            try {
                this.model.set("name", this.ui.name.val());
                this.model.set("duration", this.ui.duration.val() * 1);
                this.model.set("status", this.ui.done[0].checked ? 1 : 0);

                if (!this.model.get("lessonID")) {
                    var lesson = Lampa.request("lesson:current:entity");
                    this.model.set("lessonID", lesson.get("lessonID"));
                }
                this.model.set("isEditing", false);

                if (this.model.id) {
                    this.saveModel();
                }
            } catch (ex) {
                console.log("error", this.model.toJSON(), ex.message);
            }
        },
        deleteItem: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            this.model.destroy();
        },
        positionUp: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            Lampa.request("plan:up", this.model);
        },
        positionDown: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            Lampa.request("plan:down", this.model);
        },
        runExport: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            if (this.model.get("activityID")) {
                Lampa.trigger("activity:show", this.model.get("activityID"));
                return;
            }

            var activity = Lampa.request("activity:new");
            activity.set("duration", this.model.get("duration"));
            activity.set("title", this.model.get("name"));
            activity.set("instructions", this.model.get("description"));

            var _this = this;
            $.when(Lampa.request("activity:save", activity)).done(function (model) {
                _this.model.set("activityID", model.get("activityID"));
                $.when(Lampa.request("plane:save", _this.model)).done(function () {
                    _this.render();
                    Lampa.trigger("activity:add", model);
                });
            });
        },
        showResource: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            Lampa.trigger("activity:show", this.model.get("activityID"));
        }
    });

    Edit.LessonPlans = Marionette.CompositeView.extend({
        template: "lesson/edit-plans",
        lessonID: null,
        lessonModel: null,
        childView: Edit.LessonPlanItem,
        childViewContainer: "ul"
    });

    Edit.LessonTeacher = Marionette.CompositeView.extend({
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
            Lampa.trigger("teacher:show", this.model.get("personID"));
        }
    });

    Edit.LessonTeachers = Marionette.CollectionView.extend({
        childView: Edit.LessonTeacher
    });

    Edit.LessonHeader = Lampa.ItemView.extend({
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
        save: function () {
            var _this = this;
            _this.lockForm();
            $.when(Lampa.request(this.saveModelRequest, this.model)).done(function (newModel) {
                _this.model = newModel;
                _this.unlockForm();
            });
        }
    });

    Edit.LessonAttendanceItem = Lampa.EditableItemView.extend({
        template: "lesson/attendance-item-edit",
        saveModelRequest: "lesson:attendance:save",
        tagName: "tr",
        ui: {
            "lessonID": ".lessonID",
            "isPresent": ".is-present",
            "isExcused": ".is-excused",
            "length": ".length",
            "note": ".note"
        },
        modelEvents: {
            "change:isPresent": "render"
        },
        onShow: function () {
            var lesson = Lampa.request("lesson:current:entity");
            if (this.model && lesson) {
                if (this.model.get("isPresent")) {
                    this.model.set("length", Lampa.request("helper:getDuration", lesson.get("start"), lesson.get("end")) || 0);
                }
            }
        },
        serialize: function () {
            try {
                var lesson = Lampa.request("lesson:current:entity");
                var lessonDuration = Lampa.request("helper:getDuration", lesson.get("start"), lesson.get("end")) || 0;
                var isPresent = !this.el.getElementsByClassName("is-present")[0] ? 0 : (this.el.getElementsByClassName("is-present")[0].checked === true ? 1 : 0);
                var isExcused = !this.el.getElementsByClassName("is-excused")[0] ? 0 : (this.el.getElementsByClassName("is-excused")[0].checked === true ? 1 : 0);
                var length = !this.el.getElementsByClassName("length")[0] ? lessonDuration : Number(this.el.getElementsByClassName("length")[0].value);
                var note = !this.el.getElementsByClassName("note")[0] ? "" : this.el.getElementsByClassName("note")[0].value;

                this.model.set("isPresent", isPresent);
                this.model.set("isExcused", isExcused);
                this.model.set("length", length);
                this.model.set("note", note);
                this.saveModel();
            } catch (ex) {
                console.log(ex.message);
            }
        },
        events: {
            "change": "serialize"
        }
    });

    Edit.LessonAttendances = Marionette.CompositeView.extend({
        template: "lesson/attendance-list",
        childView: Edit.LessonAttendanceItem,
        emptyView: Edit.None,
        childViewContainer: "tbody",
        className: "table table-striped table-bordered table-hover",
        tagName: "table"
    });

    Edit.HomeworkItem = Marionette.ItemView.extend({
        template: "lesson/homework-item",
        className: "alert alert-success"
    });

    Edit.HomeworkList = Marionette.CollectionView.extend({
        template: "lesson/homework-list",
        childView: Edit.HomeworkItem,
        emptyView: Edit.None
    });

    Edit.LessonNewHomework = Lampa.EditableItemView.extend({
        template: "lesson/homework-new",
        regions: {
            lessonsRegion: "#lessons-next"
        },
        saveModelRequest: "homework:new:save",
        behaviors: {
            DateTimePicker: {serialize: this.serialize},
            Tooltips: {},
            ElasticTextArea: {}
        },
        ui: {
            "homework": "#homework"
        },
        events: {
            "change": "serialize"
        },
        collectionEvents: {
            "change:selected": "serialize"
        },
        serialize: function () {
            if (this.model) {
                this.model.set("homework", Lampa.request("helper:getElementValue", this.ui.homework));

                if (this.model.get("homework").trim() === "") {
                    this.model.set("homework", "");
                    this.model.set("homeworkLessonID", 0);
                } else {
                    this.model.set("homeworkLessonID", Lampa.request("helper:getElementValue", $("#homeworkLessonID")) * 1);
                }

                if (this.model.id) {
                    this.saveModel();
                }
            }
        },
        onShow: function () {
            var layout = this;
            $.when(Lampa.request("lessons:next", layout.model.get("lessonID"))).done(
                function (collection) {
                    layout.collection = collection;
                    var homeworkID = layout.model.get("homeworkLessonID");
                    if (homeworkID !== 0) {
                        collection.each(function (model) {
                            if (model.get("lessonID") === homeworkID) {
                                model.set("selected", true);
                            } else {
                                model.set("selected", false);
                            }
                        });
                    }
                    layout.lessonsRegion.show(new Edit.LessonsNext({collection: collection}));
                }
            );
        }
    });
    Edit.Reminder = Marionette.ItemView.extend({
        template: "lesson/reminder",
        className: function () {
            var className = "alert alert-danger";
            if (!this.model.get("reminder")) {
                className += " hidden";
            }
            return className;
        }
    });

    Edit.LessonNewReminder = Lampa.EditableItemView.extend({
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

    Edit.LessonNewDictionaryItem = Marionette.ItemView.extend({
        template: "lesson/vocabulary-add",
        events: {
            "click .add": "addItem"
        },
        addItem: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            try {
                var lesson = Lampa.request("lesson:current:entity");
                this.model = Lampa.request("dictionary:entity:new");
                this.model.set("lessonID", lesson.get("lessonID"));
                Lampa.request("lesson:dictionary:add", this.model);
            } catch (ex) {
                console.log("error", ex.message);
            }
        }
    });

    Edit.LessonDictionaryItem = Lampa.ItemView.extend({
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
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            var item = this.model.get("term");
            var message = "Do you want to delete this vocabulary? ";
            if (confirm(message + (item ? item : "")) === true) {
                this.model.destroy();
            }
        },
        serialize: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            this.model.set("term", this.el.getElementsByClassName("term")[0].value);
            this.model.set("translation", this.el.getElementsByClassName("translation")[0].value);

            if (this.model.get("lessonID") === null) {
                var lesson = Lampa.request("lesson:current:entity");
                this.model.set("lessonID", lesson.get("lessonID"));
            }

            var _this = this;
            this.lockForm();
            $.when(Lampa.request("dictionary:entity:save", this.model)).done(function (model) {
                _this.model = model;
                _this.unlockForm();
            });
        }
    });

    Edit.LessonDictionary = Marionette.CompositeView.extend({
        template: "lesson/vocabulary-list-edit",
        childView: Edit.LessonDictionaryItem,
        emptyView: Edit.None,
        childViewContainer: "tbody"
    });

    Edit.GroupDictionaryItem = Marionette.ItemView.extend({
        tagName: "li",
        template: "lesson/dictionary-short-item-show-template"
    });

    Edit.GroupDictionary = Marionette.CompositeView.extend({
        template: "lesson/group-dictionary-template",
        childView: Edit.GroupDictionaryItem,
        emptyView: Edit.NoData,
        childViewContainer: "ul"
    });

    Edit.NoData = Marionette.ItemView.extend({
        template: "core/no-data"
    });

    Edit.LessonNext = Marionette.ItemView.extend({
        tagName: "option",
        template: "lesson/lesson-next",
        attributes: function () {
            var attr = {};
            attr.value = null;
            if (this.model.get("lessonID")) {
                attr.value = this.model.get("lessonID");
            }
            if (this.model.get("selected")) {
                attr.selected = "selected";
            }
            return attr;
        }
    });

    Edit.LessonsNext = Marionette.CompositeView.extend({
        template: "lesson/lessons-next-select",
        className: "form-group",
        childView: Edit.LessonNext,
        childViewContainer: "select"
    });

    Edit.PasteLesson = Marionette.ItemView.extend({
        template: "lesson/paste-lesson",
        className: "modal-dialog modal-sm",
        ui: {
            "header": "#plan-header",
            "pasteAll": "#plan-all",
            "pasteDoneOnly": "#plan-not-done",
            "emptyPlan": "#empty-plan"
        },
        events: {
            "click #do-paste": "pasteLesson"
        },
        pasteLesson: function (e) {
            try {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (!this.model.get("lessonID")) {
                    return;
                }

                this.model.set("copyHeader", Lampa.request("helper:getElementValue", this.ui.header) ? true : false);
                this.model.set("copyActivities", this.ui.pasteDoneOnly[0].checked);
                this.model.set("clearExistingActivities", Lampa.request("helper:getElementValue", this.ui.emptyPlan) ? true : false);

                if (this.model.get("copyHeader")) {
                    Lampa.trigger("lesson:paste");
                }

                Lampa.request("plans:paste", this.model.get("clearExistingActivities"), this.ui.pasteDoneOnly[0].checked);
            } catch (ex) {
                console.log(ex.message);
            }
        }
    });

    Edit.DictionarySimpleItem = Marionette.ItemView.extend({
        template: "lesson/group-lesson-dictionary-item",
        tagName: "li"
    });

    Edit.LessonDictionaryList = Marionette.CollectionView.extend({
        template: "lesson/group-lesson-dictionary",
        childView: Edit.DictionarySimpleItem,
        emptyView: Edit.None,
        childViewContainer: "ul"
    });

    Edit.GroupLesson = Marionette.ItemView.extend({
        template: "lesson/group-lesson-with-dictionary",
        tagName: "li"
    });

    Edit.GroupLessonList = Marionette.CollectionView.extend({
        template: "lesson/group-lessons-with-dictionary",
        childView: Edit.GroupLesson,
        childViewContainer: "ul"
    });

    Edit.GroupLessonDictionary = Marionette.LayoutView.extend({
        template: "lesson/group-by-lessons-dictionary",
        regions: {
            "lessons": "#lessons"
        }
    });

    Edit.LessonOutcome = Marionette.ItemView.extend({
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
        serialize: function () {
            this.model.set("description", this.ui.description.val());
            this.model.save();
        },
        deleteModel: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            this.model.destroy();
        }
    });

    Edit.LessonOutcomeAdd = Marionette.ItemView.extend({
        template: "lesson/outcome-new",
        events: {
            "click button": "addItem"
        },
        getModel: function () {
            try {
                if (this.model === undefined) {
                    var lesson = Lampa.request("lesson:current:entity");
                    this.model = Lampa.request("outcome:entity:new", lesson.get("lessonID"));
                }
                return this.model.clone();
            } catch (ex) {
                console.log("error", ex.message);
            }
        },
        addItem: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            Lampa.request("outcome:add-item", this.getModel());
        }
    });

    Edit.LessonOutcomes = Marionette.CollectionView.extend({
        template: "lesson/outcomes-list",
        childView: Edit.LessonOutcome,
        childViewContainer: "ul"
    });

    Edit.LessonButtons = Marionette.LayoutView.extend({
        template: "lesson/menu",
        tagName: "h2",
        ui: {
            cancel: "#cancel",
            reschedule: "#reschedule",
            copy: "#copy",
            print: "#print-lesson",
            paste: "#paste"
        },
        events: {
            "click @ui.cancel": "cancelLesson",
            "click @ui.reschedule": "rescheduleLesson",
            "click @ui.copy": "copyLesson",
            "click @ui.print": "printLesson"
        },
        collectionEvents: {
            "reset": "render"
        },
        cancelLesson: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            Lampa.trigger("lesson:cancel", this.model.get("lessonID"));
        },
        rescheduleLesson: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            Lampa.trigger("lesson:reschedule", this.model.get("lessonID"));
        },
        copyLesson: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            Lampa.trigger("lesson:copy", this.model.get("lessonID"));
            Lampa.trigger("plans:copy");
            this.render();
        },
        printLesson: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            Lampa.trigger("lesson:report", this.model.get("lessonID"));
        }
    });

    Lampa.on("lesson:copy", function (lessonID) {
        Lampa.request("lesson-paste:set", lessonID);
    });
});