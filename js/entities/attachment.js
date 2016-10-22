/**
 * Created by Roman on 7.4.15.
 */

Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Attachment = Backbone.Model.extend({
        url: function () {

            if (!this.get("name")) {
                return "";
            }

            if (!this.get("name")) {
                return Lampa.restUrl + "/key/" + Lampa.request("key:entity") + "/activity/" + this.get("activityID") + "/attachment";
            }

            return Lampa.restUrl + "/key/" + Lampa.request("key:entity") + "/activity/" + this.get("activityID") + "/attachment/" + this.get("name");
        },
        idAttribute: "name",
        defaults: {
            activityID: null,
            name: null,
            size: 0,
            uri: null,
            base: function () {
                return Lampa.restUrl + "/key/" + Lampa.request("key:entity");
            }
        }
    });

    Entities.Attachments = Backbone.Collection.extend({
        url: function () {
            return this.activityID ? Lampa.restUrl + "/key/" + Lampa.request("key:entity") + "/activity/" + this.activityID + "/attachments" : "";
        },
        model: Entities.Attachment,
        comparator: "uri",
        activityID: null
    });

    Entities.AttachmentsApi = Entities.Api.extend({
        getNewEntity: function (activityID) {
            var entity = new Entities.Attachment();
            entity.set("activityID", activityID);
            entity.set("link", Lampa.restUrl + "/key/" + Lampa.request("key:entity") + "/activity/" + activityID + "/attachment");
            return entity;
        },
        getNewEntities: function (activityID) {
            var entities = new Entities.Attachments();
            entities.activityID = activityID;
            return entities;
        },
        activityID: null,
        loadEntities: function (activityID) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();
            this.activityID = activityID;
            this.entities = this.getNewEntities(activityID);

            var parent = this;

            this.entities.fetch({
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    Lampa.trigger("error", this);
                },
                success: function (data) {
                    defer.resolve(data);
                    Lampa.trigger("progressBar:hide");
                    parent.entities = data;
                }
            });

            return defer;
        },
        getRefreshedEntities: function (activityID) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();

            if (this.activityID !== activityID) {
                this.entities = this.getNewEntities(activityID);
            }
            if (this.entities === null) {
                this.entities = this.getNewEntities(activityID);
            }

            var _this = this;
            this.entities.fetch({
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    Lampa.trigger("error", this);
                },
                success: function (data) {
                    Lampa.trigger("progressBar:hide");
                    _this.entities = data;
                    defer.resolve(data);
                }
            });

            return defer;
        },
        loadEntity: function (attachmentID) {
            Lampa.trigger("progressBar:show");
            var defer = new $.Deferred();

            this.entities = this.getNewEntity();
            this.entities.set("attachmentID", attachmentID);
            var _this = this;
            this.entities.fetch({
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    Lampa.trigger("error", this);
                },
                success: function (data) {
                    Lampa.trigger("progressBar:hide");
                    _this.entities = data;
                    defer.resolve(data);
                }
            });

            return defer;
        }
    });

    var api = new Entities.AttachmentsApi();

    Lampa.reqres.setHandler("attachments:entities", function (activityID) {
        return api.loadEntities(activityID);
    });

    Lampa.reqres.setHandler("attachments:entities:refresh", function (activityID) {
        return api.getRefreshedEntities(activityID);
    });

    Lampa.reqres.setHandler("attachments:entity", function (attachmentID) {
        return api.loadEntity(attachmentID);
    });

    Lampa.reqres.setHandler("attachments:entity:new", function (activityID) {
        return api.getNewEntity(activityID);
    });
});