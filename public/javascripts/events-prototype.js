// app.js

Vue.config.delimiters = ['((', '))']; // normal output

var localistApiUrl = 'http://events.cornell.edu/api/2/events/?type=4228&days=28&pp=100'

// New Vue instance/model
var events = new Vue({
// identifier with id="events"
    el: '#events-container',

// properties
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
        room_selected: ''
    },
    // Anything within the ready function will run when the application loads
    ready: function() {
      // When the application loads, we want to call the method that initializes
      // some data
      this.getCornellEvents();
      this.bookedAuthentication();
    },
    filters: {
      roomName : function(events, room){
        if (room == ''){
          return events;
        }
        else {
          return events.filter((event) => event.event_room_name == room);
        }
      },
      eventType : function(events, event_type){
        if (event_type == ''){
          return events;
        }
        else {
          return events.filter((event) => event.event_type.indexOf(event_type) > -1);
        }
      }

    },

    methods: {
      getCornellEvents() {
        this.$http.get(localistApiUrl).then(function(response) {
          // Create custom data model
          this.cornellEventsArray(response.data.events);
        });
      },
      // Authenticate booked
      bookedAuthentication(){
        this.$http(
          {
          url: 'http://booked-dev.library.cornell.edu/Web/Services/index.php/Authentication/Authenticate',
          method: 'POST',
          data: JSON.stringify({username: 'admin', password: 'password'}),
          dataType: "json"
        }).then(function (data) {
            // success callback
            if (data.data.isAuthenticated)
						{
							this.$set('headers', {"X-Booked-SessionToken": data.data.sessionToken, "X-Booked-UserId": data.data.userId});
              this.getBookedReservations();
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
      getBookedReservations(){
        this.$http(
                {
                    type: "GET",
                    url: "http://booked-dev.library.cornell.edu/Web/Services/index.php/Reservations/?resourceId=3",
                    headers: this.headers,
                    dataType: "json"
                })
                .then(function (response)
                {
                  // Create custom data model
                  this.bookedEventsArray(response.data.reservations);
                });
      },

       // Room filter
       setRoomFilter(room_number){
        this.room = room_number;
        this.room_selected = room_number;
        },

        setEventTypeFilter(event_type){
         this.event_type = event_type;
         this.event_selected = event_type;
         },
        // Clear filters
        clearAllFilters(){
          this.room = '';
          this.event_type = '';
          this.room_selected = '';
          this.event_selected = '';
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
            events['event_start_time'] = value.event_instances[0].event_instance.start;
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
          events['event_type'] = ['Workshop'];
          events['event_title'] = value.title;
          events['event_description'] = value.description;
          events['event_start_time'] = value.bufferedStartDate;
          events['event_end_time'] = value.bufferedEndDate;
          events['event_room_name'] = value.resourceName;
          booked_events.push(events);
          if (room_names.indexOf(value.resourceName) == -1) {
            room_names.push(value.resourceName);
          }
          if (event_types.indexOf('Workshop') == -1) {
            event_types.push('Workshop')
          }


        });
        // set array values to be used later to merge
        this.$set('bookedEventTypes', event_types);
        this.$set('bookedRoomNames', room_names)
        this.$set('bookedEvents', booked_events);

        // Use merge to combine the arrays and set
        this.$set('allEvents', ($.merge(this.bookedEvents, this.cornellEvents)));
        this.$set('allEventTypes', ($.merge(this.cornellEventTypes, this.bookedEventTypes)));
        this.$set('allRoomNames', ($.unique($.merge(this.cornellRoomNames, this.bookedRoomNames))));
      }
    }

})
