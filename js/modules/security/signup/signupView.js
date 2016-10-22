/**
 * Created by Roman on 5.2.2016.
 */

Lampa.module("SecurityModule.Signup", function (Signup, Lampa, Backbone, Marionette, $) {
    Signup.signupView = Marionette.LayoutView.extend({
        template: "security/sign-up",
        className: "",
        ui: {
            name: '#name',
            email: '#email',
            password: '#password',
            repeatedPwdLine: "#repeated-pwd-line",
            repeatedPwd: '#repeated-pwd',
            signUp: "#sign",
            teacher: "#techer",
            student: "#student"
        },
        onShow: function () {
            this.ui.name.focus();
        },
        events: {
            "click #sign": "doRegistration",
            "click #back": "goBack",
            "click #student": "noStudents",
            "change #name": "setName",
            "change #email": "setEmail",
            "change #password": "setPassword",
            "change #repeatedPwd": "setRepeatedPwd"
        },
        templateHelpers: function () {
            return {
                isPwdMatching: function () {
                    return Lampa.request('helper:getVisibilityIfPasswordAndRepeatedPwdMatching', this.password, this.repeatedPwd);
                },
                isPasswordLongEnough: function () {
                    return Lampa.request('helper:isPasswordLongEnough', this.password);
                }
            }
        },
        noStudents: function () {
            this.ui.teacher.prop("checked", true);
            alert('Sorry not implemented!');
        },
        setName: function () {
            this.model.set('name', this.ui.name.val());
            this.ui.email.focus();
        },
        setEmail: function () {
            this.model.set('email', this.ui.email.val());
            this.ui.password.focus();
        },
        setPassword: function () {
            this.model.set('password', this.ui.password.val());
            this.ui.repeatedPwd.focus();
        },
        setRepeatedPwd: function () {
            this.model.set('repeatedPwd', this.ui.repeatedPwd.val());
            this.ui.signUp.focus();
        },
        goBack: function () {
            Lampa.trigger('security:login');
        },
        doRegistration: function () {
            Lampa.request("signup:do", this.model);
        }
    });
});
