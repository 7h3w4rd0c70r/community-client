/**
 * Created by Roman on 26.1.15.
 */

Lampa.EditableItemView = Marionette.LayoutView.extend({
    className: "",
    events: {
        "click #save": "saveModel",
        "click #back": "goBack",
        "change": "serialize"
    },
    logEvent: function (e) {
        console.log("event", e.toJSON());
    },
    behaviors: {
        DateTimePicker: {serialize: this.serialize},
        Tooltips: {}
    },
    onShow: function (e) {
        if (!this.model) {
            Lampa.trigger("error", "Model is missing!");
        }
    },
    onBeforeDestroy: function (e) {
        this.saveModel(e);
    },
    goBack: function () {
        window.history.back();
    },
    renderItem: function (e) {
        if (!this.model) {
            throw Exception("Model is not exists!");
        }

        if (!this.template) {
            throw Exception("Template is not exists!");
        }

        try {
            if (this.currentView) {
                return this.currentView.render();
            }
            this.render();
        } catch (ex) {
            console.log(ex.message);
        }
    },
    doSerialisation: true,
    setSerialisation: function (status) {
        this.doSerialisation = status;
    },
    serialize: function (e) {
        if (e && this.ui && this.model) {
            if (e.target) {
                var element = this.ui[e.target.id];
                if (element === undefined) {
                    return;
                }
                if (element[0].tagName === "DIV") {
                    return;
                }

                if (typeof element[0].checkValidity === "function" && element[0].tagName !== "SELECT") {

                    if (!element[0].checkValidity()) {
                        element.focus();
                        $(element[0].parentElement.parentElement).addClass("has-error");
                    } else {
                        $(element[0].parentElement.parentElement).removeClass("has-error");
                    }
                }

                var value = Lampa.request("helper:getElementValue", element);
                if (value) {
                    this.model.set(e.target.id, value);
                }
            }
        }
        if (this.model && this.model.id) {
            this.saveModel();
        }
    },
    saveModelRequest: "",
    checkFormValidity: function () {
        var errors = 0;
        _.forEach(this.ui, function (element) {
            if (element[0] && element[0].tagName !== "DIV" && element[0].tagName !== "SELECT" && typeof element[0].checkValidity === "function" && !element[0].checkValidity()) {
                errors++;
                $(element[0].parentElement.parentElement).addClass("has-error");
                element.focus();
            }
        });
        return errors === 0;
    },
    saveModel: function (e) {
        var _this = this;
        var defer = new $.Deferred();
        try {
            if (this.saveModelRequest === "") {
                console.log("define request for saving model => saveModelRequest");
                return;
            }
            if (this.checkFormValidity()) {
                this.lockForm();
                $.when(Lampa.request(this.saveModelRequest, this.model)).done(function (model) {
                    _this.unlockForm();
                    defer.resolve(model);
                });
            } else {
                console.log("Form is invalid");
            }
        } catch (ex) {
            _this.unlockForm();
            console.log(ex.message);
        }
        return defer;
    },
    refreshChild: function (entityRequest, id, region) {
        $.when(Lampa.request(entityRequest, this.model.get(id)).done(
            function (model) {
                region.currentView.model = model;
                region.currentView.render();
            }
        ));
    },
    refreshChildren: function (entitiesRequest, id, region) {
        $.when(Lampa.request(entitiesRequest, this.model.get(id)).done(
            function (collection) {
                region.currentView.collection = collection;
                region.currentView.render();
            }
        ));
    },
    lockForm: function () {
        if (this.ui) {
            _.each(this.ui, function (element) {
                if (element[0] !== undefined) {
                    element[0].disabled = true;
                }
            });
        }
    },
    unlockForm: function () {
        if (this.ui) {
            _.each(this.ui, function (element) {
                if (element[0] !== undefined) {
                    element[0].disabled = false;
                }
            });
        }
    }
});