<script>
var _ = require('lodash')
var moment = require('moment')
import 'semantic-ui-css/components/dimmer.min.js';
import 'semantic-ui-css/components/dimmer.min.css';
import 'semantic-ui-css/components/modal.min.js';
import 'semantic-ui-css/components/modal.min.css';
import 'semantic-ui-css/components/transition.min.js';
import 'semantic-ui-css/components/transition.min.css';
import 'semantic-ui-css/components/accordion.min.js';
import 'semantic-ui-css/components/accordion.min.css';
import Description from './Description.vue'

export default {
  name: 'events',
  template: require('../templates/events-template.html'),
  components: {
    Description
  },
  data () {
    return {
    // Arrays for event info
      cornellEvents: [],
      cornellEventTypes: [],
      cornellRoomNames: [],

      libcalEvents: [],
      libcalEventTypes: [],
      libcalRoomNames: [],

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
      // Arrays for single event info
      event: [],
      query: this.$route.query,
      route: this.$route,
      params: '',
      eventsList: false,
      singleEvent: false
    }
  },
  // Anything within the ready function will run when the application loads
  ready: function () {
    if (this.query.room) {
      this.$set('params', this.query.room)
    } else if (this.query.eventType) {
      this.$set('params', this.query.eventType)
    } else if (this.query.eventId) {
      this.$set('params', this.query.eventId)
    }
    if (this.query.eventId) {
      if (this.params.match(/[a-z]/i)) {
        this.getMannServicesEvents('event', this.params)
      } else {
        this.getCornellEvent()
      }
      // single event
      this.$set('singleEvent', true)
      $('body').hide()
    } else {
      if (this.query.eventType) {
        this.setEventTypeFilter(this.params)
      }
      if (this.query.room) {
        this.setRoomFilter(this.params)
      }
    }
    // When the application loads, call methods
    this.getCornellEvents('default')
    this.getMannServicesEvents('default')
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
      var localistApiBaseUrl = 'http://events.cornell.edu/api/2/events/?type=4228&pp=100'
      // Get default events
      if (option === 'default') {
        this.$http.get(localistApiBaseUrl + '&days=28').then(function (response) {
          // Create custom data model
          this.cornellEventsArray(response.data.events)
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
            // Create custom model, call methods only on lass loop
            if (index === (roomIds.length - 1)) {
              if (option === 'default') {
                // All reservations
                this.libcalReservationsArray(libcalReservations)
              } else if (option === 'date') {
                // Reservations on a date
                var filteredLibcalReservations = _.filter(libcalReservations, function (libcalReservation) {
                  return (moment(new Date(libcalReservation.formattedStartDateTime)).format('YYYY-MM-DD')) == param
                })
                this.libcalReservationsArray(filteredLibcalReservations)
              } else if (option === 'event') {
                // Single reservation
                var filteredLibcalReservation = _.filter(libcalReservations, function (libcalReservation) {
                  return libcalReservation.eventId === param
                })
                this.eventArray('Libcal', filteredLibcalReservation)
              }
            }
          })
      })
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
      $('#datepicker').datepicker('setDate', moment().format('YYYY-MM-DD'))
    },

    // Clear filters
    clearAllFilters () {
      this.room = ''
      this.eventType = ''
      this.roomSelected = ''
      this.eventSelected = ''
      this.getCornellEvents('default')
      this.getMannServicesEvents('default')
      this.removeSearchFilter()
      this.$set('dateSelected', '')
      $('#datepicker').datepicker('setDate', moment().format('YYYY-MM-DD'))
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

      // Event properties
      _.forEach(data, function (value) {
        var events = {}
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
      })
      // Set array values to be used later to merge
      this.$set('libcalEventTypes', eventTypes)
      this.$set('libcalRoomNames', roomNames)
      this.$set('libcalEvents', libcalEvents)
      // Use lodash to combine the arrays and set
      this.$set('allEvents', (_.concat(this.cornellEvents, this.libcalEvents)))
      this.$set('allEventTypes', (_.union(this.cornellEventTypes, this.libcalEventTypes)))
      this.$set('allRoomNames', (_.union(this.cornellRoomNames, this.libcalRoomNames)))
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
      if (source === 'Cornell') {
        _.forEach(_.map(data.event_instances, 'event_instance'), function (value, index) {
          var today = moment().startOf('day').format()
          var someday = moment(value.start).startOf('day')
          var days = someday.diff(today, 'days')
          if (days === 0 || data.event_instances.length === 1) {
            startDateTime = value.start
            endDateTime = value.end
          } else if (days > 0 && data.event_instances.length > 1) {
            if (index === 0) {
              startDateTime = value.start
              endDateTime = value.end
            } else if (index > 0) {
              additionalTimes.push([value.start, value.end])
              hasAdditionalTimes = additionalTimes.length
            }
          } else if (days < 0) {

          }
        })
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
        this.$set('event', {
          'event_title': data[0].description.match('Event Name: (.*)')[1],
          'event_description': data[0].description.match('Event Description: (.*)')[1],
          'event_start_time': moment(new Date(data[0].formattedStartDateTime)).format(),
          'event_end_time': moment(new Date(data[0].formattedEndDateTime)).format(),
          'event_room_name': data[0].location,
          'event_type': [data[0].description.match('Event type:: (.*)')[1]]
        })
      }
      this.$set('showNoEventsMessage', false)
      // Call Semantic ui modal and accordion for future times
      $('.ui.modal').modal({
        onHide: function(){
          // Ensure user lands on the events page on modal close.
          if(document.referrer && document.referrer != window.location.href && document.referrer != window.location.href.split("?")[0]){
            window.history.back()
          } else {
            window.location = window.location.href.split("?")[0]
          }
        },
        onShow: function () {
        $('body').show()
        },
        onVisible: function () {
          $('.ui.modal').modal("refresh")
          $('.ui.accordion').accordion()
        }
      }).modal('show')
    }
  }
}
</script>
