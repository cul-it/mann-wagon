<script>
import $ from 'jquery'
var _ = require('lodash')
var moment = require('moment')

import 'semantic-ui-css/components/dimmer.min.js'
import 'semantic-ui-css/components/dimmer.min.css'
import 'semantic-ui-css/components/modal.min.js'
import 'semantic-ui-css/components/modal.min.css'
import 'semantic-ui-css/components/transition.min.js'
import 'semantic-ui-css/components/transition.min.css'
import 'semantic-ui-css/components/accordion.min.js'
import 'semantic-ui-css/components/accordion.min.css'
import 'semantic-ui-css/components/loader.min.css'

import Description from './Description.vue'

export default {
  name: 'events',
  template: require('../templates/events-template.html'),
  components: {
    Description
  },
  props: ['r25-webservice-authorization', 'default-number-of-days'],
  data () {
    return {
      eventSources: {
        updatedCornellEvents: false,
        updatedLibcalEvents: false,
        updatedR25Events: false
      },
    // Arrays for event info
      cornellEvents: [],
      cornellEventTypes: [],
      cornellRoomNames: [],

      libcalEvents: [],
      libcalEventTypes: [],
      libcalRoomNames: [],

      r25Events: [],
      r25EventTypes: [],
      r25RoomNames: [],

      allEvents: [],
      allEventTypes: [],
      allRoomNames: [],
      // Room filter param
      room: '',
      // Event type filter param
      eventType: '',

      // Variables for adding class to selected filters
      eventSelected: '',
      roomSelected: '',

      // How many events to display first
      limitList: 10,
      // events to display to view more
      listIncrement: 10,

      // Load more link text
      loadMoreText: '',

      // Group events key
      dateKey: 'event_start',

      // Search text for filtering events
      searchText: '',
      // Selected date from calendar
      dateSelected: '',
      // No events message
      showNoEventsMessage: true,
      // Array for filtered events, for no events message
      filteredEvents: [],
      // Current date time used to filter out past events on initial load
      dateTimeNow: moment().format(),
      // Arrays for single event info
      event: [],
      url: window.location.href,
      query: '',
      params: '',
      eventsList: false,
      singleEvent: false
    }
  },
  watch: {
    'cornellEvents': function () {
      this.$set('eventSources.updatedCornellEvents', true)
    },
    'libcalEvents': function () {
      this.$set('eventSources.updatedLibcalEvents', true)
    },
    'r25Events': function () {
      this.$set('eventSources.updatedR25Events', true)
    },
    'eventSources': {
      handler: function (events) {
        if (events.updatedCornellEvents && events.updatedLibcalEvents && events.updatedR25Events) {
            this.getAllEvents()
        }
      },
      deep: true
    }
  },
  // Anything within the ready function will run when the application loads
  ready: function () {
    if (window.location.search) {
      this.$set('query', this.url.split('?')[1].split('='))
    }
    if (this.query[0] === 'room') {
      this.$set('params', unescape(this.query[1]))
    } else if (this.query[0] === 'eventType') {
      this.$set('params', unescape(this.query[1]))
    } else if (this.query[0] === 'eventId') {
      this.$set('params', unescape(this.query[1]))
    }
    if (this.query[0] === 'eventId') {
      if (this.params.match('LibCal(.*)')) {
        this.getMannServicesEvents('event', this.params)
      } else if (this.params.match('R25(.*)')){
        this.getR25Events('event', this.params.replace('R25-', ''))
      } else {
        this.getCornellEvent()
      }
      // single event
      this.$set('singleEvent', true)
      $('body').hide()
    } else {
      if (this.query[0] === 'eventType') {
        this.setEventTypeFilter(this.params)
      }
      if (this.query.room) {
        this.setRoomFilter(this.params)
      }
    }
    // When the application loads, call methods
    this.getCornellEvents('default')
    this.getMannServicesEvents('default')
    this.getR25Events('default')
    // events list
    this.$set('eventsList', true)
  },
  directives: require('../directives/datepicker-directive'),
  filters: {
    // Room filter
    roomFilter: function (events, room) {
      if (room === '') {
        this.loadMoreDisplay(events)
        return events
      } else {
        var filterEvents = function (event) {
          return event.event_room_name === room
        }
        // load more text display, and filtered array for no more events message
        this.loadMoreDisplay(events.filter(filterEvents))
        this.$set('filteredEvents', events.filter(filterEvents))
        return events.filter(filterEvents)
      }
    },
    // Event filter
    eventTypeFilter: function (events, eventType) {
      if (eventType === '') {
        this.loadMoreDisplay(events)
        return events
      } else {
        var filterEvents = function (event) {
          return event.event_type.indexOf(eventType) > -1
        }
        // load more text display, and filtered array for no more events message
        this.loadMoreDisplay(events.filter(filterEvents))
        this.$set('filteredEvents', events.filter(filterEvents))
        return events.filter(filterEvents)
      }
    },
  // MomentJS filters
    momentTime: function (date) {
      return moment(date).format('h:mm a')
    },
    momentDate: function (date) {
      if (date === '') {
        return
      } else {
        return moment(date).format('ddd, MMM DD, YYYY')
      }
    },
    momentDateText: function (date) {
      var someday = moment(date).startOf('day')
      var today = moment().startOf('day')
      var days = someday.diff(today, 'days')
      if (days === 0) {
        return 'Today'
      } else if (days === 1) {
        return 'Tomorrow'
      }
    },
    // Limit events list
    limitListFilter: function (events, limitList) {
      return events.slice(0, Number(limitList))
    },
    // Event type array to string
    toString: function (eventTypeArray) {
      return eventTypeArray.join(', ')
    },
    // Group events by day (event_start)
    groupBy: function (events, dateKey) {
      return _.groupBy(events, dateKey)
    }
  },
  methods: {
    // Cornell localist events
    getCornellEvents (option, date) {
      this.eventSources.updatedCornellEvents = false
      var localistApiBaseUrl = 'http://events.cornell.edu/api/2/events/?type=4228&pp=100'
      // Get default events
      if (option === 'default') {
        this.$http.get(localistApiBaseUrl + '&days=' + this.defaultNumberOfDays).then(function (response) {
          // Create custom data model
          var vueInstance = this
          var currentLocalistEvents = _.filter(response.data.events, function (event) {
            return moment(new Date(event.event.event_instances[0].event_instance.end)).format() >= vueInstance.dateTimeNow
          })
          this.cornellEventsArray(currentLocalistEvents)
        })
      // Get events for a date
      } else if (option === 'date') {
        this.$http.get(localistApiBaseUrl + '&start=' + date + '').then(function (response) {
          // Create custom data model
          this.cornellEventsArray(response.data.events)
        })
      }
    },
    getMannServicesEvents (option, param) {
      this.eventSources.updatedLibcalEvents = false
      var mannservicesEventsUrl = 'http://mannservices.mannlib.cornell.edu/LibServices/showEventsById.do?output=json&id='
      var roomIds = [23, 24, 25, 26]
      var vueInstance = this
      var libcalReservations = []
      // Create multiple api calls in loop
      _.each(roomIds, function (roomId, index) {
        vueInstance.$http(
          {
            type: 'GET',
            url: mannservicesEventsUrl + roomId,
            dataType: 'json'
          })
          .then(function (response) {
            // Combine response from all calls
            libcalReservations = _.concat(libcalReservations, response.data.eventList)
            libcalReservations = _.each(libcalReservations, function (libcalReservation) {
              // remove email from eventId for use as url parameter for single event display
              libcalReservation.eventId = libcalReservation.eventId.split('-', 3).join('-')
            })
            // Create custom model, call methods only on last loop
            if (index === (roomIds.length - 1)) {
              if (option === 'default') {
                // All reservations
                // Filter out past reservations
                var today = moment().startOf('day').format()
                var end_date = moment(today).add(this.defaultNumberOfDays, 'days').format()
                var notPastLibCalReservations = _.filter(libcalReservations, function (libcalReservation) {
                  return moment(new Date(libcalReservation.formattedStartDateTime)).format() >= today
                })
                // Default number of days to load workaround
                var defaultLibCalReservations = _.filter(notPastLibCalReservations, function (notPastLibCalReservation) {
                  return moment(new Date(notPastLibCalReservation.formattedStartDateTime)).format() <= end_date
                })
                // Hide past events for default events
                var vueInstance = this
                var currentLibCalReservations = _.filter(defaultLibCalReservations, function (defaultLibCalReservation) {
                  return moment(new Date(defaultLibCalReservation.formattedEndDateTime)).format() >= vueInstance.dateTimeNow
                })
                this.libcalReservationsArray(currentLibCalReservations)
              } else if (option === 'date') {
                // Reservations on a date
                var filteredLibcalReservations = _.filter(libcalReservations, function (libcalReservation) {
                  return (moment(new Date(libcalReservation.formattedStartDateTime)).format('YYYY-MM-DD')) === param
                })
                this.libcalReservationsArray(filteredLibcalReservations)
              } else if (option === 'event') {
                // Single reservation
                // Can't get single event from json data due to 30 minute slots,
                // instead populate libcalEvents with merged events and filter on that
                this.libcalReservationsArray(libcalReservations)
                var filteredLibcalReservation = _.filter(this.libcalEvents, function (libcalEvent) {
                  return libcalEvent.event_id === param
                })
                this.eventArray('Libcal', filteredLibcalReservation[0])
              }
            }
          })
      })
    },
    getR25Events (option, param) {
      // Use xml2js to convert xml string to JS object
      var parseString = require('xml2js').parseString
      this.eventSources.updatedR25Events = false
      var r25EventsBaseUrl = 'https://r25test.registrar.cornell.edu/r25ws/servlet/wrd/run/rm_reservations.xml?'
      var roomIds = [704, 705]
      var vueInstance = this
      var promise = []
      var r25Events = []
      var today = moment().startOf('day').format('YYYYMMDD')

      // Get default events
      if (option === 'default') {
        _.each(roomIds, function (roomId, index) {
          promise[roomId] = vueInstance.$http(
            {
              type: 'GET',
              url: r25EventsBaseUrl + 'space_id=' + roomId + '&start_dt=' + today + '&end_dt=+' + vueInstance.defaultNumberOfDays,
              headers: {
                'Authorization': 'Basic ' + vueInstance.r25WebserviceAuthorization
              },
              dataType: 'xml'
            })
        })

        Promise.all([promise[704], promise[705]]).then((values) => {
          _.each(values, function (value, index) {
            parseString(value.data, function (error, result) {
              if (result['r25:space_reservations']['r25:space_reservation']) {
                r25Events[index] = result['r25:space_reservations']['r25:space_reservation']
              }
            })
          })
          r25Events = _.flattenDeep(r25Events)
          // Hide past events for default events
          var currentr25Events = _.filter(r25Events, function (r25Event) {
            return moment(new Date(r25Event['r25:event'][0]['r25:event_end_dt'])).format() >= vueInstance.dateTimeNow
          })

          this.r25EventsArray(currentr25Events)
        })
      // Get events for a date
      } else if (option === 'date') {
        _.each(roomIds, function (roomId, index) {
          promise[roomId] = vueInstance.$http(
            {
              type: 'GET',
              url: r25EventsBaseUrl + 'space_id=' + roomId + '&start_dt=' + moment(param).format('YYYYMMDD'),
              headers: {
                'Authorization': 'Basic ' + vueInstance.r25WebserviceAuthorization
              },
              dataType: 'xml'
            })
        })

        Promise.all([promise[704], promise[705]]).then((values) => {
          _.each(values, function (value, index) {
            parseString(value.data, function (error, result) {
              if (result['r25:space_reservations']['r25:space_reservation']) {
                r25Events.push(result['r25:space_reservations']['r25:space_reservation'])
              }
            })
          })
          this.r25EventsArray(_.flattenDeep(r25Events))
        })
      } else if (option === 'event') {
        var r25EventBaseUrl = 'https://r25test.registrar.cornell.edu/r25ws/servlet/wrd/run/reservation.xml?'
        var r25Event = []
        vueInstance.$http(
          {
            type: 'GET',
            url: r25EventBaseUrl + 'rsrv_id=' + param ,
            headers: {
              'Authorization': 'Basic ' + vueInstance.r25WebserviceAuthorization
            },
            dataType: 'xml'
          }).then(function (response) {
            parseString(response.data, function (error, result) {
              r25Event = result['r25:reservations']['r25:reservation']
            })
            this.eventArray('R25', r25Event)
          })
      }
    },
    // Room filter and remove filter
    setRoomFilter (roomNumber) {
      this.room = roomNumber
      this.roomSelected = roomNumber
    },
    removeRoomFilter () {
      this.room = ''
      this.roomSelected = ''
    },
    // Event type filter and remove filter
    setEventTypeFilter (eventType) {
      this.eventType = eventType
      this.eventSelected = eventType
    },
    removeEventTypeFilter () {
      this.eventType = ''
      this.eventSelected = ''
    },

    //  Remove search filter
    removeSearchFilter () {
      this.$set('searchText', null)
    },

    //  Remove seleceted date to load default events
    removeSelectedDate () {
      this.$set('dateSelected', '')
      this.getCornellEvents('default')
      this.getMannServicesEvents('default')
      this.getR25Events('default')
      $('#datepicker').datepicker('setDate', moment().format('YYYY-MM-DD'))
      this.showNoEventsMessage = true
      this.allEvents = this.allEventTypes = this.allRoomNames = []
    },

    // Clear filters
    clearAllFilters () {
      this.room = ''
      this.eventType = ''
      this.roomSelected = ''
      this.eventSelected = ''
      this.getCornellEvents('default')
      this.getMannServicesEvents('default')
      this.getR25Events('default')
      this.removeSearchFilter()
      this.$set('dateSelected', '')
      $('#datepicker').datepicker('setDate', moment().format('YYYY-MM-DD'))
      this.showNoEventsMessage = true
      this.allEvents = this.allEventTypes = this.allRoomNames = []
    },
    // Load more events
    loadMoreEvents () {
      var newLimitList = this.limitList + this.listIncrement
      this.limitList = newLimitList > this.allEvents.length ? this.allEvents.length : newLimitList
    },
    // Custom data model from cornell events
    cornellEventsArray (data) {
      var eventTypes = []
      var roomNames = []
      var cornellEvents = []

      // Event properties
      _.forEach(_.map(data, 'event'), function (value) {
        var events = {}
        var eventType = []
        events['event_id'] = value.id
        events['event_title'] = value.title
        events['event_description'] = value.description
        events['event_start_time'] = value.event_instances[0].event_instance.start
        events['event_start'] = value.event_instances[0].event_instance.start.substring(0, 10)
        events['event_end_time'] = value.event_instances[0].event_instance.end
        events['event_room_name'] = value.room_number
        events['event_type'] = eventType
        events['event_recurring'] = value.recurring
        // Events array from localist
        cornellEvents.push(events)
        // Event type filter list array
        _.forEach(_.map(value, 'event_types'), function (value) {
          _.forEach(_.map(value, 'name'), function (value) {
            eventTypes.push(value)
            eventType.push(value)
          })
        })

        // Room filter list array
        roomNames.push(value.room_number)
      })
      // set array values to be used later to merge
      this.$set('cornellEventTypes', eventTypes)
      this.$set('cornellRoomNames', roomNames)
      this.$set('cornellEvents', cornellEvents)
    },
    // Custom data model from libcal room bookings
    libcalReservationsArray (data) {
      var libcalEvents = []
      var eventTypes = []
      var roomNames = []
      // event counter
      var counter = 0

      // Event properties
      _.forEach(data, function (value, index) {
        var events = {}
        // If same event based on title and time comparison
        // Check twice for lobby
        if (libcalEvents.length && libcalEvents[counter - 1].event_title === value.description.match('Event Name: (.*)')[1] && libcalEvents[counter - 1].event_end_time === moment(new Date(value.formattedStartDateTime)).format()) {
          libcalEvents[counter - 1].event_end_time = moment(new Date(value.formattedEndDateTime)).format()
        } else if (libcalEvents.length >1 && libcalEvents[counter - 2].event_title === value.description.match('Event Name: (.*)')[1] && libcalEvents[counter - 2].event_end_time === moment(new Date(value.formattedStartDateTime)).format()) {
          libcalEvents[counter - 2].event_end_time = moment(new Date(value.formattedEndDateTime)).format()
        } else {
          events['event_id'] = value.eventId
          events['event_title'] = value.description.match('Event Name: (.*)')[1]
          events['event_description'] = value.description.match('Event Description: (.*)')[1]
          events['event_start_time'] = moment(new Date(value.formattedStartDateTime)).format()
          events['event_start'] = moment(new Date(value.formattedStartDateTime)).format('YYYY-MM-DD')
          events['event_end_time'] = moment(new Date(value.formattedEndDateTime)).format()
          events['event_room_name'] = value.location
          events['event_type'] = [value.description.match('Event type:: (.*)')[1]]
          // Events array from LibCal
          libcalEvents.push(events)
          // Event type filter list array
          roomNames.push(value.location)
          // Room filter list array
          eventTypes.push(value.description.match('Event type:: (.*)')[1])
          // Increment event counter
          counter++
        }
      })
      // Set array values to be used later to merge
      this.$set('libcalEventTypes', eventTypes)
      this.$set('libcalRoomNames', roomNames)
      this.$set('libcalEvents', libcalEvents)
    },
    // Custom data model from r25 events
    r25EventsArray (data) {
      var r25Events = []
      var eventTypes = []
      var roomNames = []

      _.forEach(data, function (value, index) {
        var events = {}
        events['event_id'] = 'R25-' + value['r25:reservation_id'][0]
        events['event_title'] = value['r25:event'][0]['r25:event_name']['0']
        events['event_description'] = value['r25:event'][0]['r25:event_title']['0']
        events['event_start_time'] = moment(new Date(value['r25:event'][0]['r25:event_start_dt']['0'])).format()
        events['event_start'] = moment(new Date(value['r25:event'][0]['r25:event_start_dt']['0'])).format('YYYY-MM-DD')
        events['event_end_time'] = moment(new Date(value['r25:event'][0]['r25:event_end_dt']['0'])).format()
        events['event_room_name'] = value['r25:spaces'][0]['r25:formal_name'][0]
        events['event_type'] = ['Class/ Workshop']
        // Events array from r25
        r25Events.push(events)
        // Event type filter list array
        roomNames.push(value['r25:spaces'][0]['r25:formal_name'][0])
        // Room filter list array
        eventTypes.push("Class/ Workshop")
      })
      // set array values to be used later to merge
      this.$set('r25EventTypes', eventTypes)
      this.$set('r25RoomNames', roomNames)
      this.$set('r25Events', r25Events)
    },
    getAllEvents () {
      this.$set('allEvents', (_.concat(this.cornellEvents, this.libcalEvents, this.r25Events)))
      this.$set('allEventTypes', (_.union(this.cornellEventTypes, this.libcalEventTypes, this.r25EventTypes)))
      this.$set('allRoomNames', (_.union(this.cornellRoomNames, this.libcalRoomNames, this.r25RoomNames)))
      this.loadMoreDisplay(this.allEvents)
      this.$set('showNoEventsMessage', false)
      this.$set('filteredEvents', this.allEvents)
    },
    // Text for load more link
    loadMoreDisplay (events) {
      if (events.length <= this.limitList) {
        this.$set('loadMoreText', '')
      } else {
        this.$set('loadMoreText', 'View more events')
      }
    },
    // Cornell localist event
    getCornellEvent () {
      var localistApiBaseUrl = 'http://events.cornell.edu/api/2/events/'
      this.$http.get(localistApiBaseUrl + this.params).then(function (response) {
        // Create custom data model
        this.eventArray('Cornell', response.data.event)
      })
    },
    eventArray (source, data) {
      var startDateTime = ''
      var endDateTime = ''
      var additionalTimes = []
      var hasAdditionalTimes = 0
      var today = moment().startOf('day').format()
      if (source === 'Cornell') {
        _.forEach(_.map(data.event_instances, 'event_instance'), function (value, index) {
          var someday = moment(value.start).startOf('day')
          var days = someday.diff(today, 'days')
          if (days === 0 || data.event_instances.length === 1) {
            startDateTime = value.start
            endDateTime = value.end
          } else if (days > 0 && data.event_instances.length > 1) {
              additionalTimes.push([value.start, value.end])
              hasAdditionalTimes = additionalTimes.length
          } else if (days < 0) {
            // Show the last date time for the event
            startDateTime = value.start
            endDateTime = value.end
          }
        })
        if (hasAdditionalTimes && startDateTime < today && endDateTime < today) {
            startDateTime = additionalTimes[0][0]
            endDateTime = additionalTimes[0][1]
            additionalTimes.shift()
            hasAdditionalTimes = additionalTimes.length
        }
        var eventType = []
        // Event type filter list array
        _.forEach(_.map(data, 'event_types'), function (value) {
          _.forEach(_.map(value, 'name'), function (value) {
            eventType.push(value)
          })
        })

        this.$set('event', {
          'event_title': data.title,
          'event_description': data.description,
          'event_start_time': startDateTime,
          'event_end_time': endDateTime,
          'event_additional_times': additionalTimes,
          'event_has_additional_times': hasAdditionalTimes,
          'event_room_name': data.room_number,
          'event_type': eventType
        })
      } else if (source === 'Libcal') {
        this.$set('event', data)
      } else if (source === 'R25') {
        this.$set('event', {
          'event_title': data[0]['r25:event_name'][0],
          'event_description': data[0]['r25:event_title'][0],
          'event_start_time': moment(new Date(data[0]['r25:event_start_dt'][0])).format(),
          'event_end_time': moment(new Date(data[0]['r25:event_end_dt'][0])).format(),
          'event_room_name': data[0]['r25:space_reservation'][0]['r25:formal_name'][0],
          'event_type': ['Class/Workshop']
        })
      }
      this.$set('showNoEventsMessage', false)
      // Call Semantic ui modal and accordion for future times
      $('.ui.modal').modal({
        onHide: function () {
          // Ensure user lands on the events page on modal close.
          if (document.referrer && document.referrer !== window.location.href && document.referrer !== window.location.href.split('?')[0]) {
            window.history.back()
          } else {
            window.location = window.location.href.split('?')[0]
          }
        },
        onShow: function () {
          $('body').show()
        },
        onVisible: function () {
          $('.ui.modal').modal('refresh')
          $('.ui.accordion').accordion()
        }
      }).modal('show')
    }
  }
}
</script>
