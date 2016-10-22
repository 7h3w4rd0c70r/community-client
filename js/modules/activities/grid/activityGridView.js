/**
 * Created by Roman on 23.5.14.
 */

Lampa.module("ActivitiesModule.Grid", function (Grid, Lampa, Backbone, Marionette, $, _) {
    Grid.Layout = Marionette.LayoutView.extend({
        template: "activity/layout",
        ui: {
            "keyword": "#search-input",
            "search": "#search-btn",
            "duration": "#duration",
            "condition": "#condition",
            "publicTab": "#public",
            "privateTab": "#private",
            "sharedTab": "#shared"
        },
        regions: {
            publicRegion: "#public",
            privateRegion: "#private",
            sharedRegion: "#shared"
        },
        initialize: function () {
            this.searchData();
        },
        events: {
            "click @ui.search": "searchData",
            "change @ui.keyword": "setKeyword",
            "change @ui.duration": "setDuration",
            "change @ui.condition": "setCondition"
        },
        modelEvents: {
            "change:public": "render",
            "change:private": "render",
            "change:shared": "render"
        },
        setKeyword: function () {
            this.model.set("keyword", (this.ui.keyword) ? String(this.ui.keyword.val()) : "");
            this.setNavigation();
        },
        setDuration: function () {
            this.model.set("duration", (this.ui.duration) ? Number(this.ui.duration.val()) : 0);
            this.setNavigation();
        },
        setCondition: function () {
            this.model.set("condition", (this.ui.condition) ? String(this.ui.condition.val()) : "bigger");
            this.setNavigation();
        },
        setNavigation: function () {
            var param = "?";
            if (this.model.get("keyword")) {
                var keyword = encodeURIComponent(String(this.model.get("keyword")).trim());
                param += this.model.get("keyword") ? ("keyword=" + keyword) : "";
            }
            if (this.model.get("duration") > 0) {
                param += this.model.get("duration") ? ("&duration=" + this.model.get("duration")) : "";
                param += this.model.get("condition") ? ("&condition=" + this.model.get("condition")) : "";
            }
            param = param.trim("&");
            param = (param === "?") ? "" : param;
            Lampa.navigate("activities/grid" + param);
        },
        searchData: function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            var _this = this;
            $.when(
                Lampa.request("activity:search", this.collection, this.model.get("keyword"), this.model.get("duration"), this.model.get("condition")),
                Lampa.request("account:my")
            )
                .then(
                    function (collection, account) {
                        var publicCollection = new Backbone.Collection(collection.filter(function (a) {
                            return a.get("isPublic") === 1 || a.get("isShared") === 1;
                        }));
                        _this.model.set("public", publicCollection.length);

                        var privateCollection = new Backbone.Collection(collection.filter(function (a) {
                            return (a.get("createdBy") === account.get("accountID") || a.get("voted") === 1);
                        }));
                        _this.model.set("private", privateCollection.length);
                        _this.publicRegion.show(new Grid.Activities({collection: publicCollection}));
                        _this.privateRegion.show(new Grid.Activities({collection: privateCollection}));
                    }
                );
        }
    });

    Grid.Activity = Marionette.ItemView.extend({
        tagName: "li",
        attributes: {
            draggable: "true"
        },
        template: "activity/grid-item",
        className: "clickable",
        events: {
            "click": "showActivityClicked"
        },
        showActivityClicked: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("activity:show", this.model.id);
        }
    });

    Grid.NoActivities = Marionette.ItemView.extend({
        template: "activity/none",
        tagName: "li",
        className: "clickable to-bottom",
        events: {
            "click": "showActivityClicked"
        },
        showActivityClicked: function (e) {
            e.preventDefault();
            e.stopPropagation();
            Lampa.trigger("activity:add");
        }
    });

    Grid.Activities = Marionette.CompositeView.extend({
        tagName: "div",
        template: "activity/grid",
        childView: Grid.Activity,
        emptyView: Grid.NoActivities,
        childViewContainer: "ul.grid"
    });
});