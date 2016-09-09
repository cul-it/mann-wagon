import 'semantic-ui-css/components/transition.min.js';
import 'semantic-ui-css/components/transition.min.css';
import 'pages/hours';

var hours = {
  onLoad: function() {
    this.bindEventListeners();
    this.currentWeek = 0;
    this.currentMonth = 0;
  },

  bindEventListeners: function() {
    $('.js-hours-next').on('click', function() {
      hours.gotoView(view, 'next');
    });

    $('.js-hours-prev').on('click', function() {
      hours.gotoView(view, 'prev');
    });

    $('.js-hours-today').on('click', function() {
      hours.gotoView(view, 'first');
    });

    var view = 'week';

    $('#libcal-monthly-hours').hide();

    $('.js-hours-week').on('click', function() {
      $("#libcal-weekly-hours").transition('show');
      $("#libcal-monthly-hours").transition('hide');
      view = 'week';
      hours.gotoView(view, 'first');
    });

    $('.js-hours-month').on('click', function() {
      $("#libcal-weekly-hours").transition('hide');
      $('#libcal-monthly-hours').transition('show');
      $('.js-hours-week').removeClass('active');
      view = 'month';
      hours.gotoView(view, 'first');
    });

  },

  gotoView: function(view, week) {
    if (view == 'week') {
      switch (week) {
        case 'next':
          var requestedWeek = hours.currentWeek + 1;
          break;
        case 'prev':
          var requestedWeek = hours.currentWeek - 1;
          break;
        case 'first':
          var requestedWeek = 0;
          break;
      }
      // Hide current & display requested week
      $('.hours-weekly').eq(hours.currentWeek).transition('toggle');
      $('.hours-weekly').eq(requestedWeek).transition('toggle');
      // Update tracking of current week accordingly
      hours.currentWeek = requestedWeek;
      // Enable/disable appropriate buttons
      hours.housekeeping(view, hours.currentWeek);

    }
    if (view == 'month') {
      switch (week) {
        case 'next':
          var requestedMonth = hours.currentMonth + 1;
          break;
        case 'prev':
          var requestedMonth = hours.currentMonth - 1;
          break;
        case 'first':
          var requestedMonth = 0;
          break;
      }
      $('.s-lc-mhw-c').eq(hours.currentMonth).transition('toggle');
      $('.s-lc-mhw-c').eq(requestedMonth).transition('toggle');
      // Update tracking of current week accordingly
      hours.currentMonth = requestedMonth;
      // Enable/disable appropriate buttons
      hours.housekeeping(view, hours.currentMonth);
    }
  },

  housekeeping: function(view, week) {
    if (view == 'week') {
      // Disable prev & today btns if returning to first week
      if (week == 0) {
        $('.js-hours-prev, .js-hours-today').addClass('disabled');
        $('.js-hours-next').removeClass('disabled');
      // Disable next btn after 52 weeks (zero-based index: 51)
      } else if (week == 51) {
        $('.js-hours-next').addClass('disabled');
      } else {
        $('.js-hours-prev, .js-hours-today, .js-hours-next').removeClass('disabled');
      }
    }
    if (view == 'month') {
      // Disable prev & today btns if returning to first week
      if (week == 0) {
        $('.js-hours-prev, .js-hours-today').addClass('disabled');
        $('.js-hours-next').removeClass('disabled');
      // Disable next btn after 3 month (zero-based index: 2)
    } else if (week == 11) {
        $('.js-hours-next').addClass('disabled');
      } else {
        $('.js-hours-prev, .js-hours-today, .js-hours-next').removeClass('disabled');
      }
    }

  }
}

$(document).ready(function() {
  hours.onLoad();
});

// Libcal Monthly hours widget
$(function(){
var libcalmonthlyhours = new $.LibCalHoursCal( $('#libcal-monthly-hours'), { iid: 973, lid: 1707, months: 12 });
});
