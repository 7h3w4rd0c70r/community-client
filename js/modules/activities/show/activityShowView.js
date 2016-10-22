/**
 * Created by Roman on 3.6.14.
 */
Lampa.module("ActivitiesModule.Show", function (Show, Lampa, Backbone, Marionette, $, _) {
    Show.Activity = Marionette.LayoutView.extend({
        template: "activity/show",
        className: "container",
        events: {
            "click #edit": "editActivityId",
            "click #delete": "deleteActivity",
            "click #back": "goBack",
            "click #push": "pushToClipboard"
        },
        modelEvents: {
            "change": "render"
        },
        regions: {
            voteRegion: "#vote",
            attachmentsRegion: "#attachments"
        },
        onRender: function () {
            var activityID = this.model.get("activityID");
            if (activityID) {
                var _this = this;
                $.when(Lampa.request("activity:get:vote", activityID)).done(function (voteModel) {
                    _this.voteRegion.show(new Show.ActivityVote({model: voteModel}));
                });

                $.when(Lampa.request("attachments:entities", activityID)).done(function (collection) {
                    _this.attachmentsRegion.show(new Show.Attachments({collection: collection}));
                });
            }
        },
        goBack: function () {
            window.history.back();
        },
        editActivityId: function () {
            Lampa.trigger("activity:edit", this.model.id);
        },
        deleteActivity: function () {
            Lampa.request("activity:delete", this.model);
        },
        pushToClipboard: function () {
            Lampa.request("activity:clipboard:push", this.model);
            this.render();
        },
        publish: function () {
            var toPublishModel = Lampa.request("activity:new");
            toPublishModel.set("createdBy", this.model.get("createdBy"));
            toPublishModel.set("title", this.model.get("title"));
            toPublishModel.set("instructions", this.model.get("instructions"));
            toPublishModel.set("duration", this.model.get("duration"));
            toPublishModel.set("isRepeatible", this.model.get("isRepeatible"));
            toPublishModel.set("status", 2);
        }
    });

    Show.EmptyListItem = Marionette.ItemView.extend({
        template: "lesson/none",
        tagName: "li",
        className: "text-center"
    });

    Show.Attachment = Marionette.ItemView.extend({
        template: "activity/attachment",
        tagName: "li"
    });

    Show.Attachments = Marionette.CollectionView.extend({
        childView: Show.Attachment,
        emptyView: Show.EmptyListItem,
        tagName: "ul"
    });

    Show.ActivityVote = Marionette.ItemView.extend({
        template: "activity/vote",
        events: {
            "click #vote": "vote"
        },
        modelEvents: {
            "change": "render"
        },
        vote: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.model.set("voted", !this.model.get("voted"));
            $.when(Lampa.request("activity:save:vote", this.model), this).done(function (savedModel, parent) {
                parent.model = savedModel;
            });
        }
    });
});