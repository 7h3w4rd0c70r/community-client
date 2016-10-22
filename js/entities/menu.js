/**
 * Created by Roman on 11.7.14.
 */

Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.MenuItem = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity");
            if (this.get('menuID') !== undefined) {
                return Lampa.restUrl + "/key/" + key + '/menu/' + this.get('menuID');
            }
            return '';
        },
        defaults: {
            menuID: null,
            title: null,
            uri: null,
            icon: null,
            isSelected: false
        }
    });

    Entities.MenuItems = Backbone.Collection.extend({
        url: function () {
            var key = Lampa.request("key:entity");
            return Lampa.restUrl + "/key/" + key + '/menu';
        },
        model: Entities.MenuItem,
        comparator: "menuID"
    });

    Entities.MenuItemsApi = Entities.Api.extend({
        menu: null,
        currentEntity: null,
        getMenuEntities: function () {
            if (this.menu === null) {
                this.menu = new Entities.MenuItems();
            }
            this.menu.fetch();

            return this.menu;
        },
        logout: function () {
            this.menu.reset();
        },
        getCurrentMenuEntity: function () {
            return this.currentEntity || null;
        },
        setCurrentMenuEntity: function (entity) {
            this.currentEntity = entity;
        },
        getHowToMenu: function () {
            return {
                "title": "How",
                "subtitle": "To ...",
                "module": "",
                "icon": "question-sign",
                "submenu": [
                    {
                        title: 'Getting Started',
                        link: 'account/welcome',
                        newWindow: false
                    },
                    {
                        "title": 'Set up your “School”',
                        "link": 'http://mylampa.com/tutorials/#school',
                        "newWindow": true
                    },
                    {
                        "title": 'Set up your “Locations”',
                        "link": 'http://mylampa.com/tutorials/#locations',
                        "newWindow": true
                    },
                    {
                        "title": 'Set up your “Courses”',
                        "link": 'http://mylampa.com/tutorials/#courses',
                        "newWindow": true
                    },
                    {
                        "title": 'Set up your “Teachers”',
                        "link": 'http://mylampa.com/tutorials/#teachers',
                        "newWindow": true
                    },
                    {
                        "title": 'Set up your “Groups”',
                        "link": 'http://mylampa.com/tutorials/#groups',
                        "newWindow": true
                    },
                    {
                        "title": 'Set up your “Students”',
                        "link": 'http://mylampa.com/tutorials/#students',
                        "newWindow": true
                    },
                    {
                        "title": 'Set up your “Lessons”',
                        "link": 'http://mylampa.com/tutorials/#lessons',
                        "newWindow": true
                    }
                ],
                "link": "http://mylampa.com/tutorials/",
                "newWindow": true
            }
        },
        getInviteMenu: function () {
            return {
                "title": "Invite",
                "subtitle": "Peers",
                "module": "account",
                "icon": "send",
                "submenu": [],
                "link": "account/invite",
                "newWindow": false
            };
        },
        getResourcesMenu: function () {
            return {
                "title": "my",
                "subtitle": "resources",
                "module": "activities",
                "icon": "book",
                "submenu": [],
                "link": "activities/grid",
                "newWindow": false
            };
        },
        getUserMenu: function () {
            return {
                "title": "my",
                "subtitle": "account",
                "module": "account",
                "icon": "user",
                "submenu": [],
                "link": "account/show",
                "newWindow": false
            }
        },
        getCommunityMenu: function () {
            return {
                "title": "my",
                "subtitle": "community",
                "module": "community",
                "icon": "globe",
                "submenu": [
                    {"title": "Ask LAMPA", "link": "community/asks", "newWindow": false},
                    {"title": "Search for profile", "link": "community/profiles", "newWindow": false},
                    {"title": "My profile", "link": "community/profile", "newWindow": false}
                ],
                "link": "",
                "newWindow": false
            };
        },
        getSetupMenu: function () {
            return {
                "title": "Set",
                "subtitle": "up",
                "module": "group",
                "icon": "cog",
                "submenu": [
                    {"title": 'school', "link": 'school', "newWindow": false},
                    {"title": 'locations', "link": 'locations', "newWindow": false},
                    {"title": 'courses', "link": 'courses', "newWindow": false},
                    {"title": 'teachers', "link": 'teachers', "newWindow": false},
                    {"title": 'groups', "link": 'groups', "newWindow": false},
                    {"title": 'students', "link": 'students', "newWindow": false}
                ],
                "link": "",
                "newWindow": false
            };
        },
        getAdminMenu: function () {
            return new Entities.MenuItems([
                this.getCommunityMenu(),
                {
                    "title": "my",
                    "subtitle": "lessons",
                    "module": "lesson",
                    "icon": "calendar",
                    "submenu": [
                        //{"title": "My timetables", "link": 'lesson/grid?teacher=myself', "newWindow": false},
                        {title: "Add Lessons", "link": 'lesson/add'},
                        {title: "Find Lessons", "link": 'lesson/find'},
                        //{title: "divider", "link": ''},
                        {title: "Running Timetables", "link": 'lesson/timetable'},
                        {title: "Daily Teachers ", "link": 'lesson/daily-teachers-timetable'},
                        {title: "Daily Locations", "link": 'lesson/daily-locations-timetable'},
                        {title: "Daily Groups ", "link": 'lesson/daily-groups-timetable'}

                    ],
                    "link": "",
                    "newWindow": false
                },
                this.getResourcesMenu(),
                {
                    "title": "my",
                    "subtitle": "reports",
                    "module": "reports",
                    "icon": "list-alt",
                    "submenu": [
                        {"title": "Group Attendance", "link": 'reports/attendance', "newWindow": false},
                        {"title": "Teacher Lessons", "link": 'reports/lessons', "newWindow": false}
                    ],
                    "link": "",
                    "newWindow": false
                },
                this.getSetupMenu(),
                this.getUserMenu(),
                this.getHowToMenu(),
                this.getInviteMenu()
            ]);
        },
        getTeacherMenu: function () {
            return new Entities.MenuItems([
                this.getCommunityMenu(),
                this.getResourcesMenu(),
                {
                    "title": "my",
                    "subtitle": "lessons",
                    "module": "lesson",
                    "icon": "calendar",
                    "submenu": [],
                    "link": "lesson/grid?teacher=myself",
                    "newWindow": false
                },
                this.getUserMenu(),
                this.getInviteMenu()
            ]);
        },
        getStudentMenu: function () {
            return new Entities.MenuItems([
                {
                    "title": "my",
                    "subtitle": "studies",
                    "module": "studies",
                    "icon": "pencil",
                    "submenu": [],
                    "link": "homework",
                    "newWindow": false
                },
                {
                    "title": "my",
                    "subtitle": "lessons",
                    "module": "lesson",
                    "icon": "list-alt",
                    "submenu": [],
                    "link": "lesson/list?student=myself",
                    "newWindow": false
                },
                {
                    "title": "my",
                    "subtitle": "Dictionary",
                    "module": "dictionary",
                    "icon": "book",
                    "submenu": [],
                    "link": "dictionary",
                    "newWindow": false
                },
                this.getUserMenu()
            ]);
        },
        getEmptyMenu: function () {
            return new Entities.MenuItems([]);
        },
        getMenu: function () {
            var role = Lampa.request("access:get:role");
            switch (role) {
                case "t":
                    return this.getTeacherMenu();
                case "a":
                    return this.getAdminMenu();
                case "s":
                    return this.getStudentMenu();
                default:
                    return this.getEmptyMenu();
            }
        }
    });

    var api = new Entities.MenuItemsApi();

    Lampa.reqres.setHandler("menu:entities", function () {
        return api.getMenu();
    });

    Lampa.reqres.setHandler("menu:current:get", function () {
        return api.getCurrentMenuEntity();
    });

    Lampa.reqres.setHandler("menu:current:set", function (entity) {
        api.setCurrentMenuEntity(entity);
    });
});
