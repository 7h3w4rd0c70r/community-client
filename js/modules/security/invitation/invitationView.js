/**
 * Created by Roman Brhel on 18.08.2016.
 */
Lampa.module("SecurityModule.Invitation", function (Invitation, Lampa, Backbone, Marionette, $) {
    Invitation.acceptView = Marionette.LayoutView.extend({
        template: "security/invitation",
        className: "container",
        regions: {'actionRegion': '#action'},
        onShow: function () {
            var isLogged = Lampa.request("key:entity") !== '';
            var parent = this;

            switch (this.model.get('type')) {
                case 0:
                    console.log('0 - sign up new school admin or freelancer');
                    if (isLogged) {
                        console.log('is logged');
                        Lampa.trigger('open:start-page');
                        break;
                    }

                    $.when(Lampa.request("signup:entity")).done(function (signUpModel) {
                        signUpModel.set('email', parent.model.get('email'));
                        signUpModel.set('name', parent.model.get('fullName'));
                        signUpModel.set('hash', parent.model.get('hash'));
                        parent.actionRegion.show(new Invitation.SignUpView({model: signUpModel}));
                    });

                    // todo: sign up new school admin or freelancer
                    break;
                case 1:
                    // add teacher to existing school
                    console.log('1 - add teacher to existing school');
                    if (!isLogged) {
                        console.log('is not logged');
                        $.when(Lampa.request("signup:entity")).done(function (signUpModel) {
                            signUpModel.set('email', parent.model.get('email'));
                            signUpModel.set('name', parent.model.get('fullName'));
                            signUpModel.set('hash', parent.model.get('hash'));
                            signUpModel.set('type', 'teacher');
                            parent.actionRegion.show(new Invitation.SignUpView({model: signUpModel}));
                        });
                    } else {
                        console.log('is logged');
                        $.when(Lampa.request("join:entity")).done(function (joinModel) {
                            joinModel.set('schoolID', parent.model.get('schoolID'));
                            joinModel.set('personID', parent.model.get('personID'));
                            joinModel.set('hash', parent.model.get('hash'));
                            joinModel.set('type', 'teacher');
                            parent.actionRegion.show(new Invitation.JoinView({model: joinModel}));
                        });
                    }
                    break;
                case 2:
                    console.log('2 - sign up new student, pay licence and join to existing school');
                    // todo: sign up new student, pay licence and join to existing school
                    break;
            }
        }
    });

    Invitation.SignUpView = Lampa.EditableItemView.extend({
        template: "security/newUser",
        ui: {
            'email': '#email',
            'name': "#name",
            'password': '#password',
            'repeatedPwd': '#repeatedPwd'
        },
        saveModelRequest: "signup:do",
        onShow: function () {
            this.ui.password.focus();
        }
    });

    Invitation.JoinView = Marionette.ItemView.extend({
        template: "security/join",
        ui: {"join": "#join"},
        events: {
            "click @ui.join": "joinToSchool"
        },
        joinToSchool: function () {

        }
    });
});