import 'semantic-ui-css/components/modal.min.js';
import 'semantic-ui-css/components/modal.min.css';

var modalLibcal = {
  onLoad: function() {
    this.bindEventListeners();
  },

  bindEventListeners: function() {
    $('.js-modal-libcal').on('click', function() {
      $('.js-sui-modal')
        .modal('show')
      ;
    });
  }
}

$(document).ready(function() {
  modalLibcal.onLoad();
});
