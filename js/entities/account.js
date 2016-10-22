/**
 * Created by Roman on 2.6.14.
 */

Lampa.module("Entities", function (Entities, Lampa, Backbone, Marionette, $, _) {
    Entities.Account = Backbone.Model.extend({
        isMyOwn: false,
        idAttribute: "accountID",
        url: function () {
            var link = Lampa.restUrl + "/key/" + Lampa.request("key:entity") + "/account";
            if (this.isMyOwn) {
                return link;
            }
            return link + "/" + this.get("accountID");
        },
        defaults: {
            accountID: null,
            fullName: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: ""
        }
    });

    Entities.Accounts = Backbone.Collection.extend({
        model: Entities.Account,
        comparator: "accountID",
        onlyCreators: false,
        url: function () {
            var key = Lampa.request("key:entity");

            var params = "";
            if (this.onlyCreators) {
                params = "&onlyCreators=true";
            }

            return Lampa.restUrl + "/key/" + key + "/accounts" + params;
        }
    });

    Entities.Avatar = Backbone.Model.extend({
        url: "",
        defaults: {
            link: ""
        }
    });

    Entities.PwdChange = Backbone.Model.extend({
        url: function () {
            return Lampa.restUrl + "/key/" + Lampa.request("key:entity") + "/account/password";
        },
        defaults: {
            oldPwd: null,
            newPwd: null,
            retypedNewPwd: null
        }
    });

    Entities.AcountsApi = Entities.Api.extend({
        idAttribute: "accountID",
        entityName: "account",
        getNewEntity: function () {
            var account = new Entities.Account();
            account.isMyOwn = true;
            return account;
        },
        getNewEntities: function () {
            return new Entities.Accounts();
        },
        getNewPwd: function () {
            return new Entities.PwdChange();
        },
        setNewPwd: function (model) {
            var defer = new $.Deferred();
            if (model) {
                model.save(null, {
                    error: function () {
                        defer.resolve(false);
                    },
                    success: function (data) {
                        defer.resolve(data.get("status") === "ok");
                    }
                });
            }
            return defer;
        },
        getList: function () {
            if (!this.entities) {
                this.entities = new Entities.Accounts();
            }
            return this.entities;
        },
        entityIsInList: function (accountID) {
            return _.findWhere(this.getList(), {"accountID": accountID}) === undefined;
        },
        addToList: function (entity) {
            var list = this.getList();

            if (!this.entityIsInList()) {
                list.add(entity);
            }
        },
        myEntity: null,
        getMyEntity: function () {
            var defer = new $.Deferred();
            if (this.myEntity) {
                return defer.resolve(this.myEntity);
            }

            this.myEntity = this.getNewEntity();
            this.myEntity.fetch({
                error: function () {
                    Lampa.trigger("progressBar:hide");
                    console.log("activity.fetch error!");
                },
                success: function (data) {
                    Lampa.trigger("progressBar:hide");
                    defer.resolve(data);
                }
            });

            return defer;
        },
        getAvatar: function () {
            var avatar = new Entities.Avatar();
            avatar.set("link", Lampa.restUrl + "/key/" + Lampa.request("key:entity") + "/account/avatar");
            return avatar;
        }
    });

    var api = new Entities.AcountsApi();

    Lampa.reqres.setHandler("accounts:entities", function () {
        return api.loadEntities();
    });

    Lampa.reqres.setHandler("accounts:creators", function () {
        return api.loadEntities("creatorsOnly");
    });

    Lampa.reqres.setHandler("account:entity", function (id) {
        return api.loadEntity(id);
    });

    Lampa.reqres.setHandler("account:addToList", function (id) {
        api.addToList(api.loadEntity(id));
    });

    Lampa.reqres.setHandler("account:my", function () {
        return api.getMyEntity();
    });

    Lampa.reqres.setHandler("account:save", function (model) {
        return api.saveEntity(model);
    });

    Lampa.reqres.setHandler("account:avatar", function () {
        return api.getAvatar();
    });

    Lampa.reqres.setHandler("account:get:pwd", function () {
        return api.getNewPwd();
    });
    Lampa.reqres.setHandler("account:set:pwd", function (model) {
        return api.setNewPwd(model);
    });
});