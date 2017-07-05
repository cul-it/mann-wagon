import 'semantic-ui-css/components/transition.min.js'
import 'semantic-ui-css/components/transition.min.css'
import 'pages/hours'
import 'sticky-sort/jquery.stickysort.min.js'
import 'sticky-sort/stickysort.css'

var hours = {
  onLoad: function () {
    this.bindEventListeners()
    this.currentWeek = 0
    this.currentMonth = 0
    this.sticky(0, 0)
  },

  bindEventListeners: function () {
    $('.js-hours-next').on('click', function () {
      hours.gotoView(view, 'next')
    })

    $('.js-hours-prev').on('click', function () {
      hours.gotoView(view, 'prev')
    })

    $('.js-hours-today').on('click', function () {
      if (view === 'week') {
        hours.gotoView(view, 0)
      } else if (view === 'month') {
        hours.gotoView(view, 0)
      }
    })

    var view = 'week'

    $('#libcal-monthly-hours').hide()

    $('.js-hours-week').on('click', function () {
      $('#libcal-weekly-hours').transition('show')
      $('#libcal-monthly-hours').transition('hide')
      $(this).addClass('active')
      $('.js-hours-month').removeClass('active')
      view = 'week'
      hours.gotoView(view, hours.currentWeek)
    })

    $('.js-hours-month').on('click', function () {
      $('#libcal-weekly-hours').transition('hide')
      $('#libcal-monthly-hours').transition('show')
      $(this).addClass('active')
      $('.js-hours-week').removeClass('active')
      view = 'month'
      hours.gotoView(view, hours.currentMonth)
    })
  },

  gotoView: function (view, currentView) {
    if (view === 'week') {
      switch (currentView) {
        case 'next':
          var requestedWeek = hours.currentWeek + 1
          break
        case 'prev':
          requestedWeek = hours.currentWeek - 1
          break
        default:
          requestedWeek = currentView
          break
      }
      // Remove current sticky from current table
      hours.removeSticky(hours.currentWeek)

      // Hide current & display requested week
      $('.week-' + hours.currentWeek).transition('toggle')
      $('.week-' + requestedWeek).transition('toggle')

      // Add sticky to current table
      hours.sticky(requestedWeek)

      // Update tracking of current week accordingly
      hours.currentWeek = requestedWeek
      // Enable/disable appropriate buttons
      hours.housekeeping(view, hours.currentWeek)
    }
    if (view === 'month') {
      switch (currentView) {
        case 'next':
          var requestedMonth = hours.currentMonth + 1
          break
        case 'prev':
          requestedMonth = hours.currentMonth - 1
          break
        default:
          requestedMonth = currentView
          break
      }
      $('.s-lc-mhw-c').eq(hours.currentMonth).transition('toggle')
      $('.s-lc-mhw-c').eq(requestedMonth).transition('toggle')
      // Update tracking of current week accordingly
      hours.currentMonth = requestedMonth
      // Enable/disable appropriate buttons
      hours.housekeeping(view, hours.currentMonth)
    }
  },

  housekeeping: function (view, week) {
    if (view === 'week') {
      // Disable prev & today btns if returning to first week
      if (week === 0) {
        $('.js-hours-prev, .js-hours-today').addClass('disabled')
        $('.js-hours-next').removeClass('disabled')
      // Disable next btn after 52 weeks (zero-based index: 51)
      } else if (week === 51) {
        $('.js-hours-prev, .js-hours-today').removeClass('disabled')
        $('.js-hours-next').addClass('disabled')
      } else {
        $('.js-hours-prev, .js-hours-today, .js-hours-next').removeClass('disabled')
      }
    }
    if (view === 'month') {
      // Disable prev & today btns if returning to first week
      if (week === 0) {
        $('.js-hours-prev, .js-hours-today').addClass('disabled')
        $('.js-hours-next').removeClass('disabled')
      // Disable next btn after 3 month (zero-based index: 2)
      } else if (week === 11) {
        $('.js-hours-prev, .js-hours-today').removeClass('disabled')
        $('.js-hours-next').addClass('disabled')
      } else {
        $('.js-hours-prev, .js-hours-today, .js-hours-next').removeClass('disabled')
      }
    }
  },
  sticky: function (requestedWeek) {
    $('.week-' + requestedWeek).stickySort()
    $('.sticky-col').remove()
    $('.sticky-intersect').remove()
  },
  removeSticky: function (week) {
    $('.week-' + hours.currentWeek).removeClass('sticky-enabled').detach().appendTo('#libcal-weekly-hours')
    $('.sticky-wrap').remove()
  }
}

$(document).ready(function () {
  hours.onLoad()
})

// Libcal Monthly hours widget
$(function () {
  $.LibCalHoursCal($('#libcal-monthly-hours'), { iid: 973, lid: 1707, months: 12 })
})
