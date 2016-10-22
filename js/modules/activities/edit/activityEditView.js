/**
 * Created by Roman on 3.6.14.
 */
Lampa.module("ActivitiesModule.Edit", function (Edit, Lampa, Backbone, Marionette, $, _) {
    Edit.ActivityVote = Marionette.ItemView.extend({
        template: "activity/vote",
        events: {
            "click #vote": "vote"
        },
        modelEvents: {
            "change": "render"
        },
        vote: function () {
            if (this.model) {
                this.model.set("voted", !this.model.get("voted"));
                var _this = this;
                $.when(Lampa.request("activity:save:vote", this.model)).done(function (savedModel) {
                    _this.model = savedModel;
                });
            }
        }
    });

    Edit.Activity = Lampa.EditableItemView.extend({
        template: "activity/edit",
        className: "container",
        saveModelRequest: "activity:save",
        regions: {
            attachment: "#attachment",
            attachments: "#attachments",
            procedureRegion: "#procedure",
            voteRegion: "#vote"
        },
        ui: {
            "title": "#title",
            "instructions": "#instructions",
            "duration": "#duration",
            "source": "#source",
            "isRepeatable": "#isRepeatable",
            "tags": "#tags",
            "image": "#image",
            "materials": "#materials",
            "preparation": "#preparation",
            "speaking": "#speaking",
            "writing": "#writing",
            "reading": "#reading",
            "listening": "#listening"
        },
        events: {
            "click #save": "saveModel",
            "click #back": "goBack",
            "change": "serialize"
        },
        modelEvents: {
            "change:activityID": "render"
        },
        serialize: function () {
            try {
                this.model.set("title", this.ui.title.val());
                this.model.set("duration", this.ui.duration.val());
                this.model.set("source", this.ui.source.val());
                this.model.set("isRepeatable",this.ui.isRepeatable.val() ? 1 : 0);

                var skills = 0;
                if (this.ui.writing.is(":checked")) {
                    skills = 1;
                }

                if (this.ui.listening.is(":checked")) {
                    skills += 2;
                }

                if (this.ui.reading.is(":checked")) {
                    skills += 4;
                }

                if (this.ui.speaking.is(":checked")) {
                    skills += 8;
                }
                this.model.set("skills", skills);
                this.model.set("tags", this.ui.tags.val());
                this.model.set("materials", this.ui.materials.val());
                this.model.set("preparation", this.ui.preparation.val());
                this.model.set("instructions", this.ui.instructions.trumbowyg("html"));

                if (this.model.id) {
                    this.saveModel();
                }
            } catch (ex) {
                console.log(ex.message);
            }
        },
        behaviors: {
            Trumbowyg: {
                item: "instructions"
            }
        },
        onRender: function () {
            var activityID = this.model.get("activityID");
            if (activityID) {
                var _this = this;
                $.when(Lampa.request("attachments:entity:new", activityID)).done(function (model) {
                    _this.attachment.show(new Edit.AttachmentUpload({model: model}));
                });
                $.when(Lampa.request("attachments:entities", activityID)).done(function (collection) {
                    _this.attachments.show(new Edit.Attachments({collection: collection}));
                });
            }
        }
    });

    Edit.AttachmentUpload = Marionette.ItemView.extend({
        template: "activity/attachment-upload"
    });

    Edit.Attachment = Marionette.ItemView.extend({
        template: "activity/attachment-edit",
        tagName: "li",
        events: {
            "click .delete": "deleteItem"
        },
        deleteItem: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            var name = this.model.get("name");
            var message = "Do you want to delete this file? ";
            if (confirm(message + (name === null ? "" : name)) === true) {
                this.model.destroy();
            }
        }
    });

    Edit.Attachments = Marionette.CollectionView.extend({
        childView: Edit.Attachment,
        tagName: "ul"
    });
});

function onActivityAttachmentUploadFinish(activityID) {
    if (activityID) {
        Lampa.request("attachments:entities:refresh", activityID);
        $("#new-attachment").val("");
    }
}