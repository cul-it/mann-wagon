import 'semantic-ui-css/components/accordion.min.css'
import 'semantic-ui-css/components/accordion.min.js'
import 'semantic-ui-css/components/segment.min.css'
import 'components/all-experts'

import List from 'list.js'
import _ from 'lodash'

var allExperts = {
  onLoad: function () {
    var requested = window.location.hash ? this.toProperCase(window.location.hash.substr(1)) : 'expert'
    var filter = requested === 'expert' ? 'type' : 'teams'
    this.accordionMe()
    this.bindEventListeners()
    this.initializeList()
    this.applyView(requested, filter, true)
  },

  accordionMe: function () {
    $('.ui.accordion')
      .accordion()
  },

  applyView: function (requested, type, initRequest) {
    allExperts.cleanSlate()
    allExperts.filterList(type, requested, initRequest)

    var activeTeam = $('.js-filter-teams[data-teams="' + requested + '"]')
    var teamsList = activeTeam.parentsUntil('.accordion')[1]

    // Indicate active filter included with initial page request
    // -- i.e. for team view coming from Staff Directory, Homepage or Meet Our Experts
    activeTeam.parent().toggleClass('all-experts__filter--active')
    $(teamsList).toggleClass('active')
    $(teamsList).prev().toggleClass('active')
  },

  bindEventListeners: function () {
    $('.js-filter-dept').on('click', function () {
      var department = $(this).data('dept')
      allExperts.cleanSlate()
      allExperts.filterList('dept', department)
      $(this).parent().toggleClass('all-experts__filter--active')

      return false
    })

    $('.js-filter-expertise').on('click', function () {
      var skill = $(this).data('expertise')
      allExperts.cleanSlate()
      allExperts.filterList('expertise', skill)
      $(this).parent().toggleClass('all-experts__filter--active')

      return false
    })

    $('.js-filter-reset').on('click', function () {
      allExperts.cleanSlate()
      allExperts.filterList('type', 'expert')
      $('.all-experts__filter-reset').toggleClass('mannlib-hidden')

      return false
    })

    $('.js-filter-teams').on('click', function () {
      var team = $(this).data('teams')
      allExperts.cleanSlate()
      allExperts.filterList('teams', team)
      $(this).parent().toggleClass('all-experts__filter--active')

      return false
    })
  },

  cleanSlate: function () {
    allExperts.toggleActiveType('clear')
    $('.all-experts__filter').removeClass('all-experts__filter--active')
  },

  initializeList: function () {
    var options = {
      valueNames: [
        { data: ['department'] },
        { data: ['expertise'] },
        { data: ['teams'] },
        { data: ['type'] }
      ]
    }

    allExperts.list = new List('js-experts', options)
  },

  filterList: function (filter, filterValue, initial) {
    // Clear all filters
    allExperts.list.filter()

    allExperts.list.filter(function (item) {
      switch (filter) {
        case 'dept':
          var truth = _.indexOf(_.split(item.values().department, ','), filterValue) > -1
          break
        case 'expertise':
          truth = _.indexOf(_.split(item.values().expertise, ','), filterValue) > -1
          break
        case 'teams':
          truth = _.indexOf(_.split(item.values().teams, ','), filterValue) > -1
          break
        case 'type':
          truth = _.indexOf(_.split(item.values().type, ','), filterValue) > -1
          break
      }

      if (truth) {
        if (!initial || filter === 'teams') {
          $('.all-experts__filter-reset').removeClass('mannlib-hidden')
        }
        return true
      } else {
        return false
      }
    })
  },

  toggleActiveType: function (trigger) {
    var buttons = $('.js-toggle-buttons').children()
    if (trigger === 'clear') {
      buttons.removeClass('active')
    } else {
      if ($('.' + trigger).hasClass('active')) {
        return false
      } else if (allExperts.toggleBothInactive(buttons)) {
        $('.' + trigger).toggleClass('active')
      } else {
        buttons.toggleClass('active')
      }
    }
  },

  toggleBothInactive: function (buttons) {
    var noSoupForYou = true
    buttons.each(function (index) {
      if ($(this).hasClass('active')) {
        noSoupForYou = false
      }
    })
    return noSoupForYou
  },

  toProperCase: function (string) {
    return string.split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ')
  }
}

$(document).ready(function () {
  allExperts.onLoad()
})
