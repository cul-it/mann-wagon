// Change Vue delimiters, to work with liquid
Vue.config.delimiters = ['((', '))'];

var localistApiBaseUrl = 'http://events.cornell.edu/api/2/events/?type=4228&pp=100'
// http://events.cornell.edu/api/2/events/search?search='+date+'&pp=100'
// New Vue instance/model
var events = new Vue({
// identifier with id="events"
    el: '#events-container',

// props
    props: ['booked-username', 'booked-password'],
// data
    data: {
        allEvents: [],
        cornellEvents: [],
        bookedEvents: [],
        room: '',
        event_type: '',
        headers:{},
        cornellEventTypes: [],
        cornellRoomNames: [],
        bookedEventTypes: [],
        bookedRoomNames: [],
        allEventTypes: [],
        allRoomNames: [],
        event_selected: '',
        room_selected: '',
        sortKey: 'event_start_time',
        reverse: false,
        list_limit: 10,
        load_more_text: "Load More Events",
        dateKey : 'event_start_time',
        searchText: ''
    },
    // Anything within the ready function will run when the application loads
    ready: function() {
      // When the application loads, we want to call the method that initializes
      // some data
      this.getCornellEvents("days");
      this.bookedAuthentication();
    },
    filters: {
      // room filter
      roomName : function(events, room){
        if (room == ''){
          this.loadMoreDisplay(events);
          return events;
        }
        else {
          this.loadMoreDisplay(events.filter((event) => event.event_room_name == room));
          return events.filter((event) => event.event_room_name == room);
        }
      },
      // event filter
      eventType : function(events, event_type){
        if (event_type == ''){
          this.loadMoreDisplay(events);
          return events;
        }
        else {
          this.loadMoreDisplay((event) => event.event_type.indexOf(event_type) > -1);
          return events.filter((event) => event.event_type.indexOf(event_type) > -1);
        }
      },
    // momentJS filters
      momentTime: function (date) {
        return moment(date).format('h:mm a');
      },
      momentDate: function (date) {
        return moment(date).format('ddd, MMM Do, YYYY');
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
      // limit events list
      limitList: function(events, list_limit) {
        return events.slice(0, Number(list_limit))
      },
      // event type array to string
      toString: function(eventTypeArray){
        return eventTypeArray.join(", ");
      },
      groupBy: function(events, dateKey){
           return _.groupBy(events, dateKey);
      }
    },

    methods: {
      moment(){
        return moment();
      },
      // Cornell localist events
      getCornellEvents(option, date) {
        if(option == "days"){
          this.$http.get(localistApiBaseUrl+"&days=28").then(function(response) {
            // Create custom data model
            this.cornellEventsArray(response.data.events);
          });
        }
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
        if(option == "default"){
          bookedApiUrl = "http://booked-dev.library.cornell.edu/Web/Services/index.php/Reservations/?resourceId=3";

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
          this.room_selected = room_number;
        },
        removeRoomFilter(){
          this.room = '';
          this.room_selected = '';
        },
        // Event type filter and remove filter
        setEventTypeFilter(event_type){
         this.event_type = event_type;
         this.event_selected = event_type;
         },
         removeEventTypeFilter(){
           this.event_type = '';
           this.event_selected = '';
         },

        // Clear filters
        clearAllFilters(){
          this.room = '';
          this.event_type = '';
          this.room_selected = '';
          this.event_selected = '';
          this.getCornellEvents("days");
          this.getBookedReservations("default");
        },
        // Load more events
        loadMoreEvents() {
          var increment = this.list_limit + 10;
          this.list_limit = increment > this.allEvents.length ? this.allEvents.length : increment;
          if (this.list_limit == this.allEvents.length){
            this.$set("load_more_text", "No more events");
          }
        },

      // Custom data model from cornell events
      cornellEventsArray(data){
        var event_types = [];
        var room_names = [];
        var cornell_events = [];
        $.each(data, function(key, value) {
          var events = {};
          $.each(value, function(key, value) {
            // console.log(value.filters.event_types);
            var eventTypes = [];
            $.each(value.filters, function(key, value){
              if(key == "event_types"){
                $.each(value, function(key, value) {
                  eventTypes.push(value.name);
                });
              }
            });
            events['event_type'] = eventTypes;
            events['event_title'] = value.title;
            events['event_description'] = value.description_text;
            events['event_start_time'] = value.event_instances[0].event_instance.start.substring(0, 10);
            events['event_end_time'] = value.event_instances[0].event_instance.end;
            events['event_room_name'] = value.room_number;
            cornell_events.push(events);
            $.each(value, function(key, value) {
                if(key == 'filters') {
                  $.each(value, function(key, value) {
                   if (key == 'event_types'){
                      $.each(value, function(key, value) {
                        $.each(value, function(key, value) {
                          if (key == "name") {
                            if (event_types.indexOf(value) == -1) {
                              event_types.push(value);
                            }
                          }
                        });
                      });
                    }
                  });
                }
                else if (key == 'room_number'){
                  if (room_names.indexOf(value) == -1) {
                    room_names.push(value);
                  }
                }
            });

          });
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
        $.each(data, function(key, value) {
          var events = {};
          events['event_type'] = ['Class/ Workshop'];
          events['event_title'] = value.title;
          events['event_description'] = value.description;
          events['event_start_time'] = value.bufferedStartDate.substring(0, 10);
          events['event_end_time'] = value.bufferedEndDate;
          events['event_room_name'] = value.resourceName;
          booked_events.push(events);
          if (room_names.indexOf(value.resourceName) == -1) {
            room_names.push(value.resourceName);
          }
          if (event_types.indexOf('Class/ Workshop') == -1) {
            event_types.push('Class/ Workshop')
          }


        });
        // set array values to be used later to merge
        this.$set('bookedEventTypes', event_types);
        this.$set('bookedRoomNames', room_names)
        this.$set('bookedEvents', booked_events);

        // Use merge to combine the arrays and set
        this.$set('allEvents', ($.merge(this.cornellEvents, this.bookedEvents)));
        this.$set('allEventTypes', ($.unique($.merge(this.cornellEventTypes, this.bookedEventTypes))));
        this.$set('allRoomNames', ($.unique($.merge(this.cornellRoomNames, this.bookedRoomNames))));
        this.loadMoreDisplay(this.allEvents);
      },
      loadMoreDisplay(events){
        if(events.length <= 10){
          this.$set('load_more_text', 'No more events')
        } else {
          this.$set('load_more_text', 'View more events')
        }
      }
    }

})
