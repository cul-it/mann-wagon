import 'semantic-ui-css/components/message.min.css';
import 'semantic-ui-css/components/transition.min.js';
import 'semantic-ui-css/components/transition.min.css';

// Styles
import 'components/beta-banner'

var betaBanner = {
  onLoad: function() {
    this.bindEventListeners();
    this.toggleBody()
  },

  bindEventListeners: function() {
    $('.js-beta-banner-close').on('click', function() {
      $('.beta-banner').transition('fade');

      betaBanner.toggleBody();
    });
  },

  toggleBody: function() {
    $('body').toggleClass('beta-banner--engaged');
  }
}

$(document).ready(function() {
  betaBanner.onLoad();
});
