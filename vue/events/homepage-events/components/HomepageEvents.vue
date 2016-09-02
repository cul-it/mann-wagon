<script>
var _ = require('lodash')
var moment = require('moment')

export default {
  name: 'events',
  template: require('../templates/homepage-template.html'),
  data () {
    return {
      eventSources: {
        cornellEvents: [],
        libcalEvents: []
      },
      // Arrays for event info
      allEvents: [],
      // Event type filter param
      eventType: '',
      // Group events key
      dateKey: 'event_start',
      // No events message
      showNoEventsMessage: true
    }
  },
  // Use watch to check if data has been updated and then combine
  watch: {
    eventSources: {
      handler: function (events) {
        if (events.cornellEvents.length > 0 && events.libcalEvents.length > 0) {
          this.getAllEvents()
        }
      },
      deep: true
    }
  },
  // Anything within the ready function will run when the application loads
  ready: function () {
    // When the application loads, call methods
    this.getCornellEvents('default')
    this.getMannServicesEvents('default')
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
    // MomentJS filters
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
    // Cornell localist events
    getCornellEvents (option, date) {
      var localistApiBaseUrl = 'http://events.cornell.edu/api/2/events/?type=4228&pp=100'
      // Get default events
      this.$http.get(localistApiBaseUrl + '&days=28').then(function (response) {
        // Create custom data model
        this.cornellEventsArray(response.data.events)
      })
    },
    getMannServicesEvents (option, date) {
      var mannservicesEventsUrl = 'http://mannservices.mannlib.cornell.edu/LibServices/showEventsById.do?output=json&id='
      var roomIds = [23, 24, 25, 26]
      var vueInstance = this
      var libcalReservations = []
      _.each(roomIds, function (roomId, index) {
        vueInstance.$http(
          {
            type: 'GET',
            url: mannservicesEventsUrl + roomId,
            dataType: 'json'
          })
          .then(function (response) {
            // Create custom data model
            libcalReservations = _.concat(libcalReservations, response.data.eventList)
            libcalReservations = _.each(libcalReservations, function (libcalReservation) {
              libcalReservation.eventId = libcalReservation.eventId.split('-', 3).join('-')
            })
            if (index === (roomIds.length - 1)) {
              var today = moment().startOf('day').format()
              var currentReservations = _.filter(libcalReservations, function (libcalReservation) {
                return moment(new Date(libcalReservation.formattedStartDateTime)).format() >= today
              })
              this.libcalReservationsArray(currentReservations)
            }
          })
      })
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
      this.$set('eventSources.cornellEvents', cornellEvents)
    },

    // Custom data model from libcal room bookings
    libcalReservationsArray (data) {
      var libcalEvents = []
      var counter = 0
      // Event properties
      _.forEach(data, function (value, index) {
        var events = {}
        // If same event based on title and time comparison
        if (libcalEvents.length && libcalEvents[counter - 1].event_title === value.description.match('Event Name: (.*)')[1] && libcalEvents[counter - 1].event_end_time === moment(new Date(value.formattedStartDateTime)).format()) {
          libcalEvents[counter - 1].event_end_time = moment(new Date(value.formattedEndDateTime)).format()
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
      this.$set('eventSources.libcalEvents', libcalEvents)
    },
    getAllEvents () {
      this.$set('allEvents', (_.concat(this.eventSources.cornellEvents, this.eventSources.libcalEvents)))
      this.$set('showNoEventsMessage', false)
    }
  }
}
</script>
