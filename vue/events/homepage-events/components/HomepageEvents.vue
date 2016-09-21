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

export default {
  name: 'events',
  template: require('../templates/homepage-template.html'),
  props: ['r25-webservice-authorization', 'default-number-of-days', 'homepage-r25-default-number-of-days'],
  data () {
    return {
      eventSources: {
        updatedCornellEvents: false,
        updatedLibcalEvents: false,
        updatedR25Events: false
      },
      // Arrays for event info
      cornellEvents: [],
      libcalEvents: [],
      r25Events: [],
      allEvents: [],
      // Event type filter param
      eventType: '',
      // Group events key
      dateKey: 'event_start',
      // No events message
      showNoEventsMessage: true,
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
      recurringEventStartTime: ''
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
  // Use watch to check if data has been updated and then combine
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
  },
  filters: {
    // Event filter
    eventTypeFilter: function (events, eventType) {
      if (eventType === '') {
        this.loadMoreDisplay(events)
        return events
      } else {
        var filterEvents = function (event) {
          return event.event_type.indexOf(eventType) > -1
        }
        return events.filter(filterEvents)
      }
    },
    hideEventType: function (events, eventType) {
      var hideEvents = function (event) {
        return event.event_type.indexOf(eventType) === -1
      }
      return events.filter(hideEvents)
    },
    // MomentJS filters
    momentHomeDate: function (date) {
      if (date === '') {
        return
      } else {
        return moment(date).format('ddd, MMM DD, YYYY')
      }
    },
    momentHomeTime: function (date) {
      if ((moment(date).get('minutes'))) {
        return moment(date).format('h:mm a')
      }
      return moment(date).format('h a')
    },
    momentHomeDateText: function (date) {
      var someday = moment(date).startOf('day')
      var today = moment().startOf('day')
      var days = someday.diff(today, 'days')
      if (days === 0) {
        return 'Today'
      } else if (days === 1) {
        return 'Tomorrow'
      } else {
        return moment(date).format('ddd, MMM DD')
      }
    },
    // Limit events list
    limitListFilter: function (events, limitList) {
      return events.slice(0, Number(limitList))
    },
    // Group events by day (event_start)
    groupBy: function (events, dateKey) {
      return _.groupBy(events, dateKey)
    }
  },
  methods: {
    displayEventList () {
      if (this.query.eventType) {
        this.setEventTypeFilter(this.params)
      }
      if (this.query.room) {
        this.setRoomFilter(this.params)
      }
      if (!this.eventSources.updatedCornellEvents && !this.eventSources.libcalEvent && !this.eventSources.r25Events) {
        this.getCornellEvents('default')
        this.getMannServicesEvents('default')
        this.getR25Events('default')
        // events list
        this.$set('eventsList', true)
      }
    },
    displaySingleEventModal () {
      this.$set('showNoEventsMessage', true)
      if (this.query.eventId) {
        if (this.params.match('LibCal(.*)')) {
          this.getMannServicesEvents('event', this.params)
        } else if (this.params.match('R25(.*)')) {
          this.getR25Events('event', this.params.replace('R25-', ''))
        } else {
          this.getCornellEvent()
        }
        // single event
        this.$set('singleEvent', true)
      }
    },
    checkDateText (date) {
      if (['Today', 'Tomorrow'].indexOf(this.$options.filters.momentHomeDateText(date)) !== -1) {
        return true
      }
    },
    setRecurringEventStartTime (startTime) {
      this.$set('recurringEventStartTime', startTime)
    },
    // Cornell localist events
    getCornellEvents (option, date) {
      var localistApiBaseUrl = 'http://events.cornell.edu/api/2/events/?type=4228&pp=100'
      // Get default events
      this.$http.get(localistApiBaseUrl + '&days=' + this.defaultNumberOfDays).then(function (response) {
        // Create custom data model
        var vueInstance = this
        var currentLocalistEvents = _.filter(response.data.events, function (event) {
          return moment(new Date(event.event.event_instances[0].event_instance.end)).format() >= vueInstance.dateTimeNow
        })
        this.cornellEventsArray(currentLocalistEvents)
      })
    },
    getMannServicesEvents (option, param) {
      var mannservicesEventsUrl = 'http://mannservices.mannlib.cornell.edu/LibServices/showEventsById.do?output=json&id='
      var roomIds = [23, 24, 25, 26]
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
      Promise.all([promise[23], promise[24], promise[25], promise[26]]).then((values) => {
        _.each(values, function (value, index) {
          libcalReservations = _.concat(libcalReservations, value.data.eventList)
        })
        libcalReservations = _.each(libcalReservations, function (libcalReservation) {
          // remove email from eventId for use as url parameter for single event display
          libcalReservation.eventId = libcalReservation.eventId.split('-', 3).join('-')
        })

        // Create custom model, call methods only on last loop
        if (option === 'default') {
          // All reservations
          // Filter out past reservations
          var today = moment().startOf('day').format()
          var endDate = moment(today).add(this.defaultNumberOfDays, 'days').format()
          var notPastLibCalReservations = _.filter(libcalReservations, function (libcalReservation) {
            return moment(new Date(libcalReservation.formattedStartDateTime)).format() >= today
          })
          // Default number of days to load workaround
          var defaultLibCalReservations = _.filter(notPastLibCalReservations, function (notPastLibCalReservation) {
            return moment(new Date(notPastLibCalReservation.formattedStartDateTime)).format() <= endDate
          })
          this.libcalReservationsArray(defaultLibCalReservations)
          this.$set('hidePastLibcalReservations', true)
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
              url: r25EventsBaseUrl + 'space_id=' + roomId + '&start_dt=' + today + '&end_dt=+' + vueInstance.homepageR25DefaultNumberOfDays,
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
      } else if (option === 'event') {
        var r25EventBaseUrl = 'https://r25test.registrar.cornell.edu/r25ws/servlet/wrd/run/reservation.xml?'
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
            this.eventArray('R25', r25Event)
          })
      }
    },
    // Custom data model from cornell events
    cornellEventsArray (data) {
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
            eventType.push(value)
          })
        })
      })
      // set array values to be used later to merge
      this.$set('cornellEvents', cornellEvents)
    },

    // Custom data model from libcal room bookings
    libcalReservationsArray (data) {
      var libcalEvents = []
      var counter = 0
      // Event properties
      _.forEach(data, function (value, index) {
        var events = {}
        // If same event based on title and time comparison
        // Check twice for lobby
        if (libcalEvents.length && libcalEvents[counter - 1].event_title === value.description.match('Event Name: (.*)')[1] && libcalEvents[counter - 1].event_end_time === moment(new Date(value.formattedStartDateTime)).format()) {
          libcalEvents[counter - 1].event_end_time = moment(new Date(value.formattedEndDateTime)).format()
        } else if (libcalEvents.length > 1 && libcalEvents[counter - 2].event_title === value.description.match('Event Name: (.*)')[1] && libcalEvents[counter - 2].event_end_time === moment(new Date(value.formattedStartDateTime)).format()) {
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
          counter++
        }
      })

      // Set array values to be used later to merge
      this.$set('libcalEvents', libcalEvents)
    },
    // Custom data model from r25 events
    r25EventsArray (data) {
      var r25Events = []

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
      })
      // set array values to be used later to merge
      this.$set('r25Events', r25Events)
    },
    getAllEvents () {
      if (this.hidePastLibcalReservations) {
        var vueInstance = this
        this.libcalEvents = _.filter(this.libcalEvents, function (libcalEvent) {
          return libcalEvent.event_end_time >= vueInstance.dateTimeNow
        })
      }
      this.$set('allEvents', (_.concat(this.cornellEvents, this.libcalEvents, this.r25Events)))
      this.$set('showNoEventsMessage', false)
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
      var vueInstance = this
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
      // Call Semantic ui modal and accordion for future times
      $('.ui.modal').modal({
        onHide: function () {
          vueInstance.$route.router.go('/')
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
