module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        less: {
            login: {
                options: {
                    compress: true,
                    cleancss: true
                },
                files: {
                    "style-login.css": "css/style-login.less"
                }
            },
            app: {
                options: {
                    compress: true,
                    cleancss: true
                },
                files: {
                    "style.css": "css/style.less"
                }
            },
            print: {
                options: {
                    compress: true,
                    cleancss: true
                },
                files: {
                    "print.css": "css/print.less"
                }
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, src: ".htaccess", dest: "build/"},
                    {expand: true, src: ".htaccess", dest: "build/libs/"},
                    {expand: true, src: ".htaccess", dest: "build/libs/trumbowyg/"},
                    {expand: true, src: ".htaccess", dest: "build/libs/bootstap/"},
                    {expand: true, src: ".htaccess", dest: "build/libs/bootstrap-datetimepicker/"},
                    {expand: true, src: ".htaccess", dest: "build/fonts/"},
                    {expand: true, src: ".htaccess", dest: "build/images/"},
                    {expand: true, src: ".htaccess", dest: "build/images/activity/"},
                    {expand: true, src: ".htaccess", dest: "build/images/group/"},
                    {expand: true, src: ".htaccess", dest: "build/images/location/"},
                    {expand: true, src: ".htaccess", dest: "build/images/user/"},
                    {expand: true, src: "*.css", dest: "build/"},
                    {expand: true, src: "images/*.png", dest: "build/"},
                    {expand: true, src: "fonts/*.*", dest: "build/"},
                    {expand: true, src: "libs/jquery.js", dest: "build/"},
                    {expand: true, src: "libs/pdfmake.min.js", dest: "build/"},
                    {expand: true, src: "libs/vfs_fonts.js", dest: "build/"},
                    {expand: true, src: "libs/trumbowyg/trumbowyg.min.js", dest: "build/"},
                    {expand: true, src: "libs/trumbowyg/*/*.*", dest: "build/"},
                    {expand: true, src: "libs/bootstap/*/*.*", dest: "build/"},
                    {
                        expand: true,
                        src: "libs/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css",
                        dest: "build/"
                    },
                    {expand: true, src: "libs/bootstrap-datetimepicker/js/*.js", dest: "build/"}
                ]
            }
        },
        clean: ["build"],
        uglify: {
            options: {
                mangle: false
            },
            build: {
                files: {
                    "build/lampa.min.js": "lampa.js",
                    "build/lampa.login.min.js": "lampa.login.js"
                }
            }
        },
        concat: {
            options: {
                separator: ""
            },
            indexDev: {
                src: [
                    "login-head.html",
                    "services-dev.html",
                    "login-dev.html",
                    "ending.html"
                ],
                dest: "index.html"
            },
            indexProd: {
                src: [
                    "login-head.html",
                    "login-prod.html",
                    "ending.html"

                ],
                dest: "index.prod.html"
            },
            indexDevNoPHP: {
                src: [
                    "login-head.html",
                    "services-no-php.html",
                    "login-dev.html",
                    "ending.html"
                ],
                dest: "index.html"
            },
            appDev: {
                src: [
                    "head.html",
                    "services-dev.html",
                    "dev.html",
                    "ending.html"
                ],
                dest: "app.html"
            },

            appProd: {
                src: [
                    "head.html",
                    "prod.html",
                    "ending.html"
                ],
                dest: "app.prod.html"
            },

            appDevNoPhp: {
                src: [
                    "head.html",
                    "services-no-php.html",
                    "dev.html",
                    "ending.html"
                ],
                dest: "app.html"
            },

            login: {
                src: [
                    "libs/crypt.js",
                    "libs/json2.js",
                    "libs/moment-with-locales.js",
                    "libs/spin.js",
                    "libs/underscore.js",
                    "libs/backbone.js",
                    "libs/backbone.marionette.js",
                    "libs/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js",
                    "js/core/renderer.js",
                    "login.templates.js",
                    "js/services-prod.js",
                    "js/login.js",
                    "js/helpers/coreHelpers.js",
                    "js/helpers/formHelpers.js",
                    "js/helpers/cookiesHelpers.js",
                    "js/helpers/timeFunctions.js",
                    "js/helpers/userHelpers.js",
                    "js/core/entitiesApi.js",
                    "js/entities/key.js",
                    "js/entities/user.js",
                    "js/entities/signup.js",
                    "js/entities/invitation.js",
                    "js/behaviors/dateTimePickerBehavior.js",
                    "js/behaviors/tooltipsBehavior.js",
                    "js/behaviors/trumbowygBehavior.js",
                    "js/core/views/view.js",
                    "js/core/views/skeletonView.js",
                    "js/core/views/editableItemView.js",
                    "js/core/views/editableItemViewShow.js",
                    "js/core/views/itemView.js",
                    "js/core.js",
                    "js/core/facebookApi.js",
                    "js/core/progressBar/progressBarView.js",
                    "js/core/progressBar/progressBarController.js",
                    "js/modules/security/login/loginView.js",
                    "js/modules/security/login/loginController.js",
                    "js/modules/security/signup/signupView.js",
                    "js/modules/security/signup/signupController.js",
                    "js/modules/security/invitation/invitationView.js",
                    "js/modules/security/invitation/invitationController.js",
                    "js/modules/security/securityModule.js",
                    "js/core/googleAnalytics.js"
                ],
                dest: "lampa.login.js"
            },
            lampa: {
                src: [
                    "libs/crypt.js",
                    "libs/moment-with-locales.js",
                    "libs/jquery.elastic.source.js",
                    "libs/json2.js",
                    "libs/spin.js",
                    "libs/underscore.js",
                    "libs/backbone.js",
                    "libs/backbone.marionette.js",
                    "libs/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js",
                    "libs/async.js",
                    "js/core/renderer.js",
                    "templates.js",
                    "js/services-prod.js",
                    "js/app.js",
                    "js/core/log.js",
                    "js/core/dialogs.js",
                    "js/helpers/coreHelpers.js",
                    "js/helpers/formHelpers.js",
                    "js/helpers/collectionHelpers.js",
                    "js/helpers/cookiesHelpers.js",
                    "js/helpers/timeFunctions.js",
                    "js/helpers/statusHelpers.js",
                    "js/helpers/groupHelpers.js",
                    "js/helpers/userHelpers.js",
                    "js/helpers/activityHelpers.js",
                    "js/helpers/subjectHelpers.js",
                    "js/helpers/lessonHelpers.js",
                    "js/helpers/menuHelpers.js",
                    "js/helpers/reportHelpers.js",
                    "js/helpers/confirmation.js",
                    "js/core/entitiesApi.js",

                    "js/entities/localdb.js",
                    "js/entities/day.js",
                    "js/entities/hour.js",
                    "js/entities/time.js",
                    "js/entities/calendar.js",
                    "js/entities/batch.js",
                    "js/entities/activity.js",
                    "js/entities/user.js",
                    "js/entities/account.js",
                    "js/entities/access.js",
                    "js/entities/role.js",
                    "js/entities/key.js",
                    "js/entities/menu.js",
                    "js/entities/lessonTemplate.js",
                    "js/entities/lessonTemplateActivity.js",
                    "js/entities/page.js",
                    "js/entities/school.js",
                    "js/entities/location.js",
                    "js/entities/group.js",
                    "js/entities/course.js",
                    "js/entities/teacher.js",
                    "js/entities/student.js",
                    "js/entities/lesson.js",
                    "js/entities/lessonsNext.js",
                    "js/entities/lessonPaste.js",
                    "js/entities/lessonPlan.js",
                    "js/entities/lessonAttendance.js",
                    "js/entities/homework.js",
                    "js/entities/lessonNewHomework.js",
                    "js/entities/lessonNewReminder.js",
                    "js/entities/lessonDictionary.js",
                    "js/entities/personalVocabulary.js",
                    "js/entities/line.js",
                    "js/entities/reportAttendance.js",
                    "js/entities/reminder.js",
                    "js/entities/attachment.js",
                    "js/entities/invite.js",
                    "js/entities/follower.js",
                    "js/entities/comment.js",
                    "js/entities/answer.js",
                    "js/entities/ask.js",
                    "js/entities/profile.js",
                    "js/entities/following.js",
                    "js/entities/share.js",
                    "js/entities/lessonOutcome.js",
                    "js/entities/lessonHeader.js",
                    "js/entities/invitation.js",

                    "js/behaviors/dateTimePickerBehavior.js",
                    "js/behaviors/tooltipsBehavior.js",
                    "js/behaviors/trumbowygBehavior.js",
                    "js/behaviors/elasticTextAreaBehavior.js",
                    "js/behaviors/iconBehavior.js",
                    "js/behaviors/groupDetailsBehavior.js",
                    "js/behaviors/groupIconsBehavior.js",
                    "js/behaviors/locationDetailsBehavior.js",
                    "js/behaviors/locationIconsBehavior.js",
                    "js/behaviors/teacherDetailsBehavior.js",
                    "js/behaviors/teacherIconsBehavior.js",
                    "js/behaviors/courseDetailsBehavior.js",
                    "js/behaviors/courseIconsBehavior.js",
                    "js/behaviors/selectedItemsBehaviors.js",

                    "js/core/progressBar/progressBarController.js",
                    "js/core/progressBar/progressBarView.js",

                    "js/core/views/view.js",
                    "js/core/views/itemView.js",
                    "js/core/views/editableItemView.js",
                    "js/core/views/editableItemViewShow.js",
                    "js/core/views/skeletonView.js",
                    "js/core/header/headerView.js",
                    "js/core/header/headerController.js",
                    "js/core/page/pageController.js",
                    "js/core/page/pageView.js",
                    "js/core/appCore.js",

                    "js/modules/activities/list/activityListView.js",
                    "js/modules/activities/detailedList/activityDetailedListView.js",
                    "js/modules/activities/detailedList/activityDetailedListController.js",
                    "js/modules/activities/grid/activityGridView.js",
                    "js/modules/activities/grid/activityGridController.js",
                    "js/modules/activities/show/activityShowView.js",
                    "js/modules/activities/show/activityShowController.js",
                    "js/modules/activities/edit/activityEditView.js",
                    "js/modules/activities/edit/activityEditController.js",
                    "js/modules/activities/activitiesModule.js",
                    "js/modules/lessonTemplates/list/lessonTemplateListView.js",
                    "js/modules/lessonTemplates/list/lessonTemplateListController.js",
                    "js/modules/lessonTemplates/add/lessonTemplateAddView.js",
                    "js/modules/lessonTemplates/add/lessonTemplateAddController.js",
                    "js/modules/lessonTemplates/show/lessonTemplateShowView.js",
                    "js/modules/lessonTemplates/show/lessonTemplateShowController.js",
                    "js/modules/lessonTemplates/edit/lessonTemplateEditView.js",
                    "js/modules/lessonTemplates/edit/lessonTemplateEditController.js",
                    "js/modules/lessonTemplates/lessonTemplateModule.js",
                    "js/modules/schools/show/schoolShowView.js",
                    "js/modules/schools/show/schoolShowController.js",
                    "js/modules/schools/edit/schoolEditView.js",
                    "js/modules/schools/edit/schoolEditController.js",
                    "js/modules/schools/schoolsModule.js",
                    "js/modules/locations/show/locationShowView.js",
                    "js/modules/locations/show/locationShowController.js",
                    "js/modules/locations/edit/locationEditView.js",
                    "js/modules/locations/edit/locationEditController.js",
                    "js/modules/locations/list/locationListView.js",
                    "js/modules/locations/list/locationListController.js",
                    "js/modules/locations/locationsModule.js",
                    "js/modules/groups/show/groupShowView.js",
                    "js/modules/groups/show/groupShowController.js",
                    "js/modules/groups/edit/groupEditView.js",
                    "js/modules/groups/edit/groupEditController.js",
                    "js/modules/groups/list/groupListView.js",
                    "js/modules/groups/list/groupListController.js",
                    "js/modules/groups/groupsModule.js",
                    "js/modules/courses/show/courseShowView.js",
                    "js/modules/courses/show/courseShowController.js",
                    "js/modules/courses/edit/courseEditView.js",
                    "js/modules/courses/edit/courseEditController.js",
                    "js/modules/courses/list/courseListView.js",
                    "js/modules/courses/list/courseListController.js",
                    "js/modules/courses/coursesModule.js",
                    "js/modules/teachers/show/teacherShowView.js",
                    "js/modules/teachers/show/teacherShowController.js",
                    "js/modules/teachers/edit/teacherEditView.js",
                    "js/modules/teachers/edit/teacherEditController.js",
                    "js/modules/teachers/list/teacherListView.js",
                    "js/modules/teachers/list/teacherListController.js",
                    "js/modules/teachers/teachersModule.js",

                    "js/modules/students/add/studentAddView.js",
                    "js/modules/students/add/studentAddController.js",
                    "js/modules/students/show/studentShowView.js",
                    "js/modules/students/show/studentShowController.js",
                    "js/modules/students/edit/studentEditView.js",
                    "js/modules/students/edit/studentEditController.js",
                    "js/modules/students/list/studentListView.js",
                    "js/modules/students/list/studentListController.js",
                    "js/modules/students/homework/homeworkView.js",
                    "js/modules/students/homework/homeworkController.js",
                    "js/modules/students/studentsModule.js",
                    "js/modules/lessons/student/studentView.js",
                    "js/modules/lessons/student/studentController.js",
                    "js/modules/lessons/show/lessonShowView.js",
                    "js/modules/lessons/show/lessonShowController.js",
                    "js/modules/lessons/edit/lessonEditView.js",
                    "js/modules/lessons/edit/lessonEditController.js",
                    "js/modules/lessons/list/lessonListView.js",
                    "js/modules/lessons/list/lessonListController.js",
                    "js/modules/lessons/grid/lessonGridView.js",
                    "js/modules/lessons/grid/lessonGridController.js",
                    "js/modules/lessons/add/lessonAddController.js",
                    "js/modules/lessons/add/lessonAddView.js",
                    "js/modules/lessons/reschedule/lessonRescheduleController.js",
                    "js/modules/lessons/reschedule/lessonRescheduleView.js",
                    "js/modules/lessons/cancel/lessonCancelController.js",
                    "js/modules/lessons/cancel/lessonCancelView.js",
                    "js/modules/lessons/timetable/lessonTimetableView.js",
                    "js/modules/lessons/timetable/lessonTimetableController.js",
                    "js/modules/lessons/timetable-teacher/lessonTimetableTeacherView.js",
                    "js/modules/lessons/timetable-teacher/lessonTimetableTeacherController.js",
                    "js/modules/lessons/timetable-group/lessonTimetableGroupView.js",
                    "js/modules/lessons/timetable-group/lessonTimetableGroupController.js",
                    "js/modules/lessons/timetable-location/lessonTimetableLocationView.js",
                    "js/modules/lessons/timetable-location/lessonTimetableLocationController.js",
                    "js/modules/lessons/dailyGroupsTimetable/dailyGroupsTimetableView.js",
                    "js/modules/lessons/dailyGroupsTimetable/dailyGroupsTimetableController.js",
                    "js/modules/lessons/dailyLocationsTimetable/dailyLocationsTimetableView.js",
                    "js/modules/lessons/dailyLocationsTimetable/dailyLocationsTimetableController.js",
                    "js/modules/lessons/dailyTeachersTimetable/dailyTeachersTimetableView.js",
                    "js/modules/lessons/dailyTeachersTimetable/dailyTeachersTimetableController.js",
                    "js/modules/lessons/find/lessonFindView.js",
                    "js/modules/lessons/find/lessonFindController.js",
                    "js/modules/lessons/report/lessonReportView.js",
                    "js/modules/lessons/report/lessonReportController.js",
                    "js/modules/lessons/lessonsModule.js",
                    "js/modules/account/show/accountShowView.js",
                    "js/modules/account/show/accountShowController.js",
                    "js/modules/account/welcome/welcomeView.js",
                    "js/modules/account/welcome/welcomeController.js",
                    "js/modules/account/invite/inviteView.js",
                    "js/modules/account/invite/inviteController.js",
                    "js/modules/account/accountModule.js",
                    "js/modules/reports/groupAttendance/groupAttendanceView.js",
                    "js/modules/reports/groupAttendance/groupAttendanceController.js",
                    "js/modules/reports/groupAttendance/groupAttendanceReport.js",
                    "js/modules/reports/teacherLessons/teacherLessonsView.js",
                    "js/modules/reports/teacherLessons/teacherLessonsController.js",
                    "js/modules/reports/teacherLessons/teacherLessonsReport.js",
                    "js/modules/reports/reportsModule.js",

                    "js/modules/personalVocabulary/edit/personalVocabularyEditView.js",
                    "js/modules/personalVocabulary/edit/personalVocabularyEditController.js",
                    "js/modules/personalVocabulary/list/personalVocabularyListView.js",
                    "js/modules/personalVocabulary/list/personalVocabularyListController.js",
                    "js/modules/personalVocabulary/personalVocabularyModule.js",

                    "js/modules/community/ask/askView.js",
                    "js/modules/community/ask/askController.js",
                    "js/modules/community/profile/profileView.js",
                    "js/modules/community/profile/profileController.js",
                    "js/modules/community/communityModule.js",

                    "js/core/googleAnalytics.js",
                    "js/core/hotjar.js"
                ],
                dest: "lampa.js"
            }
        },

        htmlmin: {                                     // Task
            dist: {                                      // Target
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    "build/index.html": "index.prod.html", // "destination": "source"
                    "build/app.html": "app.prod.html" // "destination": "source"
                }
            }
        },

        jst: {
            app: {
                options: {
                    prettify: true
                },
                files: {
                    "templates.js": ["templates/**/*.html"]
                }
            },
            login: {
                options: {
                    prettify: true
                },
                files: {
                    "login.templates.js": [
                        "templates/core/*.html",
                        "templates/security/*.html"
                    ]
                }
            }
        },

        svgmin: {
            options: {
                plugins: [
                    {
                        removeViewBox: false
                    },
                    {
                        removeUselessStrokeAndFill: false
                    }
                ]
            },

            dist: {
                files: [
                    {expand: true, cwd: "images", src: ["*.svg"], dest: "build/images/"},
                    {expand: true, cwd: "images/activity", src: ["*.svg"], dest: "build/images/activity"},
                    {expand: true, cwd: "images/group", src: ["*.svg"], dest: "build/images/group"},
                    {expand: true, cwd: "images/location", src: ["*.svg"], dest: "build/images/location"},
                    {expand: true, cwd: "images/user", src: ["*.svg"], dest: "build/images/user"}
                ]
            }
        },

        svgstore: {
            options: {},
            default: {
                files: {
                    "images/locations.svg": ["images/location/*.svg"]
                }
            }
        },

        jstdPhantom: {
            options: {},
            files: [
                "tests/client.jstd"
            ]
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-htmlmin");
    grunt.loadNpmTasks("grunt-contrib-jst");
    grunt.loadNpmTasks("grunt-svgstore");
    grunt.loadNpmTasks("grunt-svgmin");
    grunt.loadNpmTasks("grunt-jstestdriver-phantomjs");

    // tasks
    grunt.registerTask("default", ["less:app", "less:print", "concat:appDev", "jst:app"]);
    grunt.registerTask("login", ["less:login", "concat:login", "concat:indexDev", "jst:login"]);
    grunt.registerTask("no-php", ["less:login", "less:app", "concat:appDevNoPhp", "concat:indexDevNoPHP", "jst:app", "jst:login"]);

    grunt.registerTask(
        "build",
        [
            "clean",
            "less:login",
            "less:print",
            "less:app",
            "concat:login",
            "jst:login",
            "concat:appProd",
            "concat:indexProd",
            "concat:lampa",
            "copy",
            "jst",
            "htmlmin",
            "uglify",
            "svgmin"
        ]);
};