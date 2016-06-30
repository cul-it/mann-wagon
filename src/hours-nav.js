import 'semantic-ui-css/components/button.min.css';
import 'semantic-ui-css/components/transition.min.js';
import 'semantic-ui-css/components/transition.min.css';

var hoursNav = {
  onLoad: function() {
    this.bindEventListeners();
    this.currentWeek = 0;
  },

  bindEventListeners: function() {
    $('.js-hours-next').on('click', function() {
      hoursNav.gotoWeek('next');
    });

    $('.js-hours-prev').on('click', function() {
      hoursNav.gotoWeek('prev');
    });

    $('.js-hours-today').on('click', function() {
      hoursNav.gotoWeek('first');
    });
  },

  gotoWeek: function(week) {
    switch (week) {
      case 'next':
        var requestedWeek = hoursNav.currentWeek + 1;
        break;
      case 'prev':
        var requestedWeek = hoursNav.currentWeek - 1;
        break;
      case 'first':
        var requestedWeek = 0;
        break;
    }

    // Hide current & display requested week
    $('.hours-weekly').eq(hoursNav.currentWeek).transition('toggle');
    $('.hours-weekly').eq(requestedWeek).transition('toggle');

    // Update tracking of current week accordingly
    hoursNav.currentWeek = requestedWeek;

    // Enable/disable appropriate buttons
    hoursNav.housekeeping(hoursNav.currentWeek);
  },

  housekeeping: function(week) {
    // Disable prev & today btns if returning to first week
    if (week == 0) {
      $('.js-hours-prev, .js-hours-today').addClass('disabled');
    // Disable next btn after 52 weeks (zero-based index: 51)
    } else if (week == 51) {
      $('.js-hours-next').addClass('disabled');
    } else {
      $('.js-hours-prev, .js-hours-today, .js-hours-next').removeClass('disabled');
    }
  }
}

$(document).ready(function() {
  hoursNav.onLoad();
});
