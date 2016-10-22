/**
 * Created by Roman on 15.12.14.
 */

Lampa.module("CommunityModule.Ask", function (Ask, Lampa, Backbone, Marionette, $, _) {

    Ask.EmptyComment = Marionette.ItemView.extend({ template: 'community/ask/empty/comment' });
    Ask.EmptyAnswer = Marionette.ItemView.extend({ template: 'community/ask/empty/answer' });
    Ask.EmptyAsk = Marionette.ItemView.extend({ template: 'community/ask/empty/ask' });

    Ask.Comment = Marionette.ItemView.extend({
        template: 'community/ask/comment',
        ui: {
            removeBtn: '#removeComment',
            editBtn: '#editComment'
        },
        events: {
            'click @ui.removeBtn': 'delete'
        },
        initialize: function () {
            var _this = this,
                authorID = this.model.attributes.authorID;
            Lampa.request('profile:entity', authorID).then(function (profile) {
                _this.model.set('authorName', profile.get('fullName'));
            }).then(function () {
                _this.render();
            });
        },
        delete: function () {
            var _this = this;
            Lampa.request('confirm',
                'Do you really want to remove this comment?'
            ).then(function (res) {
                if (!res) return;
                Lampa.trigger('progressBar:show');
                Lampa.request('comment:destroy', _this.model).then(function () {
                    Lampa.trigger('progressBar:hide');
                });
            });
        }
    });
    Ask.Answer = Marionette.LayoutView.extend({
        template: 'community/ask/answer',
        regions: {
            comments: '.comments'
        },
        ui: {
            showComments: '#showComments',
            commentBtn: '#commentBtn',
            removeBtn: '#removeAnswer',
            editBtn: '#editBtn',
            modalComment: '#modalComment',
            commentContent: '#commentContent',
            saveComment: '#saveComment'
        },
        events: {
            'click @ui.showComments': 'showComments',
            'click @ui.commentBtn': function () {
                this.ui.commentContent.trumbowyg({
                    autogrow: true,
                    mobile: true,
                    tablet: true,
                    resetCss: true,
                    removeformatPasted: true
                });
                this.ui.modalComment.modal('show');
            },
            'click @ui.removeBtn': 'delete',
            'click @ui.saveComment': 'comment'
        },
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },
        onShow: function () {
            var _this = this;
            Lampa.request('profile:entity', _this.model.get('authorID')).then(function (profile) {
                _this.model.set('authorName', profile.get('fullName'));
            });
        },
        showComments: function () {
            var _this = this;
            Lampa.request('comment:entities', _this.model.id, {
                page: _this.model.options.page,
                order: _this.model.options.order
            }).then(function (comments) {
                _this.getRegion('comments').show(new Ask.Comments({
                    collection: comments
                }));
            });
        },
        comment: function () {
            var _this = this,
                comment = this.model.options.comment,
                content = this.ui.commentContent.trumbowyg('html');
            if (!content || /^\s*$/.test(content))
                return Lampa.request('alert', 'Your comment is empty. You cannot post an empty comment.', 'blue', 'Empty comment');
            Lampa.trigger('progressBar:show');
            comment.set('content', content);
            comment.set('answerID', this.model.id);
            Lampa.request('comment:save', comment).then(function () {
                _this.showComments();
                Lampa.trigger('progressBar:hide');
            });
            _this.model.options.comment = Lampa.request('comment:entity');
        },
        delete: function () {
            var _this = this;
            Lampa.request('confirm',
                'Do you really want to delete this answer?'
            ).then(function (res) {
                if (!res) return;
                Lampa.trigger('progressBar:show');
                Lampa.request('answer:destroy', _this.model).then(function () {
                    Lampa.trigger('progressBar:hide');
                });
            });
        }
    });
    Ask.Ask = Marionette.LayoutView.extend({
        template: 'community/ask/ask',
        regions: {
            answers: '.answers'
        },
        ui: {
            answerBtn: '#answerBtn',
            removeBtn: '#removeAsk',
            editBtn: '#editAsk',
            editQuestion: '#askEditQuestion',
            editContent: '#askEditContent',
            saveAsk: '#saveEditedAsk',
            modalAnswer: '#modalAnswer',
            modalEdit: '#modalEdit',
            answerContent: '#answerContent',
            saveAnswer: '#saveAnswer',
            profileBtn: '.author',
            toggleShow: '.toggleShow',
            content: '.content',
            indenttop: '.indent-top'
        },
        events: {
            'click @ui.answerBtn': function () {
                this.ui.answerContent.trumbowyg({
                    autogrow: true,
                    mobile: true,
                    tablet: true,
                    resetCss: true,
                    removeformatPasted: true
                });
                this.ui.modalAnswer.modal('show');
            },
            'click @ui.saveAnswer': 'answer',
            'click @ui.removeBtn': 'delete',
            'click @ui.editBtn': function () {
                this.ui.editContent.trumbowyg({
                    autogrow: true,
                    mobile: true,
                    tablet: true,
                    resetCss: true,
                    removeformatPasted: true
                });
                this.ui.editContent.trumbowyg('html', this.model.get('content'));
                this.ui.modalEdit.modal('show');
            },
            'click @ui.saveAsk': 'saveAsk',
            'click @ui.profileBtn': function () {
                Lampa.trigger('community:profile', this.model.get('authorID'));
            },
            'click @ui.toggleShow': function () {
                this.ui.content.toggle(500);
                if (this.ui.content.is(':visible'))
                    this.ui.toggleShow.html('Show less');
                else
                    this.ui.toggleShow.html('Show more');
            },
            'focus @ui.profileBtn': 'toogleFollow',
            'hover @ui.profileBtn': 'toggleFollow'
        },
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },
        onShow: function () {
            var _this = this;
            if (this.options._caller && this.options._caller == 'controller.ask')
                this.ui.indenttop.addClass('col-sm-offset-3');
            if (/^\s*$/.test(this.model.get('content')))
                this.ui.toggleShow.hide();
            Lampa.request('profile:entity', _this.model.get('authorID')).then(function (profile) {
                _this.model.set('authorName', profile.get('fullName'));
            }).then(function () {
                _this.ui.content.toggle(1);
                _this.showAnswers();
            });
        },
        showAnswers: function () {
            Lampa.trigger('progressBar:show');
            var _this = this;
            Lampa.request('answer:entities', _this.model.id, {
                page: _this.options.page,
                order: _this.options.order
            }).then(function (answers) {
                _this.getRegion('answers').show(new Ask.Answers({
                    collection: answers
                }));
                Lampa.trigger('progressBar:hide');
            });
        },
        answer: function () {
            var _this = this,
                answer = this.model.options.answer,
                content = this.ui.answerContent.trumbowyg('html');
            if (!content || /^\s*$/.test(content))
                return Lampa.request('alert', 'Your answer is empty. You cannot post an empty answer.', 'blue', 'Empty answer');
            Lampa.trigger('progressBar:show');
            answer.set('content', content);
            answer.set('askID', this.model.id);
            Lampa.request('answer:save', answer).then(function () {
                _this.showAnswers();
                _this.model.options.answer = Lampa.request('answer:entity');
                Lampa.trigger('progressBar:hide');
            });
        },
        saveAsk: function () {
            var _this= this,
                question = this.ui.editQuestion.val();
            if (/^\s*$/.test(question))
                return Lampa.request('alert', 'Your question field is empty. You cannot post an empty question.', 'blue', 'Empty question');
            this.model.set('question', question);
            this.model.set('content', this.ui.editContent.trumbowyg('html'));
            this.model.save({
                error: function () {
                    Lampa.request('alert', 'Action failed. The resources may be unavailable. Ple try it again later.', 'red', 'Error');
                    Lampa.trigger('error', this);
                },
                success: function (savedModel) {
                    _this.model.set('question', savedModel.get('question'));
                    _this.model.set('content', savedModel.get('content'));
                }
            });
        },
        delete: function () {
            var _this = this;
            Lampa.request('confirm',
                'Do you really want to delete this ask?'
            ).then(function (res) {
                if (!res) return;
                Lampa.trigger('progressBar:show');
                Lampa.request('ask:destroy', _this.model).done(function () {
                    Lampa.trigger('progressBar:hide');
                });
            });
        },
        toggleFollow: function () {
            this.ui.profileBtn.popover({
                animation: true,
                html: true,
                content: '<button class="btn btn-primary"></button>'
            });
        }
    });

    Ask.Comments = Marionette.CollectionView.extend({
        template: 'core/empty',
        childView: Ask.Comment,
        emptyView: Ask.EmptyComment
    });
    Ask.Answers = Marionette.CompositeView.extend({
        template: 'core/empty',
        childView: Ask.Answer,
        emptyView: Ask.EmptyAnswer
    });
    Ask.Asks = Marionette.CompositeView.extend({
        template: 'core/empty',
        childView: Ask.Ask,
        emptyView: Ask.EmptyAsk
    });

    Ask.Index = Marionette.LayoutView.extend({
        template: 'community/ask/index',
        regions: {
            asks: '#asks'
        },
        ui: {
            askInput: '#newAsk',
            modalAsk: '#modalAsk',
            askLampa: '#askLampa',
            saveAsk: '#saveAsk',
            question: '#askQuestion',
            askContent: '#askContent',
            searchForm: '#searchAsk',
            terms: '#terms',
            order: '[name="order"]',
            cancelSearch: '#cancelSearch',
            cancelSearchBtn: '#cancelSearchBtn'
        },
        events: {
            'focus @ui.askInput': 'showModal',
            'click @ui.askLampa': 'showModal',
            'click @ui.saveAsk': 'ask',
            'click @ui.cancelSearchBtn': 'cancelSearch',
            'submit @ui.searchForm': 'search',
            'change @ui.order': 'order'
        },
        initialize: function () {
            this.options = {
                ask: Lampa.request('ask:entity'),
                params: {
                    page: 1,
                    order: null
                }
            };
        },
        onShow: function () {
            this.showAsks();
        },
        showAsks: function () {
            Lampa.trigger('progressBar:show');
            var _this = this;
            !this.options.params.terms ? this.ui.cancelSearch.hide() : this.ui.cancelSearch.show();
            Lampa.request('ask:entities', _this.options.params).then(function (asks) {
                _this.getRegion('asks').show(new Ask.Asks({
                    collection: asks
                }));
                Lampa.trigger('progressBar:hide');
            });
        },
        showModal: function () {
            this.ui.askContent.trumbowyg({
                autogrow: true,
                mobile: true,
                tablet: true,
                resetCss: true,
                removeformatPasted: true
            });
            this.ui.modalAsk.modal('show');
        },
        ask: function () {
            var _this = this,
                ask = this.options.ask,
                question = this.ui.question.val();
            if (!question || /^\s*$/.test(question))
                return Lampa.request('alert', 'Your question field is empty. You cannot post an empty question.', 'blue', 'Empty question');
            ask.set('question', question);
            ask.set('content', _this.ui.askContent.trumbowyg('html'));
            Lampa.trigger('progressBar:show');
            Lampa.request('ask:save', ask).then(function (ask) {
                _this.options.ask = Lampa.request('ask:entity');
                _this.showAsks();
                Lampa.trigger('progressBar:hide');
            });
        },
        search: function (e) {
            e.preventDefault();
            var terms = this.ui.terms.val();
            if (!terms || /^\s*$/.test(terms))
                return Lampa.request('alert', 'Your search terms are empty.', 'blue', 'No search terms');
            this.options.params.terms = terms;
            this.showAsks();
        },
        cancelSearch: function () {
            this.options.params.terms = null;
            this.ui.terms.val('');
            this.showAsks();
        },
        order: function () {
            this.options.params.order = this.ui.order.val();
            this.showAsks();
        }
    });

});
