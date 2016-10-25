import 'semantic-ui-css/components/accordion.min.css'
import 'semantic-ui-css/components/accordion.min.js'
import 'semantic-ui-css/components/segment.min.css'
import 'components/all-experts'

import 'list.js'
import _ from 'lodash'

var allExperts = {
  onLoad: function() {
    this.accordionMe()
    this.bindEventListeners()
    this.initializeList()
    this.filterList('type', 'expert')
  },

  accordionMe: function() {
    $('.ui.accordion')
      .accordion()
    ;
  },

  bindEventListeners: function() {
    $('.js-experts-only').on('click', function() {
      allExperts.cleanSlate()
      allExperts.filterList('type', 'expert')
      allExperts.toggleActiveType('js-experts-only')
    })

    $('.js-liaisons-only').on('click', function() {
      allExperts.cleanSlate()
      allExperts.filterList('type', 'liaison')
      allExperts.toggleActiveType('js-liaisons-only')
    })

    $('.js-filter-dept').on('click', function() {
      var department = $(this).data('dept')
      allExperts.cleanSlate()
      allExperts.filterList('dept', department)
      $(this).parent().toggleClass('all-experts__filter--active')

      return false
    })

    $('.js-filter-expertise').on('click', function() {
      var skill = $(this).data('expertise')
      allExperts.cleanSlate()
      allExperts.filterList('expertise', skill)
      $(this).parent().toggleClass('all-experts__filter--active')

      return false
    })
  },

  cleanSlate: function() {
    allExperts.toggleActiveType('clear')
    $('.all-experts__filter').removeClass('all-experts__filter--active')
  },

  initializeList: function() {
    var options = {
      valueNames: [
        { data: ['department'] },
        { data: ['expertise'] },
        { data: ['type'] },
      ]
    }

    allExperts.list = new List('js-experts', options)
  },

  filterList: function(filter, filterValue) {
    // Clear all filters
    allExperts.list.filter()

    allExperts.list.filter(function(item) {
      switch (filter) {
        case 'dept':
          var truth = _.indexOf(_.split(item.values().department, ','), filterValue) > -1
          break;
        case 'expertise':
          var truth = _.indexOf(_.split(item.values().expertise, ','), filterValue) > -1
          break;
        case 'type':
          var truth = _.indexOf(_.split(item.values().type, ','), filterValue) > -1
          break;
      }

      if (truth) {
        return true
      } else {
        return false
      }
    })
  },

  toggleActiveType: function(trigger) {
    var buttons = $('.all-experts__toggles').children()
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

  toggleBothInactive: function(buttons) {
    var noSoupForYou = true
    buttons.each(function(index) {
      if ($(this).hasClass('active')) {
        noSoupForYou = false
      }
    })
    return noSoupForYou
  }
}

$(document).ready(function() {
  allExperts.onLoad()
})
