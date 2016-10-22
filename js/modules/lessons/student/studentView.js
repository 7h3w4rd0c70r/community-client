Lampa.module("LessonsModule.Student", function (Student, Lampa, Backbone, Marionette, $, _) {
    Student.Lesson = Marionette.LayoutView.extend({
        template: "lesson/student",
        className: "container",
        regions: {
            timeRegion: "#datetime",
            groupRegion: "#group",
            locationRegion: "#location",
            courseRegion: "#course",
            teacherRegion: "#teachers",
            buttonsRegion: "#buttons",
            homeworkRegion: "#homework",
            plansRegion: "#plans",
            lessonDictionaryRegion: "#dictionary",
            headerRegion: "#header"
        },
        ui: {},
        onRender: function () {
            var _this = this;
            var lessonID = _this.model.get("lessonID");

            _this.timeRegion.show(new Student.LessonTime({model: _this.model}));

            $.when(Lampa.request("lesson:neighbours", lessonID)).done(
                function (model) {
                    _this.groupRegion.show(new Student.LessonGroup({model: model}));
                }
            );

            $.when(Lampa.request("location:entity", _this.model.get("locationID"))).done(
                function (model) {
                    _this.locationRegion.show(new Student.LessonLocation({model: model}));
                }
            );

            $.when(Lampa.request("course:entity", _this.model.get("courseID"))).done(
                function (model) {
                    _this.courseRegion.show(new Student.LessonCourse({model: model}));
                }
            );

            $.when(Lampa.request("lesson:teachers", lessonID)).done(
                function (collection) {
                    _this.teacherRegion.show(new Student.LessonTeachers({collection: collection}));
                }
            );

            if (lessonID && this.model.get("status") === 2) {
                $.when(Lampa.request("homework:entities", lessonID)).done(
                    function (collection) {
                        _this.homeworkRegion.show(new Student.HomeworkList({collection: collection}));
                    }
                );

                $.when(Lampa.request("lesson:header", lessonID)).done(
                    function (model) {
                        _this.headerRegion.show(new Student.LessonHeader({model: model}));
                    }
                );

                $.when(Lampa.request("lesson:plans", lessonID)).done(
                    function (collection) {
                        _this.plansRegion.show(new Student.LessonPlans({collection: collection}));
                    }
                );

                $.when(Lampa.request("lesson:dictionary:entities", lessonID)).done(
                    function (collection) {
                        _this.lessonDictionaryRegion.show(new Student.LessonDictionary({collection: collection}));
                    }
                );
            }
        }
    });

    Student.None = Marionette.ItemView.extend({
        template: "lesson/none",
        className: "well well-sm",
        tagName: "tr"
    });

    Student.LessonTime = Marionette.ItemView.extend({
        template: "lesson/bar-time",
        className: "panel panel-default"
    });

    Student.LessonGroup = Marionette.ItemView.extend({
        template: "lesson/bar-group"
    });

    Student.LessonLocation = Marionette.ItemView.extend({
        template: "lesson/bar-location"
    });

    Student.LessonCourse = Marionette.ItemView.extend({
        template: "lesson/bar-course"
    });

    Student.LessonNeighboursAccess = Marionette.ItemView.extend({
        template: "lesson/lesson-neighbours-template"
    });

    Student.LastLessonPlanItem = Marionette.ItemView.extend({
        tagName: "li",
        template: "lesson/plan-item-done"
    });

    Student.LastLessonNothingDone = Marionette.ItemView.extend({
        tagName: "li",
        template: "lesson/plan-nothing"
    });

    Student.LessonPlanItem = Marionette.ItemView.extend({
        tagName: "tr",
        template: "lesson/plan-item-student"
    });

    Student.LessonPlans = Marionette.CompositeView.extend({
        template: "lesson/student-plans",
        className: "tbody",
        childView: Student.LessonPlanItem,
        childViewContainer: "tbody"
    });

    Student.LessonTeacher = Marionette.CompositeView.extend({
        template: "lesson/bar-teacher",
        className: "box last-box col-xs-4 col-sm-3"
    });

    Student.LessonTeachers = Marionette.CollectionView.extend({
        childView: Student.LessonTeacher
    });

    Student.LessonHeader = Lampa.ItemView.extend({
        template: "lesson/student-header"
    });

    Student.HomeworkItem = Marionette.ItemView.extend({
        template: "lesson/homework-item",
        className: "alert alert-success"
    });

    Student.HomeworkList = Marionette.CollectionView.extend({
        template: "lesson/homework-list",
        childView: Student.HomeworkItem,
        emptyView: Student.None
    });

    Student.LessonDictionaryItemNone = Marionette.ItemView.extend({
        template: "lesson/vocabulary-item-none",
        tagName: "tr"
    });

    Student.LessonDictionaryItem = Lampa.ItemView.extend({
        tagName: "tr",
        template: "lesson/vocabulary-item-show",
        ui: {
            "import": ".add-to-dictionary"
        },
        events: {
            "click @ui.import": "importItem"
        },
        modelEvents: {
            "change myDictionaryID": "render"
        },
        importItem: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            var termModel = Lampa.request("personalVocabulary:new");
            termModel.set("term", this.model.get("term"));
            termModel.set("translation", this.model.get("translation"));
            termModel.set("lessonDictionaryID", this.model.get("dictionaryID"));
            var _this = this;
            $.when(Lampa.request("personalVocabulary:save", termModel))
                .then(function (model) {
                    _this.model.set("myDictionaryID", model.get("dictionaryID"));
                    _this.render();
                });
        }
    });

    Student.LessonDictionary = Marionette.CompositeView.extend({
        template: "lesson/vocabulary-list-show",
        childView: Student.LessonDictionaryItem,
        emptyView: Student.LessonDictionaryItemNone,
        childViewContainer: "tbody"
    });

    Student.NoData = Marionette.ItemView.extend({
        template: "core/no-data"
    });

    Student.LessonNext = Marionette.ItemView.extend({
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

    Student.LessonsNext = Marionette.CompositeView.extend({
        template: "lesson/lessons-next-select",
        className: "form-group",
        childView: Student.LessonNext,
        childViewContainer: "select"
    });
});