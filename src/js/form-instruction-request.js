import 'semantic-ui-calendar/dist/calendar.min.css'
import 'semantic-ui-calendar/dist/calendar.min.js'

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
import 'semantic-ui-css/components/transition.min.css'
import 'semantic-ui-css/components/transition.min.js'

import { escape } from 'lodash'
import moment from 'moment'

$('.date-selector').calendar({
  type: 'datetime',
  // Require at least 48 hrs advanced notice and up to 3 months out
  minDate: moment().add(2, 'day').toDate(),
  maxDate: moment().add(3, 'month').toDate(),

  // Is the given date disabled?
  isDisabled: function (date, mode) {
    var day = moment(date).day()
    var hour = moment(date).hour()
    var minute = moment(date).minute()
    // Sunday = 0, Saturday = 6
    var weekend = [0, 6]
    // Standard hours are 8am - 8pm, Mon-Fri
    var open = 8
    var close = 20

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

// FEW ITEMS TO NOTE
// i see nick's comment on the feedback form that he doesn't like this for mobile
// probably needs to be reworked, but i do like the multiple select that comes with semantic-ui
$('.ui.dropdown').dropdown()

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
      course_name: {
        identifier: 'content[course_name]',
        rules: [{
          type: 'empty',
          prompt: 'Please enter the course name'
        }]
      },
      course_number: {
        identifier: 'content[course_number]',
        rules: [{
          type: 'empty',
          prompt: 'Please enter the course number'
        }]
      },
      instruction_types: {
        identifier: 'content[instruction_types][]',
        rules: [{
          type: 'checked',
          prompt: 'Please select at least one type of instruction'
        }]
      },
      location: {
        identifier: 'content[location]',
        rules: [{
          type: 'checked',
          prompt: 'Please select your preferred location'
        }]
      },
      assignment: {
        identifier: 'assignment',
        rules: [{
          type: 'empty',
          prompt: 'Please indicate whether there will be a related assignment'
        }]
      }
    }
  })

var otherValues = {
  onLoad: function () {
    this.bindEventListeners()
    this.prepOthers()
  },

  bindEventListeners: function () {
    $('.js-mannform-other__value').blur(function () {
      otherValues.appendUserContent($(this))
    })
  },

  appendUserContent: function (trigger) {
    const userValue = escape(trigger.val()) || 'unspecified'
    const otherOption = trigger.siblings('.js-mannform-other')
    const label = otherOption.attr('data-prefix')
    otherOption.val(label + ': ' + userValue)
  },

  prepOthers: function () {
    $('.js-mannform-other__value').get().forEach(v => otherValues.appendUserContent($(v)))
  }
}

$(document).ready(function () {
  otherValues.onLoad()
})
