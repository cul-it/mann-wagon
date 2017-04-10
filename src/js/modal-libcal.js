import 'semantic-ui-css/components/dimmer.min.js';
import 'semantic-ui-css/components/dimmer.min.css';
import 'semantic-ui-css/components/modal.min.js';
import 'semantic-ui-css/components/modal.min.css';
import 'semantic-ui-css/components/transition.min.js';
import 'semantic-ui-css/components/transition.min.css';
import 'components/modal-libcal'

var modalLibcal = {
  onLoad: function() {
    this.bindEventListeners();
  },

  bindEventListeners: function() {
    $('.js-modal-libcal').on('click', function() {
      var spaceId = $(this).data('spaceid');
      $('#js-space-' + spaceId)
        .modal({
          dimmerSettings: {
            opacity: .5
          }
        }).modal('show')
      ;
    });
  }
}

$(document).ready(function() {
  modalLibcal.onLoad();
});
