/**
 * Created by Patrik on 9/7/2016.
 */

Lampa.module("Core", function (Core, Lampa, Backbone, Marionette, $, _) {

    var api = {
        confirm: function (msg, color, header) {
            var defer = $.Deferred();
            (function showConfirmation () {
                $('body').append(
                    '<div id="m0D4lC0nFiRm4Ti0N" class="modal fade" role="dialog" data-response="no" tabindex="-1">' +
                        '<div class="modal-dialog modal-sm">' +
                            '<div class="modal-content">' +
                                '<div class="modal-header">' +
                                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
                                    '<h4></h4>' +
                                '</div>' +
                                '<div class="modal-body"></div>' +
                                '<div class="modal-footer">' +
                                    '<button class="btn" data-dismiss="modal" data-response="no">No</button>' +
                                    '<button class="btn" data-dismiss="modal" data-response="yes">Yes</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>');
                var modal = $('#m0D4lC0nFiRm4Ti0N'),
                    yesBtn = modal.find('[data-response="yes"]'),
                    response = false;
                modal.find('.modal-body').html(msg);
                modal.find('h4').html(header);
                switch (color) {
                    case 'blue':
                        yesBtn.addClass('btn-primary');
                        break;
                    case 'red':
                        yesBtn.addClass('btn-danger');
                        break;
                    case 'orange':
                        yesBtn.addClass('btn-warning');
                        break;
                    case 'white':
                        yesBtn.addClass('btn-default');
                        break;
                    case 'green':
                        yesBtn.addClass('btn-success');
                        break;
                    default:
                        yesBtn.addClass('btn-primary');
                        break;
                }
                $('button[data-dismiss="modal"]').click(function () {
                    $(this).data('response') == 'yes' ? response = true : response = false;
                });
                modal.on('hidden.bs.modal', function () {
                    $('#m0D4lC0nFiRm4Ti0N').remove();
                    defer.resolve(response);
                });
                modal.modal({
                    show:true
                });
            }());
            return defer;
        },
        alert: function (msg, color, header) {
            (function showAlert () {
                $('body').append(
                    '<div id="m0D4lAl3R7" class="modal fade" role="dialog" tabindex="-1">' +
                        '<div class="modal-dialog modal-sm">' +
                            '<div class="modal-content">' +
                                '<div class="modal-header">' +
                                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
                                    '<h4></h4>' +
                                '</div>' +
                                '<div class="modal-body"></div>' +
                                '<div class="modal-footer">' +
                                    '<button class="btn" data-dismiss="modal">Ok</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>');
                var modal = $('#m0D4lAl3R7'),
                    okBtn = modal.find('.btn');
                modal.find('.modal-body').html(msg);
                modal.find('h4').html(header);
                switch (color) {
                    case 'blue':
                        okBtn.addClass('btn-primary');
                        break;
                    case 'red':
                        okBtn.addClass('btn-danger');
                        break;
                    case 'orange':
                        okBtn.addClass('btn-warning');
                        break;
                    case 'white':
                        okBtn.addClass('btn-default');
                        break;
                    case 'green':
                        okBtn.addClass('btn-success');
                        break;
                    default:
                        okBtn.addClass('btn-primary');
                        break;
                }
                modal.on('hidden.bs.modal', function () {
                    modal.remove();
                });
                modal.modal({
                    show: true
                });
            }());
            return null;
        }
    };

    Lampa.reqres.setHandler('confirm', function (msg, color, header) {
        msg = String(msg || '?');
        color = String(color || 'red');
        header = String(header || 'Confirmation');
        return api.confirm(msg, color, header);
    });

    Lampa.reqres.setHandler('alert', function (msg, color, header) {
        api.alert(
            String(msg || '?'),
            String(color || 'blue'),
            String(header || 'Alert!')
        );
        return null;
    });

});