import 'semantic-ui-css/components/embed.min.css';
import 'semantic-ui-css/components/embed.min.js';
import 'semantic-ui-css/components/modal.min.js';
import 'semantic-ui-css/components/modal.min.css';

var modalLibcal = {
  onLoad: function() {
    this.bindEventListeners();
  },

  bindEventListeners: function() {
    $('.js-modal-libcal').on('click', function() {
      $('.ui.embed')
        .embed()
      ;

      $('.js-sui-modal')
        .modal({
          observeChanges: true
        })
        .modal('show')
      ;
    });
  }
}

$(document).ready(function() {
  modalLibcal.onLoad();
});
