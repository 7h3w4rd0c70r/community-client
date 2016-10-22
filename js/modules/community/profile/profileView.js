/**
 * Created by root on 15.1.16.
 */

Lampa.module("CommunityModule.Profile", function (Profile, Lampa, Backbone, Marionette, $, _) {
    
    Profile.EmptyProfile = Marionette.ItemView.extend({
        template: 'community/profile/empty/profiles'
    });
    Profile.EmptyAsk = Marionette.ItemView.extend({
        template: 'community/ask/empty/ask'
    });

    Profile.Ask = Marionette.ItemView.extend({
        template: 'community/profile/ask',
        events: {
            'click': 'showAsk'
        },
        showAsk: function () {
            Lampa.trigger('community:ask', this.model.get('askID'));
        }
    });

    Profile.Asks = Marionette.CollectionView.extend({
        childView: Profile.Ask,
        emptyView: Profile.EmptyAsk
    });

    Profile.Profile = Marionette.LayoutView.extend({
        template: 'community/profile/profile',
        regions: {
            profile: '#profile',
            asks: '#asks'
        },
        ui: {
            'followBtn': '#followBtn',
            'unfollowBtn': '#unfollowBtn'
        },
        events: {
            'click @ui.followBtn': 'follow',
            'click @ui.unfollowBtn': 'unfollow'
        },
        initialize: function () {
            var _this = this;
            Lampa.request('_meta:get', 'Profiles', 'followers').then(function (followers) {
                async.each(followers, function (follower, cb) {
                    follower['targetID'] == _this.model.get('accountID') && !_this.model.get('following') ?
                        _this.model.set('following', true) : { };
                    follower['followerID'] == _this.model.get('accountID') && !_this.model.get('followed') ?
                        _this.model.set('followed', true) : { };
                    cb();
                }, function () {
                    if (!_this.model.get('following')) _this.model.set('following', false);
                    if (!_this.model.get('followed')) _this.model.set('followed', false);
                });
            });
        },
        onShow: function () {
            var _this = this;
            if (this.model.get('followed'))
                this.ui.followBtn.html('Follow back');
            else
                this.ui.followBtn.html('Follow');
            if (this.model.get('following')) {
                this.ui.followBtn.addClass('disabled');
                this.ui.unfollowBtn.removeClass('disabled');
            } else {
                this.ui.followBtn.removeClass('disabled');
                this.ui.unfollowBtn.addClass('disabled');
            }
            Lampa.request('ask:entities', {
                author: _this.model.id,
                page: 1,
                limit: null,
                order: 'newest'
            }).then(function (asks) {
                _this.getRegion('asks').show(new Profile.Asks({
                    collection: asks
                }));
            });
        },
        showProfile: function () {
            Lampa.trigger('community:profile', this.model.get('accountID'));
        },
        follow: function () {
            var _this = this;
            if (this.model.get('following')) return;
            Lampa.request('follow', this.model.get('accountID')).then(function () {
                _this.showProfile();
            });
        },
        unfollow:function () {
            if (!this.model.get('following')) return;
            var _this = this;
            Lampa.request('unfollow', this.model.get('accountID')).then(function () {
                _this.showProfile();
            });
        }
    });
    
    Profile.Short = Marionette.ItemView.extend({
        template: 'community/profile/short',
        ui: {
            followBtn: '#followBtn',
            unfollowBtn: '#unfollowBtn',
            showProfile: '.showProfile'
        },
        events: {
            'click @ui.showProfile': 'showProfile',
            'click @ui.followBtn': 'follow',
            'click @ui.unfollowBtn': 'unfollow'
        },
        initialize: function () {
            var _this = this;
            Lampa.request('_meta:get', 'Profiles', 'followers').then(function (followers) {
                async.each(followers, function (follower, cb) {
                    follower['targetID'] == _this.model.get('accountID') && !_this.model.get('following') ?
                        _this.model.set('following', true) : { };
                    follower['followerID'] == _this.model.get('accountID') && !_this.model.get('followed') ?
                        _this.model.set('followed', true) : { };
                    cb();
                }, function () {
                    if (!_this.model.get('following')) _this.model.set('following', false);
                    if (!_this.model.get('followed')) _this.model.set('followed', false);
                });
            });
        },
        onShow: function () {
            if (this.model.get('followed'))
                this.ui.followBtn.html('Follow back');
            else
                this.ui.followBtn.html('Follow');
            if (this.model.get('following')) {
                this.ui.followBtn.addClass('disabled');
                this.ui.unfollowBtn.removeClass('disabled');
            } else {
                this.ui.followBtn.removeClass('disabled');
                this.ui.unfollowBtn.addClass('disabled');
            }
        },
        showProfile: function () {
            Lampa.trigger('community:profile', this.model.get('accountID'));
        },
        follow: function () {
            var _this = this;
            if (this.model.get('following')) return;
            Lampa.request('follow', this.model.get('accountID')).then(function () {
                _this.showProfile();
            });
        },
        unfollow:function () {
            if (!this.model.get('following')) return;
            var _this = this;
            Lampa.request('unfollow', this.model.get('accountID')).then(function () {
                _this.showProfile();
            });
        }
    });
    
    Profile.Profiles = Marionette.CollectionView.extend({
        childView: Profile.Short,
        emptyView: Profile.EmptyProfile
    });

    Profile.Index = Marionette.LayoutView.extend({
        template: 'community/profile/index',
        regions: {
            profiles: '#profiles'
        },
        ui: {
            search: '#search',
            terms: '#terms',
            cancelSearch: '#cancelSearch',
            cancelSearchBtn: '#cancelSearchBtn',
            direction: '#direction',
            page: '#page',
            changePage: '.changePage',
            previous: '[data-goto="previous"]',
            next: '[data-goto="next"]'
        },
        events: {
            'click @ui.cancelSearchBtn': 'cancelSearch',
            'click @ui.changePage': 'changePage',
            'change @ui.direction': 'changeDirection',
            'submit @ui.search': 'search'
        },
        initialize: function () {
            this.options.params = { };
        },
        onShow: function () {
            this.changePage();
        },
        showProfiles: function () {
            Lampa.trigger('progressBar:show');
            var _this = this;
            !this.options.params.terms ? this.ui.cancelSearch.hide() : this.ui.cancelSearch.show();
            Lampa.request('profile:entities', _this.options.params).then(function (profiles) {
                _this.getRegion('profiles').show(new Profile.Profiles({
                    collection: profiles
                }));
                _this.disableButtons();
                Lampa.trigger('progressBar:hide');
            });
        },
        changeDirection: function () {
            this.options.params.direction = this.ui.direction.val();
            this.showProfiles();
        },
        search: function (e) {
            e.preventDefault();
            this.options.params.terms = this.ui.terms.val();
            this.showProfiles();
        },
        cancelSearch: function () {
            this.options.params.terms = null;
            this.ui.terms.val('');
            this.showProfiles();
        },
        disableButtons: function () {
            var _this = this;
            this.ui.previous.prop('disabled', false);
            this.ui.previous.prop('disabled', false);
            if (this.options.params.page < 2)
                this.ui.previous.prop('disabled', true);
            Lampa.request('_meta:get', 'Profiles', 'count').then(function (count) {
                console.log(count);
                var pages = Math.ceil(count / 10);
                if (pages >= (_this.options.params.page + 1) || pages == 1)
                    _this.ui.next.prop('disabled', true);
            });
        },
        changePage: function (e) {
            this.disableButtons();
            if (!e)
                this.options.params.page = 1;
            else
                if ($(e.target).data('goto') == 'previous')
                    this.options.params.page -= 1;
                else
                    this.options.params.page += 1;
            this.ui.page.html(this.options.params.page);
            this.changeDirection();
        }
    });

    Profile.Me = Marionette.ItemView.extend({
        template: 'community/profile/me',
        ui: {
            nickname: '#nickname',
            summary: '#summary',
            goal: '#goal',
            interests: '#interests',
            save: '#save'
        },
        events: {
            'click @ui.save': 'save'
        },
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },
        save: function () {
            var _this = this,
                profile = this.model;
            profile.set('nickname', this.ui.nickname.val());
            profile.set('summary', this.ui.summary.val());
            profile.set('goal', this.ui.goal.val());
            profile.set('interests', this.ui.interests.val());
            Lampa.request('profile:save', profile).then(function (saved) {
                if (!saved)
                    Lampa.request('alert', 'An unexpected error heapend. Please try again later.', 'red');
                _this.model.set('nickname', saved.get('nickname'));
                _this.model.set('summary', saved.get('summary'));
                _this.model.set('goal', saved.get('goal'));
                _this.model.set('interests', saved.get('interests'));
            });
        }
    });

});

