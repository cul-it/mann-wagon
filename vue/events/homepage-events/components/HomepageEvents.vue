<script>
var Cookies = require('js-cookie');
var _ = require('lodash');
var moment = require('moment');

export default {
  template: require('../templates/homepage-template.html'),
  props: ['booked-username', 'booked-password'],
  data () {
    return {
      // Arrays for event info
      cornellEvents: [],
      bookedEvents: [],
      allEvents: [],
      // Event type filter param
      eventType: '',
      // Booked auth headers
      headers:{},
      // Group events key
      dateKey : 'event_start',

      // No events message
      showNoEventsMessage: true,
    }
  },
  // Anything within the ready function will run when the application loads
  ready: function() {
    // When the application loads, call methods
    this.getCornellEvents("default");
    this.bookedAuthentication();
    if((Cookies.get('filter'))){
      this.setEventTypeFilter(Cookies.get('filter'));
    }
  },
  filters: {
    // Event filter
    eventTypeFilter : function(events, eventType){
      if (eventType == ''){
        this.loadMoreDisplay(events);
        return events;
      }
      else {
        var filterEvents = function(event) {
            return event.event_type.indexOf(eventType) > -1;
        }
        return events.filter(filterEvents);
      }
    },
    // MomentJS filters
    momentHomeTime: function (date) {
      if((moment(date).get('minutes'))){
        return moment(date).format('h:mm a');
      }
      return moment(date).format('h a');
    },
    momentHomeDateText: function (date) {
      var someday = moment(date).startOf('day');
      var today = moment().startOf('day');
      var days = someday.diff(today, "days");
      if (days == 0){
        return "Today";
      } else if (days == 1){
        return "Tomorrow";
      }
      else {
        return moment(date).format('ddd, MMM DD');
      }
    },
    // Limit events list
    limitListFilter: function(events, limitList) {
      return events.slice(0, Number(limitList))
    },
    // Group events by day (event_start)
    groupBy: function(events, dateKey){
         return _.groupBy(events, dateKey);
    }
  },
  methods: {
    // Cornell localist events
    getCornellEvents(option, date) {
      var localistApiBaseUrl = 'http://events.cornell.edu/api/2/events/?type=4228&pp=100';
      // Get default events
      if(option == "default"){
        this.$http.get(localistApiBaseUrl+"&days=28").then(function(response) {
          // Create custom data model
          this.cornellEventsArray(response.data.events);
        });
      }
      // Get events for a date
      else if (option == "date"){
        this.$http.get(localistApiBaseUrl+"&start="+date+"").then(function(response) {
          // Create custom data model
          this.cornellEventsArray(response.data.events);
        });
      }
    },
    // Authenticate booked
    bookedAuthentication(){
      this.$http(
        {
        url: 'http://booked-dev.library.cornell.edu/Web/Services/index.php/Authentication/Authenticate',
        method: 'POST',
        data: JSON.stringify({username: this.bookedUsername, password: this.bookedPassword}),
        dataType: "json"
      }).then(function (data) {
          // success callback
          if (data.data.isAuthenticated)
          {
            this.$set('headers', {"X-Booked-SessionToken": data.data.sessionToken, "X-Booked-UserId": data.data.userId});
            this.getBookedReservations("default");
          }
          else
          {
            alert(data.message);
          }
      }, function (response) {
          // error callback
      });
    },
    // Get reservations from booked
    getBookedReservations(option, date){
    var bookedApiUrl = '';
      // Get default events
      if(option == "default"){
        bookedApiUrl = "http://booked-dev.library.cornell.edu/Web/Services/index.php/Reservations/?resourceId=3";
      // Get events for a date
      } else if (option == "date"){
        bookedApiUrl = "http://booked-dev.library.cornell.edu/Web/Services/index.php/Reservations/?resourceId=3&startDateTime="+date+"T00:00:00&endDateTime="+date+"T23:59:59";
      }
        this.$http(
                {
                    type: "GET",
                    url: bookedApiUrl,
                    headers: this.headers,
                    dataType: "json"
                })
                .then(function (response)
                {
                  // Create custom data model
                  this.bookedEventsArray(response.data.reservations);
                });

    },
    // Custom data model from cornell events
    cornellEventsArray(data){
      var cornell_events = [];

      // Event properties
      _.forEach(_.map(data, 'event'), function(value){
        var events = {};
        var event_type = [];
        events['event_title'] = value.title;
        events['event_description'] = value.description;
        events['event_start_time'] = value.event_instances[0].event_instance.start;
        events['event_start'] = value.event_instances[0].event_instance.start.substring(0, 10);
        events['event_end_time'] = value.event_instances[0].event_instance.end;
        events['event_room_name'] = value.room_number;
        events['event_type'] = event_type;

        // Events array from localist
        cornell_events.push(events);
      });
      // set array values to be used later to merge
      this.$set('cornellEvents', cornell_events);
    },

    // Custom data model from booked events
    bookedEventsArray(data){
      var booked_events = [];

      // Event properties
      _.forEach(data, function(value) {
        var events = {};
        events['event_type'] = ['Class/ Workshop'];
        events['event_title'] = value.title;
        events['event_description'] = value.description;
        events['event_start_time'] = value.bufferedStartDate;
        events['event_start'] = value.bufferedStartDate.substring(0, 10);
        events['event_end_time'] = value.bufferedEndDate;
        events['event_room_name'] = value.resourceName;

        // Events array from booked
        booked_events.push(events);
      });

      // Set array values to be used later to merge
      this.$set('bookedEvents', booked_events);

      // Use lodash to combine the arrays and set
      this.$set('allEvents', (_.concat(this.cornellEvents, this.bookedEvents)));
      this.$set('showNoEventsMessage', false);
    },
    setFilterCookie(){
      Cookies.set('filter', 'Class/ Workshop');
    }
  },

}
</script>
