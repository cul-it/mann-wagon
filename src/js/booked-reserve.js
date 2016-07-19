import 'semantic-ui-css/components/dimmer.min.js';
import 'semantic-ui-css/components/dimmer.min.css';
import 'semantic-ui-css/components/modal.min.js';
import 'semantic-ui-css/components/modal.min.css';
import 'semantic-ui-css/components/transition.min.js';
import 'semantic-ui-css/components/transition.min.css';

var bookedReserve = {
  onLoad: function() {
    this.bindEventListeners();
  },

  bindEventListeners: function() {
    $('.js-booked-reserve').on('click', function() {
      $('.js-sui-modal')
        .modal('show')
      ;
    });
  }
}

$(document).ready(function() {
  bookedReserve.onLoad();
});
