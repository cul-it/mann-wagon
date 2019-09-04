<script>
import $ from 'jquery'
var _ = require('lodash')
var moment = require('moment')

import 'semantic-ui-css/components/checkbox.min.css';
import 'semantic-ui-css/components/checkbox.min.js';
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
  props: ['r25-webservice-authorization',
          'default-number-of-days',
          'events-page-path',
          'event-types',
          'event-locations'
        ],
  data () {
    return {
      eventSources: {
        updatedCornellEvents: false,
        updatedLibcalEvents: false,
        updatedR25Events: false
      },
      // Data from api's
      localistReservations: [],
      libcalReservations: [],
      r25Reservations: [],
      // Api errors
      errorCornellEvents: null,
      errorLibcalEvents: null,
      errorR25Events: null,
      errorCornellEvent: null,
      errorLibcalEvent: null,
      errorR25Event: null,
    // Arrays for event info
      cornellEvents: [],
      cornellEventTypes: [],
      cornellRoomNames: [],

      uncuratedEventTypes: [],
      uncuratedRoomNames: [],

      libcalEvents: [],
      libcalEventTypes: [],
      libcalRoomNames: [],

      r25Events: [],
      r25EventTypes: [],
      r25RoomNames: [],

      allEvents: [],
      allEventTypes: [],
      allRoomNames: [],

      curatedEventTypes: [],
      curatedEventLocations: [],

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
      noEventsMessage: 'No upcoming events.',
      noSingleEventMessage: null,
      // Array for filtered events, for no events message
      filteredEvents: [],
      // Current date time used to filter out past events on initial load
      dateTimeNow: moment().format(),
      // Handle libcal separately due to 30 mintue slots
      hidePastLibcalReservations: false,
      // Arrays for single event info
      event: [],
      url: window.location.href,
      query: '',
      params: '',
      eventsList: false,
      singleEvent: false,
      recurringEventStartTime: '',
      apiErrors: [],
      latestCornellRequest: 0,
      latestLibcalRequest: 0,
      latestR25Request: 0,
      r25Status: ''
    }
  },
  // Use vue-router transition data hook to trigger methods
  route: {
    data: function (transition) {
      if (this.$route.query) {
        this.$set('query', this.$route.query)
      }
      if (this.query.room) {
        this.$set('params', unescape(this.query.room))
      } else if (this.query.eventType) {
        this.$set('params', unescape(this.query.eventType))
      } else if (this.query.eventId) {
        this.$set('params', unescape(this.query.eventId))
      }
      if (transition.to.query.eventId) {
        this.displaySingleEventModal()
      } else if (transition.to.query.eventType || Object.keys(transition.to.query).length === 0) {
        this.displayEventList()
      }
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
        if (events.updatedCornellEvents && events.updatedLibcalEvents) {
          this.getAllEvents()
        }
        if ( events.updatedR25Events) {
          this.getAllEvents()
        }
      },
      deep: true
    },
    'errorCornellEvents': function () {
      this.logErrors('Cornell', this.errorCornellEvents)
    },
    'errorLibcalEvents': function () {
      this.logErrors('Libcal', this.errorLibcalEvents)
    },
    'errorR25Events': function () {
      this.logErrors('R25', this.errorR25Events)
    }
  },
  // Anything within the ready function will run when the application loads
  ready: function () {
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
    logErrors (service, error) {
      // log errors and show message to end user
      // console.log(error.status, error.statusText, error.request.url);
      this.apiErrors.push(service)
      if (this.apiErrors.length === 3) {
        this.$set('noEventsMessage', 'Something went wrong while getting upcoming events, please try again later. <br><a href="/contact/site-feedback">Report this issue.</a>')
      }
    },
    toggleAcademicCourses (status) {
      this.$set('eventSources.updatedR25Events', false)
      if (status) {
        if (this.dateSelected) {
          this.getR25Events('date', this.dateSelected)
        } else {
          this.getR25Events('default')
        }
        this.$set('showNoEventsMessage', true)
      } else {
        this.r25EventsArray([])
      }
    },
    displayEventList () {
      if (this.query.eventType) {
        this.setEventTypeFilter(this.params)
      }
      if (this.query.room) {
        this.setRoomFilter(this.params)
      }
      if (!this.eventSources.updatedCornellEvents && !this.eventSources.libcalEvent && !this.eventSources.r25Events) {
        this.getCornellEvents('default')
        this.getLibCalEvents('default')
        // Disable r25Events
          // this.getR25Events('default')
          // this.$set('eventSources.updatedR25Events', true)
        // events list
        this.$set('eventsList', true)
        if (this.eventTypes && this.eventLocations) {
          this.getCuratedFilters()
        }
      }
    },
    displaySingleEventModal () {
      this.$set('showNoEventsMessage', true)
      if (this.query.eventId) {
        if (this.params.match('LibCal(.*)')) {
          this.getLibCalEvents('event', this.params)
        } else if (this.params.match('R25(.*)')) {
          this.getR25Events('event', this.params.replace('R25-', ''))
        } else {
          this.getCornellEvent()
        }
        // single event
        this.$set('singleEvent', true)
        if (this.eventTypes && this.eventLocations) {
          this.getCuratedFilters()
        }
      }
    },
    getCuratedFilters() {
      // Get curated event types
      var event_types = this.eventTypes.split('-')
      var curated_event_types = []
      var curated_event_type_with_alt = []
      _.forEach(event_types, function (event_type, index){
        var curated_event_type = JSON.parse(event_type).curated_event_type_name,
        alternate_event_type_names = (JSON.parse(event_type).alternate_event_type_names)
        curated_event_types.push(curated_event_type);
        // curated_event_type_with_alt = {curated_event_type: curated_event_type,
        //                                    alternate_event_type_names: alternate_event_type_names}
        curated_event_type_with_alt.push([curated_event_type, alternate_event_type_names ]);
      })
      this.$set('allEventTypes', curated_event_types)
      this.$set('curatedEventTypes', curated_event_type_with_alt)

      // Get curated locations
      var event_locations = this.eventLocations.split('-')
      var curated_event_locations = []
      var curated_event_locations_with_alt = []
      _.forEach(event_locations, function (value, index){
        var curated_event_location = JSON.parse(value).curated_event_location_name,
        alternate_event_location_names = JSON.parse(value).alternate_event_location_names,
        smartmap_url = JSON.parse(value).smartmap_url;
        curated_event_locations.push(curated_event_location);
        curated_event_locations_with_alt.push([curated_event_location, alternate_event_location_names, smartmap_url ]);
      })
      this.$set('allRoomNames', curated_event_locations)
      this.$set('curatedEventLocations', curated_event_locations_with_alt)
    },
    setRecurringEventStartTime (startTime) {
      this.$set('recurringEventStartTime', startTime)
    },
    // Cornell localist events
    getCornellEvents (option, param) {
      var vueInstance = this
      var localistApiBaseUrl = 'https://events.cornell.edu/api/2/events/?type=4228&pp=100'
      if (this.localistReservations.length) {
        this.setCornellEvents(option, param)
        // Get default events
      } else if (option === 'default') {
        this.eventSources.updatedCornellEvents = false
          this.$http.get(localistApiBaseUrl + '&days=' + this.defaultNumberOfDays).then(function (response) {
            // Create custom data model
            var currentLocalistEvents = _.filter(response.data.events, function (event) {
              if (event.event.event_instances[0].event_instance.end) {
                return moment(new Date(event.event.event_instances[0].event_instance.end)).format() >= vueInstance.dateTimeNow
              } else {
                return event
              }
            })
            this.$set('localistReservations', currentLocalistEvents)
            this.setCornellEvents(option, param, currentLocalistEvents)
          }).catch(function(error){
            vueInstance.$set('errorCornellEvents', error)
            vueInstance.$set('eventSources.updatedCornellEvents', true)
          })
      } else if (option === 'date') {
        this.makeCornellRequest(localistApiBaseUrl, option, param)
      }
    },
    makeCornellRequest (localistApiBaseUrl, option, param) {
      var vueInstance = this
      var thisRequest = ++this.latestCornellRequest;
      var localistApiBaseUrl = 'https://events.cornell.edu/api/2/events/?type=4228&pp=100'

      this.$http.get(localistApiBaseUrl + '&start=' + param + '').then(function (response) {
        if (thisRequest === this.latestCornellRequest) {
          this.$set('localistReservations', response.data.events)
          this.setCornellEvents(option, param)
        }
      }).catch(function(error){
        vueInstance.$set('errorCornellEvents', error)
        vueInstance.$set('eventSources.updatedCornellEvents', true)
      })
    },
    setCornellEvents (option, param) {
      if (option === 'default') {
        this.cornellEventsArray(this.localistReservations)
      } else if (option === 'date') {
        this.cornellEventsArray(this.localistReservations)
      }
    },
    getLibCalEvents (option, param) {
      if (this.libcalReservations.length) {
        this.setLibCalEvents(option, param)
      } else {
        var vueInstance = this
        var thisRequest = ++this.latestLibcalRequest;

        this.eventSources.updatedLibcalEvents = false
        var mannservicesEventsUrl = 'https://api.library.cornell.edu/LibServices/showEventsById.do?output=json&id='
        var roomIds = [28, 32, 33, 34]
        var vueInstance = this
        var promise = []
        var libcalReservations = []
        // Create multiple api calls in loop
        _.each(roomIds, function (roomId, index) {
          promise[roomId] = vueInstance.$http(
            {
              type: 'GET',
              url: mannservicesEventsUrl + roomId,
              dataType: 'json'
            })
        })

        Promise.all([promise[28], promise[32], promise[33], promise[34]]).then((values) => {
          if (thisRequest === this.latestLibcalRequest) {
              _.each(values, function (value, index) {
                libcalReservations = _.concat(libcalReservations, value.data.eventList)
              })
              libcalReservations = _.each(libcalReservations, function (libcalReservation) {
                // remove email from eventId for use as url parameter for single event display
                libcalReservation.eventId = libcalReservation.eventId.split('-', 3).join('-')
              })
              this.$set('libcalReservations', libcalReservations);
              this.setLibCalEvents(option, param)
            }
          }).catch(function(error){
            vueInstance.setLibCalEvents(option, 'error')
            vueInstance.$set('noSingleEventMessage', 'Something went wrong while getting the event, please try again later. <br><a href="/contact/site-feedback">Report this issue.</a>')
            vueInstance.$set('errorLibcalEvents', error)
            vueInstance.$set('eventSources.updatedLibcalEvents', true)
          })
      }
    },
    setLibCalEvents (option, param) {
      // Create custom model, call methods only on last loop
      if (option === 'default') {
        // All reservations
        // Filter out past reservations
        var today = moment().startOf('day').format()
        var endDate = moment(today).add(this.defaultNumberOfDays, 'days').format()
        var notPastLibCalReservations = _.filter(this.libcalReservations, function (libcalReservation) {
          return moment(new Date(libcalReservation.formattedStartDateTime)).format() >= today
        })
        // Default number of days to load workaround
        var defaultLibCalReservations = _.filter(notPastLibCalReservations, function (notPastLibCalReservation) {
          return moment(new Date(notPastLibCalReservation.formattedStartDateTime)).format() <= endDate
        })
        this.libcalReservationsArray(defaultLibCalReservations)
        this.$set('hidePastLibcalReservations', true)
      } else if (option === 'date') {
        // Reservations on a date
        var filteredLibcalReservations = _.filter(this.libcalReservations, function (libcalReservation) {
          return (moment(new Date(libcalReservation.formattedStartDateTime)).format('YYYY-MM-DD')) === param
        })
        this.libcalReservationsArray(filteredLibcalReservations)
        this.$set('hidePastLibcalReservations', false)
      } else if (option === 'event') {
        // Single reservation
        // Can't get single event from json data due to 30 minute slots,
        // instead populate libcalEvents with merged events and filter on that
        if (param === 'error') {
          this.eventArray('Error')
        } else {
          this.libcalReservationsArray(this.libcalReservations)
          var singleLibcalReservation = _.filter(this.libcalEvents, function (libcalEvent) {
            return libcalEvent.event_id === param
          })
          this.eventArray('Libcal', singleLibcalReservation[0])
          this.$set('noSingleEventMessage', null)
        }
      }
    },
    getR25Events (option, param) {
      if (this.r25Reservations.length) {
        this.setR25Events (option, param)
      } else {
        // Use xml2js to convert xml string to JS object
        var parseString = require('xml2js').parseString
        this.eventSources.updatedR25Events = false
        var r25EventsBaseUrl = 'https://r25.registrar.cornell.edu/r25ws/servlet/wrd/run/rm_reservations.xml?'
        var roomIds = [704, 705]
        var vueInstance = this
        var promise = []
        var r25Reservations = []
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
                  r25Reservations[index] = result['r25:space_reservations']['r25:space_reservation']
                }
              })
            })
            r25Reservations = _.flattenDeep(r25Reservations)
            // Hide past events for default events
            var currentr25Reservations = _.filter(r25Reservations, function (r25Reservation) {
              return moment(new Date(r25Reservation['r25:event'][0]['r25:event_end_dt'])).format() >= vueInstance.dateTimeNow
            })

            this.$set('r25Reservations', currentr25Reservations)
            this.setR25Events (option, param)
          }).catch(function(error){
            vueInstance.$set('errorR25Events', error)
            vueInstance.$set('eventSources.updatedR25Events', true)
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
            this.makeR25Request(promise, r25EventsBaseUrl, option, param)
        } else if (option === 'event') {
          var r25EventBaseUrl = 'https://r25.registrar.cornell.edu/r25ws/servlet/wrd/run/reservation.xml?'
          var r25Event = []
          vueInstance.$http(
            {
              type: 'GET',
              url: r25EventBaseUrl + 'rsrv_id=' + param,
              headers: {
                'Authorization': 'Basic ' + vueInstance.r25WebserviceAuthorization
              },
              dataType: 'xml'
            }).then(function (response) {
              parseString(response.data, function (error, result) {
                r25Event = result['r25:reservations']['r25:reservation']
              })
              this.eventArray('R25Web', r25Event)
              this.$set('noSingleEventMessage', null)
            }).catch(function(error){
              vueInstance.eventArray('Error')
              vueInstance.$set('errorR25Event', error)
              this.$set('noSingleEventMessage', 'Something went wrong while getting the event, please try again later. <br><a href="/contact/site-feedback">Report this issue.</a>')
            })
        }
      }
    },
    makeR25Request (promise, r25EventsBaseUrl, option, param) {
      var vueInstance = this
      // Use xml2js to convert xml string to JS object
      var parseString = require('xml2js').parseString

      var thisRequest = ++this.latestR25Request;
      var r25Reservations = []

      Promise.all([promise[704], promise[705]]).then((values) => {
        if (thisRequest === this.latestR25Request) {
          _.each(values, function (value, index) {
            parseString(value.data, function (error, result) {
              if (result['r25:space_reservations']['r25:space_reservation']) {
                r25Reservations.push(result['r25:space_reservations']['r25:space_reservation'])
              }
            })
          })
          r25Reservations = _.flattenDeep(r25Reservations)
          this.$set('r25Reservations', r25Reservations)
          this.setR25Events (option, param)
        }
      }).catch(function(error){
        vueInstance.$set('errorR25Events', error)
        vueInstance.$set('eventSources.updatedR25Events', true)
      })
    },
    setR25Events (option, param) {
      if (option === 'default') {
        this.r25EventsArray(this.r25Reservations)
      } else if (option === 'date') {
        this.r25EventsArray(this.r25Reservations)
      } else if (option === 'event') {
        // this.cornellEventsArray(localistEvents)
        var singleR25Event = _.filter(this.r25Reservations, function (r25Reservation) {
          return r25Reservation['r25:reservation_id'][0] === param
        })
        this.eventArray('R25Local', singleR25Event[0])
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
      if (eventType == 'Academic Course') {
        this.toggleAcademicCourses(true)
        this.$set('r25Status', true)
      }
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
      this.localistReservations = this.libcalReservations = this.r25Reservations = []
      this.$set('dateSelected', '')
      this.getCornellEvents('default')
      this.getLibCalEvents('default')
      if (this.r25Status) {
        this.getR25Events('default')
      }
      $('#datepicker').datepicker('setDate', moment().format('YYYY-MM-DD'))
      $('#datepicker .ui-datepicker-today a').removeClass('ui-state-active');
      this.showNoEventsMessage = true
      this.allEvents = []
    },

    // Clear filters
    clearAllFilters () {
      this.localistReservations = this.libcalReservations = this.r25Reservations = []
      this.room = ''
      this.eventType = ''
      this.roomSelected = ''
      this.eventSelected = ''
      this.getCornellEvents('default')
      this.getLibCalEvents('default')
      if (this.r25Status) {
        this.getR25Events('default')
      }
      this.removeSearchFilter()
      this.$set('dateSelected', '')
      $('#datepicker').datepicker('setDate', moment().format('YYYY-MM-DD'))
      $('#datepicker .ui-datepicker-today a').removeClass('ui-state-active');
      this.showNoEventsMessage = true
      this.allEvents = []
    },
    // Load more events
    loadMoreEvents () {
      var newLimitList = this.limitList + this.listIncrement
      this.limitList = newLimitList > this.allEvents.length ? this.allEvents.length : newLimitList
    },
    // Custom data model from cornell events
    cornellEventsArray (data) {
      var vueInstance = this
      var cornellEvents = []
      var roomNames = []
      var eventTypes = []

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
        if (value.room_number != '') {
          events['event_room_name'] = value.room_number.trim().replace(',', '')
        } else if (value.location_name != '') {
          events['event_room_name'] = value.location_name.trim().replace(',', '')
        }
        _.forEach(vueInstance.curatedEventLocations, function(curatedEventLocation, index) {
          if (curatedEventLocation[0] === events['event_room_name'] || _.includes(curatedEventLocation[1], events['event_room_name'])) {
              events['event_room_name'] = curatedEventLocation[0]
              events['event_room_smartmap_url'] = curatedEventLocation[2]
          }
        })
        // Event type filter list array
        _.forEach(_.map(value, 'event_types'), function (value) {
          _.forEach(_.map(value, 'name'), function (value) {
            eventType.push(value.trim().replace(',', ''))
            if (eventTypes.indexOf(value.trim().replace(',', '')) === -1) {
              eventTypes.push(value.trim().replace(',', ''))
            }
          })
        })
        events['event_type'] = eventType
        _.forEach(eventType, function (type, index, eventType) {
          _.forEach(vueInstance.curatedEventTypes, function(curatedEventType) {
            if (curatedEventType[0] === type || _.includes(curatedEventType[1], type)) {
              if (eventType.indexOf(curatedEventType[0]) === -1) {
                eventType[index] = curatedEventType[0]
              }
            }
          })
        })
        events['event_recurring'] = value.recurring
        // Events array from localist
        cornellEvents.push(events)

        // Room filter list array
        if (value.room_number != '') {
          if (roomNames.indexOf(value.room_number.trim().replace(',', '')) === -1) {
            roomNames.push(value.room_number.trim().replace(',', ''))
          }
        } else if (value.location_name != '') {
          if (roomNames.indexOf(value.location_name.trim().replace(',', '')) === -1) {
            roomNames.push(value.location_name.trim().replace(',', ''))
          }
        }

      })
      _.forEach(eventTypes, function (type, index, eventTypes) {
        _.forEach(vueInstance.curatedEventTypes, function(curatedEventType) {
          if (curatedEventType[0] === type || _.includes(curatedEventType[1], type)) {
              eventTypes[index] = curatedEventType[0]
          }
        })
      })
      _.forEach(roomNames, function (room, index, roomNames) {
        _.forEach(vueInstance.curatedEventLocations, function(curatedEventLocation) {
          if (curatedEventLocation[0] === room || _.includes(curatedEventLocation[1], room)) {
              roomNames[index] = curatedEventLocation[0]
          }
        })
      })
      // set array values to be used later to merge
      this.$set('cornellEvents', cornellEvents)
      this.$set('cornellEventTypes', eventTypes)
      this.$set('cornellRoomNames', roomNames)
    },
    // Custom data model from libcal room bookings
    libcalReservationsArray (data) {
      var vueInstance = this
      var libcalEvents = []
      var eventTypes = []
      var roomNames = []
      // event counter
      var counter = 0

      // Event properties
      _.forEach(data, function (value, index) {
        var events = {}

        // Parse patron submitted values from description
        // -- handle missing values – all of these are required on the public form, but staff often bypass :(
        // -- first encountered missing values bug in 2018-01-19 LibCal E&S migration with event_type
        // -- should have listened to myself and implemented this failsafe for the rest of the .match() occurrences at that time
        // -- bit by this in a big way in 2019-09-03 when the events calendar was stuck in an endless loop
        // ---- due to missing/empty values for advertising with CU Events calendar, event name and event description
        // -- https://j11y.io/javascript/match-trick
        const eventAdvertise = (value.description.match('Will this be advertised through Cornell Events\\?: (.*)') || [, false])[1]
        const submittedName = value.description.match('Event Name: (.*)')[1]
        const eventTitle = submittedName === '' ? 'No title provided' : submittedName
        const submittedDescription = value.description.match('Event Description: (.*)')[1]
        const eventDescription = submittedDescription === '' ? 'No description provided' : submittedDescription
        const submittedEventType = (value.description.match('Event Type: (.*)') || [, ''])[1].trim().replace(',', '')
        const eventType = submittedEventType === '' ? 'MISSING' : submittedEventType

        if (vueInstance.libcalReservations.length) {          
          if (eventAdvertise === 'Yes') {
            // Already in Localist, Do nothing
          } else {
            // If same event based on title and time comparison
            // Check twice for lobby
            if (libcalEvents.length && libcalEvents[counter - 1].event_title === eventTitle && libcalEvents[counter - 1].event_end_time === moment(new Date(value.formattedStartDateTime)).format()) {
              libcalEvents[counter - 1].event_end_time = moment(new Date(value.formattedEndDateTime)).format()
            } else if (libcalEvents.length > 1 && libcalEvents[counter - 2].event_title === eventTitle && libcalEvents[counter - 2].event_end_time === moment(new Date(value.formattedStartDateTime)).format()) {
              libcalEvents[counter - 2].event_end_time = moment(new Date(value.formattedEndDateTime)).format()
            } else {
              events['event_id'] = value.eventId
              events['event_title'] = eventTitle
              events['event_description'] = eventDescription
              events['event_start_time'] = moment(new Date(value.formattedStartDateTime)).format()
              events['event_start'] = moment(new Date(value.formattedStartDateTime)).format('YYYY-MM-DD')
              events['event_end_time'] = moment(new Date(value.formattedEndDateTime)).format()
              events['event_room_name'] = value.location.trim().replace(',', '')
              _.forEach(vueInstance.curatedEventLocations, function(curatedEventLocation, index) {
                if (curatedEventLocation[0] === events['event_room_name'] || _.includes(curatedEventLocation[1], events['event_room_name'])) {
                    events['event_room_name'] = curatedEventLocation[0]
                    events['event_room_smartmap_url'] = curatedEventLocation[2]
                }
              })

              events['event_type'] = [eventType]

              _.forEach(vueInstance.curatedEventTypes, function(curatedEventType, index) {
                if (curatedEventType[0] === eventType || _.includes(curatedEventType[1], eventType)) {
                  events['event_type'] = [curatedEventType[0]]
                }
              })

              // Events array from LibCal
              libcalEvents.push(events)
              // Increment event counter

            // Room filter list array
            if (roomNames.indexOf(value.location.trim().replace(',', '')) === -1) {
              roomNames.push(value.location.trim().replace(',', ''))
            }

            // Event type filter list array
            if (eventTypes.indexOf(eventType) === -1) {
              eventTypes.push(eventType)
            }
              counter++
            }
          }
        }
      })
      if (vueInstance.libcalReservations.length) {
        _.forEach(eventTypes, function (type, index, eventTypes) {
          _.forEach(vueInstance.curatedEventTypes, function(curatedEventType) {
            if (curatedEventType[0] === type || _.includes(curatedEventType[1], type)) {
                eventTypes[index] = curatedEventType[0]
            }
          })
        })
        _.forEach(roomNames, function (room, index, roomNames) {
          _.forEach(vueInstance.curatedEventLocations, function(curatedEventLocation) {
            if (curatedEventLocation[0] === room || _.includes(curatedEventLocation[1], room)) {
                roomNames[index] = curatedEventLocation[0]
            }
          })
        })
        // Set array values to be used later to merge
        this.$set('libcalEvents', libcalEvents)
        this.$set('libcalEventTypes', eventTypes)
        this.$set('libcalRoomNames', roomNames)
      }
    },
    // Custom data model from r25 events
    r25EventsArray (data) {
      var vueInstance = this
      var r25Events = []
      var eventTypes = []
      var roomNames = []
      if (data.length) {
        _.forEach(data, function (value, index) {
          var events = {}
          events['event_id'] = 'R25-' + value['r25:reservation_id'][0]
          events['event_title'] = value['r25:event'][0]['r25:event_name']['0']
          events['event_description'] = value['r25:event'][0]['r25:event_title']['0']
          events['event_start_time'] = moment(new Date(value['r25:event'][0]['r25:event_start_dt']['0'])).format()
          events['event_start'] = moment(new Date(value['r25:event'][0]['r25:event_start_dt']['0'])).format('YYYY-MM-DD')
          events['event_end_time'] = moment(new Date(value['r25:event'][0]['r25:event_end_dt']['0'])).format()
          events['event_room_name'] = value['r25:spaces'][0]['r25:formal_name'][0].trim().replace(',', '')
          _.forEach(vueInstance.curatedEventLocations, function(curatedEventLocation, index) {
            if (curatedEventLocation[0] === events['event_room_name'] || _.includes(curatedEventLocation[1], events['event_room_name'])) {
                events['event_room_name'] = curatedEventLocation[0]
                events['event_room_smartmap_url'] = curatedEventLocation[2]
            }
          })
          events['event_type'] = [value['r25:layout_name'][0].trim().replace(',', '')]
          _.forEach(vueInstance.curatedEventTypes, function(curatedEventType, index) {
            if (curatedEventType[0] === value['r25:layout_name'][0].trim().replace(',', '') || _.includes(curatedEventType[1], value['r25:layout_name'][0].trim().replace(',', ''))) {
              events['event_type'] = [curatedEventType[0]]
            }
          })
          // Events array from r25
          r25Events.push(events)
          // Room filter list array
          if (roomNames.indexOf(value['r25:spaces'][0]['r25:formal_name'][0].trim().replace(',', '')) === -1) {
            roomNames.push(value['r25:spaces'][0]['r25:formal_name'][0].trim().replace(',', ''))
          }
          // Event type filter list array
          if (eventTypes.indexOf(value['r25:layout_name'][0].trim().replace(',', ''))) {
            eventTypes.push(value['r25:layout_name'][0].trim().replace(',', ''))
          }

        })

        _.forEach(eventTypes, function (type, index, eventTypes) {
          _.forEach(vueInstance.curatedEventTypes, function(curatedEventType) {
            if (curatedEventType[0] === type || _.includes(curatedEventType[1], type)) {
                eventTypes[index] = curatedEventType[0]
            }
          })
        })

        _.forEach(roomNames, function (room, index, roomNames) {
          _.forEach(vueInstance.curatedEventLocations, function(curatedEventLocation) {
            if (curatedEventLocation[0] === room || _.includes(curatedEventLocation[1], room)) {
                roomNames[index] = curatedEventLocation[0]
            }
          })
        })
      }
      // set array values to be used later to merge
      this.$set('r25Events', r25Events)
      this.$set('r25EventTypes', eventTypes)
      this.$set('r25RoomNames', roomNames)
    },
    getAllEvents () {
      var vueInstance = this
      if (this.hidePastLibcalReservations) {
        var vueInstance = this
        this.libcalEvents = _.filter(this.libcalEvents, function (libcalEvent) {
          return libcalEvent.event_end_time >= vueInstance.dateTimeNow
        })
      }
      this.$set('allEvents', (_.concat(this.cornellEvents, this.libcalEvents, this.r25Events)))
      this.$set('uncuratedEventTypes', (_.difference((_.union(this.cornellEventTypes, this.libcalEventTypes, this.r25EventTypes)), this.allEventTypes)))
      this.$set('uncuratedRoomNames', (_.difference((_.union(this.cornellRoomNames, this.libcalRoomNames, this.r25RoomNames)), this.allRoomNames)))
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
      var vueInstance = this
      var localistApiBaseUrl = 'https://events.cornell.edu/api/2/events/'
      this.$http.get(localistApiBaseUrl + this.params).then(function (response) {
        // Create custom data model
        this.eventArray('Cornell', response.data.event)
        this.$set('noSingleEventMessage', null)
      }).catch(function(error){
        vueInstance.eventArray('Error')
        vueInstance.$set('errorCornellEvent', error)
        this.$set('noSingleEventMessage', 'Something went wrong while getting the event, please try again later. <br><a href="/contact/site-feedback">Report this issue.</a>')
      })
    },
    eventArray (source, data) {
      var vueInstance = this
      var startDateTime = ''
      var endDateTime = ''
      var additionalTimes = []
      var hasAdditionalTimes = 0
      var today = moment().startOf('day').format()
      var location_smartmap_url = ''
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
          if (this.recurringEventStartTime) {
            startDateTime = this.recurringEventStartTime
          } else {
            startDateTime = additionalTimes[0][0]
            endDateTime = additionalTimes[0][1]
            additionalTimes.shift()
            hasAdditionalTimes = additionalTimes.length
          }
        }
        var eventType = []
        // Event type filter list array
        _.forEach(_.map(data, 'event_types'), function (value) {
          _.forEach(_.map(value, 'name'), function (value) {
            eventType.push(value.trim().replace(',', ''))
          })
        })
        _.forEach(eventType, function (type, index, eventType) {
          _.forEach(vueInstance.curatedEventTypes, function(curatedEventType) {
            if (curatedEventType[0] === type || _.includes(curatedEventType[1], type)) {
              if (eventType.indexOf(curatedEventType[0]) === -1) {
                eventType[index] = curatedEventType[0]
              }
            }
          })
        })
        var location = ''
        if (data.room_number !== '') {
          location = data.room_number.trim().replace(',', '')
        } else if (data.location_name != '') {
          location = data.location_name.trim().replace(',', '')
        }
        _.forEach(vueInstance.curatedEventLocations, function(curatedEventLocation, index) {
          if (curatedEventLocation[0] === location || _.includes(curatedEventLocation[1], location)) {
              location = curatedEventLocation[0]
              location_smartmap_url = curatedEventLocation[2]
          }
        })

        this.$set('event', {
          'event_title': data.title,
          'event_description': data.description,
          'event_start_time': startDateTime,
          'event_end_time': endDateTime,
          'event_additional_times': additionalTimes,
          'event_has_additional_times': hasAdditionalTimes,
          'event_room_name': location,
          'event_type': eventType,
          'event_room_smartmap_url': location_smartmap_url
        })
      } else if (source === 'Libcal') {
        this.$set('event', data)
      } else if (source === 'R25Local') {
          var location = data['r25:spaces'][0]['r25:formal_name'][0].trim().replace(',', '')
          _.forEach(vueInstance.curatedEventLocations, function(curatedEventLocation, index) {
            if (curatedEventLocation[0] === location || _.includes(curatedEventLocation[1], location)) {
                location = curatedEventLocation[0]
                location_smartmap_url = curatedEventLocation[2]
            }
          })
        var event_type = data['r25:layout_name'][0].trim().replace(',', '')
        _.forEach(vueInstance.curatedEventTypes, function(curatedEventType, index) {
          if (curatedEventType[0] === event_type || _.includes(curatedEventType[1], event_type)) {
              event_type = curatedEventType[0]
          }
        })
        this.$set('event', {
          'event_title': data['r25:event'][0]['r25:event_name']['0'],
          'event_description': data['r25:event'][0]['r25:event_title']['0'],
          'event_start_time': moment(new Date(data['r25:event'][0]['r25:event_start_dt']['0'])).format(),
          'event_end_time': moment(new Date(data['r25:event'][0]['r25:event_end_dt']['0'])).format(),
          'event_room_name': location,
          'event_type': [event_type],
          'event_room_smartmap_url': location_smartmap_url
        })
      } else if (source === 'R25Web') {
        var location = data[0]['r25:space_reservation'][0]['r25:formal_name'][0].trim().replace(',', '')
        _.forEach(vueInstance.curatedEventLocations, function(curatedEventLocation, index) {
          if (curatedEventLocation[0] === location || _.includes(curatedEventLocation[1], location)) {
              location = curatedEventLocation[0]
              location_smartmap_url = curatedEventLocation[2]
          }
        })
        var event_type = data['r25:layout_name'][0].trim().replace(',', '')
        _.forEach(vueInstance.curatedEventTypes, function(curatedEventType, index) {
          if (curatedEventType[0] === event_type || _.includes(curatedEventType[1], event_type)) {
              event_type = curatedEventType[0]
          }
        })
        this.$set('event', {
          'event_title': data[0]['r25:event_name'][0],
          'event_description': data[0]['r25:event_title'][0],
          'event_start_time': moment(new Date(data[0]['r25:event_start_dt'][0])).format(),
          'event_end_time': moment(new Date(data[0]['r25:event_end_dt'][0])).format(),
          'event_room_name': location,
          'event_type': [event_type],
          'event_room_smartmap_url': location_smartmap_url
        })
      }      // Call Semantic ui modal and accordion for future times
      $('.ui.modal').modal({
        dimmerSettings: {
          opacity: .5
        },
        onHide: function () {
          vueInstance.$route.router.go(vueInstance.eventsPagePath)
          if (vueInstance.filteredEvents.length === 0) {
            vueInstance.showNoEventsMessage = true
          }
        },
        onShow: function () {
        },
        onVisible: function () {
          $('.ui.modal').modal('refresh')
          $('.ui.accordion').accordion()
          vueInstance.$set('showNoEventsMessage', false)
        }
      }).modal('show')
    }
  }
}
</script>
