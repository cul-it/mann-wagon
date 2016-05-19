// Change Vue delimiters, to work with liquid
Vue.config.delimiters = ['((', '))'];
Vue.config.unsafeDelimiters = ['(((', ')))']

var localistApiBaseUrl = 'http://events.cornell.edu/api/2/events/?type=4228&pp=100'

// New Vue instance/model
var events = new Vue({

// identifier with id="events"
    el: '#events-container',

// props, passed via locomotive metafields
    props: ['booked-username', 'booked-password'],
// data
    data: {
        // Arrays for event info
        cornellEvents: [],
        cornellEventTypes: [],
        cornellRoomNames: [],

        bookedEvents: [],
        bookedEventTypes: [],
        bookedRoomNames: [],

        allEvents: [],
        allEventTypes: [],
        allRoomNames: [],
        // Room filter param
        room: '',
        // Event type filter param
        eventType: '',
        // Booked auth headers
        headers:{},

        // Variables for adding class to selected filters
        eventSelected: '',
        roomSelected: '',
        // Sort filter key
        sortKey: 'event_start_time',
        reverse: false,
        // How many events to display
        limitList: 10,

        // Load more link text
        loadMoreText: "View More Events",

        // Group events key
        dateKey : 'event_start',

        // Search text for filtering events
        searchText: '',
        // Selected date from calendar
        dateSelected: '',
        // No events message
        showNoEventsMessage: true,
        // Array for filtered events, for no events message
        filteredEvents: []
    },
    // Anything within the ready function will run when the application loads
    ready: function() {
      // When the application loads, call methods
      this.getCornellEvents("days");
      this.bookedAuthentication();
      if((Cookies.get('filter'))){
        this.setEventTypeFilter(Cookies.get('filter'));
      }
    },
    filters: {
      // Room filter
      roomFilter : function(events, room){
        if (room == ''){
          this.loadMoreDisplay(events);
          return events;
        }
        else {
          var filterEvents = function(event) {
              return event.event_room_name == room;
          }
          // load more text display, and filtered array for no more events message
          this.loadMoreDisplay(events.filter(filterEvents));
          this.$set("filteredEvents", events.filter(filterEvents));
          return events.filter(filterEvents);
        }
      },
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
          // load more text display, and filtered array for no more events message
          this.loadMoreDisplay(events.filter(filterEvents));
          this.$set("filteredEvents", events.filter(filterEvents));
          return events.filter(filterEvents);
        }
      },
    // MomentJS filters
      momentTime: function (date) {
        return moment(date).format('h:mm a');
      },
      momentHomeTime: function (date) {
        if((moment(date).get('minutes'))){
          return moment(date).format('h:mm a');
        }
        return moment(date).format('h a');
      },
      momentDate: function (date) {
        if(date == ''){
          return;
        }
        else {
          return moment(date).format('ddd, MMM DD, YYYY');
        }
      },
      momentDateText: function (date) {
        var someday = moment(date).startOf('day');
        var today = moment().startOf('day');
        var days = someday.diff(today, "days");
        if (days == 0){
          return "Today";
        } else if (days == 1){
          return "Tomorrow";
        }
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
      // Event type array to string
      toString: function(eventTypeArray){
        return eventTypeArray.join(", ");
      },
      // Group events by day (event_start)
      groupBy: function(events, dateKey){
           return _.groupBy(events, dateKey);
      }
    },

    methods: {
      // Cornell localist events
      getCornellEvents(option, date) {
        // Get default events
        if(option == "days"){
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
      // sort list
      sortBy(sortKey){
        this.sortKey = sortKey;
      },

       // Room filter and remove filter
      setRoomFilter(room_number){
        this.room = room_number;
        this.roomSelected = room_number;
      },
      removeRoomFilter(){
        this.room = '';
        this.roomSelected = '';
      },
      // Event type filter and remove filter
      setEventTypeFilter(event_type){
       this.eventType = event_type;
       this.eventSelected = event_type;
       },
       removeEventTypeFilter(){
         this.eventType = '';
         this.eventSelected = '';
         Cookies.remove('filter');
       },

      //  Remove search filter
       removeSearchFilter(){
         this.$set("searchText", null);
       },

      //  Remove seleceted date to load default events
       removeSelectedDate(){
         this.$set("dateSelected", '');
         this.getCornellEvents("days");
         this.getBookedReservations("default");
         $("#datepicker").datepicker( "setDate", moment().format("YYYY-MM-DD") );
       },

      // Clear filters
      clearAllFilters(){
        this.room = '';
        this.eventType = '';
        this.roomSelected = '';
        this.eventSelected = '';
        this.getCornellEvents("days");
        this.getBookedReservations("default");
        this.removeSearchFilter();
        this.$set("dateSelected", '');
        $("#datepicker").datepicker( "setDate", moment().format("YYYY-MM-DD") );
        Cookies.remove('filter');
      },

      // Load more events
      loadMoreEvents() {
        var increment = this.limitList + this.limitList;
        this.limitList = increment > this.allEvents.length ? this.allEvents.length : increment;
      },

      // Custom data model from cornell events
      cornellEventsArray(data){
        var event_types = [];
        var room_names = [];
        var cornell_events = [];

        // Event properties
        _.forEach(_.map(data, 'event'), function(value){
          var events = {};
          var event_type = [];
          events['event_title'] = value.title;
          events['event_description'] = value.description_text;
          events['event_start_time'] = value.event_instances[0].event_instance.start;
          events['event_start'] = value.event_instances[0].event_instance.start.substring(0, 10);
          events['event_end_time'] = value.event_instances[0].event_instance.end;
          events['event_room_name'] = value.room_number;
          events['event_type'] = event_type;

          // Events array from localist
          cornell_events.push(events);

          // Event type filter list array
          _.forEach(_.map(value, 'event_types'), function(value){
            _.forEach(_.map(value, 'name'), function(value){
              event_types.push(value);
              event_type.push(value);
            });
          });

          // Room filter list array
          room_names.push(value.room_number);

        });
        // set array values to be used later to merge
        this.$set('cornellEventTypes', event_types);
        this.$set('cornellRoomNames', room_names)
        this.$set('cornellEvents', cornell_events);
      },

      // Custom data model from booked events
      bookedEventsArray(data){
        var booked_events = [];
        var event_types = [];
        var room_names = [];

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

          // Event type filter list array
          room_names.push(value.resourceName);

          // Room filter list array
          event_types.push('Class/ Workshop');

        });

        // Set array values to be used later to merge
        this.$set('bookedEventTypes', event_types);
        this.$set('bookedRoomNames', room_names)
        this.$set('bookedEvents', booked_events);

        // Use lodash to combine the arrays and set
        this.$set('allEvents', (_.concat(this.cornellEvents, this.bookedEvents)));
        this.$set('allEventTypes', (_.union(this.cornellEventTypes, this.bookedEventTypes)));
        this.$set('allRoomNames', (_.union(this.cornellRoomNames, this.bookedRoomNames)));
        this.loadMoreDisplay(this.allEvents);
        this.$set('showNoEventsMessage', false);
        this.$set('filteredEvents', this.allEvents);
      },
      // Text for load more link
      loadMoreDisplay(events){
        if(events.length <= this.limitList){
          this.$set('loadMoreText', '')
        } else {
          this.$set('loadMoreText', 'View more events')
        }
      },
      setFilterCookie(){
        Cookies.set('filter', 'Class/ Workshop');
      }
    }

})
if(window.location.pathname == '/news-events/events'){
  $(window).unload(function() {
    Cookies.remove('filter');
  });

}

// Define component for read more description feature
var Description = Vue.extend({
  // props, passed via custom element %description
  props: ['descriptionText', 'wordLimit'],
  data: function () {
    return {
      // limit description to number of words
       descriptionLimit: this.wordLimit,
      // read more/less links
       readMoreLink: true,
       readLessLink: false,
      //  Array for words in description
       inputWords: _.split(this.descriptionText, /\s+/)
      }
  },
  ready: function() {
  },
  filters: {
    limitDescriptionFilter: function(description, wordLimit) {
      if (this.inputWords.length > wordLimit) {
          description = _.join(_.slice(this.inputWords, 0, wordLimit), ' ');
      }
      // Hide read more link if description <= description word limit
      else if (this.inputWords.length <= wordLimit) {
        this.readMoreLink = false;
      };
      return(description);
    }

  },
  methods: {
    showMoreDescription(){
      // set description limit to the number of words
      this.descriptionLimit = this.inputWords.length;
      // hide/show read more/less link
      this.readMoreLink = false;
      this.readLessLink = true;
    },
    showLessDescription(){
      // Reset description limit
      this.descriptionLimit = this.wordLimit;
      // hide/show read more/less link
      this.readMoreLink = true;
      this.readLessLink = false;
    }
  },
  template: '<p class="description" > ((descriptionText | limitDescriptionFilter descriptionLimit)) <a href="javascript:;" v-on:click="showMoreDescription()" v-show="readMoreLink"> ....Read More</a><a href="javascript:;" v-on:click="showLessDescription()" v-show="readLessLink"> Read Less </a></p>'
})

// register
Vue.component('description', Description)
