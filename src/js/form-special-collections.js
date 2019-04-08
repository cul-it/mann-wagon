import 'semantic-ui-calendar/dist/calendar.min.css'
import 'semantic-ui-calendar/dist/calendar.min.js'

import 'semantic-ui-css/components/accordion.min.css'
import 'semantic-ui-css/components/accordion.min.js'
import 'semantic-ui-css/components/checkbox.min.css'
import 'semantic-ui-css/components/checkbox.min.js'
import 'semantic-ui-css/components/dropdown.min.css'
import 'semantic-ui-css/components/dropdown.min.js'
import 'semantic-ui-css/components/form.min.css'
import 'semantic-ui-css/components/form.min.js'
import 'semantic-ui-css/components/header.min.css'
import 'semantic-ui-css/components/message.min.css'
import 'semantic-ui-css/components/popup.min.css'
import 'semantic-ui-css/components/popup.min.js'
import 'semantic-ui-css/components/segment.min.css'
import 'semantic-ui-css/components/transition.min.css'
import 'semantic-ui-css/components/transition.min.js'

// Use <span> for embedded icon component
import suiA11y from 'sui-a11y-dropdown.js'

import moment from 'moment'

$(document).ready(function () {
  $('.ui.date-selector').calendar({
    type: 'datetime',
    // Require at least two hour advanced notice and up to 3 month outs
    minDate: moment().add(2, 'hours').toDate(),
    maxDate: moment().add(3, 'month').toDate(),

    // Is the given date disabled?
    isDisabled: function (date, mode) {
      var day = moment(date).day()
      var hour = moment(date).hour()
      var minute = moment(date).minute()
      // Sunday = 0, Saturday = 6
      var weekend = [0, 6]
      // Standard hours are 9am - 4pm, Mon-Fri
      var open = 9
      var close = 16

      switch (mode) {
        case 'day':
          // Closed on the weekend
          if (weekend.indexOf(day) !== -1) {
            return true
          }
          break
        case 'hour':
          if (hour < open || hour >= close) {
            return true
          }

          // Catch day exceptions if browsing through days in hour mode
          if (weekend.indexOf(day) !== -1) {
            return true
          }
          break
        case 'minute':
          // Don't allow registrations within 15min of closing
          if (hour === (close - 1)) {
            if (minute > 45) {
              return true
            }
          }

          // Catch hour & day exceptions if browsing through days in minute mode
          if (hour >= close || (weekend.indexOf(day) !== -1)) {
            return true
          }
          break
      }
      return false
    }
  })
})

$('.ui.accordion').accordion()

$('.ui.checkbox').checkbox()

$(".ui.dropdown").dropdown({
  templates: {
    dropdown: suiA11y.dropdown
  }
});

// Would like to adjust the default prompt for the empty rule, but unclear how
// $fn.form.settings.prompt = function(rule, field) {
//   empty: 'Please enter your {name}'
// }

// Validation via semantic-ui
$('.ui.form')
  .form({
    inline: true,
    on: 'blur',
    fields: {
      name: {
        identifier: 'content[name]',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your name'
        }]
      },
      email: {
        identifier: 'content[email]',
        rules: [{
          type: 'email',
          prompt: 'Please enter a valid e-mail'
        }]
      },
      phone_local: {
        identifier: 'content[phone_local]',
        rules: [{
          type: 'regExp[^(?:(?:\\+?1\\s*(?:[.-]\\s*)?)?(?:\\(\\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\\s*\\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\\s*(?:[.-]\\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\\s*(?:[.-]\\s*)?([0-9]{4})(?:\\s*(?:#|x\\.?|ext\\.?|extension)\\s*(\\d+))?$]',
          prompt: 'Please enter a valid phone number'
        }]
      },
      mailing_local: {
        identifier: 'content[mailing_local]',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your local mailing address'
        }]
      },
      phone_home: {
        identifier: 'content[phone_home]',
        rules: [{
          type: 'regExp[^(?:(?:\\+?1\\s*(?:[.-]\\s*)?)?(?:\\(\\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\\s*\\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\\s*(?:[.-]\\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\\s*(?:[.-]\\s*)?([0-9]{4})(?:\\s*(?:#|x\\.?|ext\\.?|extension)\\s*(\\d+))?$]',
          prompt: 'Please enter a valid phone number'
        }]
      },
      mailing_home: {
        identifier: 'content[mailing_home]',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your home mailing address'
        }]
      },
      department: {
        identifier: 'content[department]',
        rules: [{
          type: 'empty',
          prompt: 'Please enter your department name'
        }]
      },
      affiliation: {
        identifier: 'content[affiliation]',
        rules: [{
          type: 'empty',
          prompt: 'Please select your affiliation'
        }]
      },
      date: {
        identifier: 'content[date]',
        rules: [{
          type: 'empty',
          prompt: 'Please select a preferred date for the software installation'
        }]
      },
      usage_agreement: {
        identifier: 'content[usage_agreement]',
        rules: [{
          type: 'empty',
          prompt: 'Please acknowledge and accept the usage agreement'
        }]
      },
      item1_callno: {
        identifier: 'content[item1_callno]',
        rules: [{
          type: 'empty',
          prompt: 'Please enter the call number for your first item'
        }]
      }
    }
  })
