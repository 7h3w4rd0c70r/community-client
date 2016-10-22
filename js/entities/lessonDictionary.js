/**
 * Created by Roman on 28.9.14.
 */
Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.DictionaryItem = Backbone.Model.extend({
        url: function () {
            var link = Lampa.restUrl + "/key/" + Lampa.request("key:entity") + "/lesson/" + this.get("lessonID") + "/dictionary";
            if (this.get("dictionaryID")) {
                link += "/" + this.get("dictionaryID");
            }
            return link;
        },
        idAttribute: "dictionaryID",
        defaults: {
            dictionaryID: null,
            lessonID: null,
            term: null,
            translation: null
        }
    });

    Entities.LessonDictionary = Backbone.Collection.extend({
        model: Entities.DictionaryItem,
        comparator: "term",
        idValue: null,
        url: function () {
            var key = Lampa.request("key:entity");
            if (this.idValue === null) {
                return Lampa.restUrl;
            }
            return Lampa.restUrl + "/key/" + key + "/lesson/" + this.idValue + "/dictionary";
        }
    });

    Entities.GroupDictionary = Backbone.Collection.extend({
        model: Entities.DictionaryItem,
        comparator: "term",
        idValue: null,
        url: function () {
            var key = Lampa.request("key:entity");
            if (this.idValue === null) {
                return Lampa.restUrl;
            }
            return Lampa.restUrl + "/key/" + key + "/dictionary/group/" + this.idValue;
        }
    });

    Entities.DictionaryHeader = Backbone.Model.extend({
        url: function () {
            var key = Lampa.request("key:entity");
            if (this.get("column") === "" || !this.get("column")) {
                return Lampa.restUrl + "/key/" + key + "/dictionary/";
            }
            return Lampa.restUrl + "/key/" + key + "/dictionary/" + this.get("column") + "/" + this.get("value");
        },
        idAttribute: "column",
        defaults: {
            column: "",
            value: null,
            label: ""
        }
    });

    Entities.GroupDictionarySubgroup = Backbone.Collection.extend({
        model: Entities.DictionaryHeader,
        comparator: "term",
        subgroupColumn: "lessonID",
        subgroupColumnValue: null,
        url: function () {
            var key = Lampa.request("key:entity");
            if (this.groupID === null) {
                return Lampa.restUrl;
            }
            return Lampa.restUrl + "/key/" + key + "/dictionary/" + this.subgroupColumn;
        }
    });

    Entities.GroupDictionarySubgroupItems = Backbone.Collection.extend({
        model: Entities.DictionaryItem,
        comparator: "term",
        subgroupColumn: "lessonID",
        subgroupColumnValue: null,
        url: function () {
            var key = Lampa.request("key:entity");
            if (this.subgroupColumn) {
                return Lampa.restUrl + "/key/" + key + "/dictionary/" + this.subgroupColumn + "/" + this.subgroupColumnValue;
            }
            return Lampa.restUrl;
        }
    });

    Entities.LessonWithDictionary = Backbone.Model.extend({
        url: "",
        defaults: {
            lessonID: "",
            start: "",
            name: ""
        }
    });

    Entities.LessonsWithDictionary = Backbone.Collection.extend({
        model: Entities.LessonWithDictionary,
        idValue: null,
        url: function () {
            var key = Lampa.request("key:entity");
            return (this.idValue === null) ? Lampa.restUrl : Lampa.restUrl + "/key/" + key + "/group/" + this.idValue + "/lessons/dictionary";
        }
    });

    Entities.LessonDictionaryApi = Entities.Api.extend({
        entityName: "Vocabulary",
        getNewEntity: function () {
            return new Entities.DictionaryItem();
        },
        getNewEntities: function (lessonID) {
            var collection = new Entities.LessonDictionary();
            collection.idValue = lessonID;
            return collection;
        },
        idAttribute: "groupID",
        lessonEntities: null,
        getLessonEntities: function () {
            if (this.lessonEntities === null) {
                this.lessonEntities = new Entities.LessonDictionary();
            }
            return this.lessonEntities;
        },
        addItemToLessonEntities: function (model) {
            var collection = this.getEntities();
            collection.add(model);
        },
        loadLessonEntities: function (lessonID) {
            var defer = new $.Deferred();
            var dictionary = this.getLessonEntities();
            dictionary.lessonID = lessonID;
            dictionary.fetch({
                error: function () {
                    Lampa.trigger("error", this);
                },
                success: function (data) {
                    defer.resolve(data);
                }
            });
            return defer;
        },
        getLessonDictionaryEntities: function (lessonID) {
            var defer = new $.Deferred();
            var dictionary = new Entities.LessonDictionary();
            dictionary.idValue = lessonID;
            dictionary.fetch({
                error: function () {
                    Lampa.error(attributes);
                },
                success: function (data) {
                    defer.resolve(data);
                }
            });
            return defer;
        },
        saveLessonEntities: function (lessonID) {
            var defer = new $.Deferred();
            try {
                Lampa.trigger("progressBar:show");
                var collection = this.getLessonEntities();
                collection.lessonID = lessonID;

                if (collection.length === 0) {
                    defer.resolve(true);
                } else {
                    collection.each(function (model) {
                        model.set("lessonID", lessonID);
                        if (model.get("term").trim() !== "" && model.hasChanged()) {
                            model.save(null, {
                                error: function () {
                                    Lampa.trigger("progressBar:hide");
                                    Lampa.error(attributes);
                                },
                                success: function () {
                                    defer.resolve(true);
                                    Lampa.trigger("progressBar:hide");
                                }
                            });
                        } else {
                            defer.resolve(true);
                        }
                    });
                }
            } catch (ex) {
                console.log(ex.message);
                defer.resolve(false);
            }
            return defer;
        },
        groupEntities: null,
        getGroupEntities: function () {
            if (this.groupEntities === null) {
                this.groupEntities = new Entities.GroupDictionary();
            }
            return this.groupEntities;
        },
        loadGroupEntities: function (groupID) {
            var defer = new $.Deferred();
            var dictionary = this.getGroupEntities();
            dictionary.groupID = groupID;

            dictionary.fetch({
                error: function () {
                    Lampa.trigger("error", this);
                },
                success: function () {
                    defer.resolve(dictionary);
                }
            });
            return defer;
        },
        getLessonsWithDictionary: function (groupID) {
            var defer = new $.Deferred();
            var lessons = new Entities.LessonsWithDictionary();
            lessons.idValue = groupID;

            lessons.fetch({
                error: function () {
                    console.log("getLessonsWithDictionary: Unspecified error occurred!!");
                },
                success: function (data) {
                    defer.resolve(data);
                }
            });
            return defer;
        }
    });

    var api = new Entities.LessonDictionaryApi();

    Lampa.reqres.setHandler("dictionary:entity:new", function () {
        return api.getNewEntity();
    });

    Lampa.reqres.setHandler("dictionary:entity:get", function (dictionaryID) {
        return api.loadEntity(dictionaryID);
    });

    Lampa.reqres.setHandler("dictionary:entity:save", function (model) {
        return api.saveEntitySilently(model);
    });

    Lampa.reqres.setHandler("lesson:dictionary:add", function (model) {
        return api.addItemToLessonEntities(model);
    });

    Lampa.reqres.setHandler("dictionary:lesson:entities", function () {
        return api.getLessonEntities();
    });

    Lampa.reqres.setHandler("lessons:with:dictionary", function (groupID) {
        return api.getLessonsWithDictionary(groupID);
    });

    Lampa.reqres.setHandler("lesson:dictionary:entities", function (lessonID) {
        return api.loadEntities(lessonID);
    });

    Lampa.reqres.setHandler("lesson:dictionary:get", function (lessonID) {
        return api.getLessonDictionaryEntities(lessonID);
    });

    Lampa.reqres.setHandler("dictionary:lesson:save", function (lessonID) {
        return api.saveLessonEntities(lessonID);
    });

    Lampa.reqres.setHandler("dictionary:group:load", function (groupID) {
        return api.loadGroupEntities(groupID);
    });

    Lampa.reqres.setHandler("dictionary:group:entities", function () {
        return api.getGroupEntities();
    });
});