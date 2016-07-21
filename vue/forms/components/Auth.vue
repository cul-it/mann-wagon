<script>

export default {
  template: require('../templates/reservation-template.html'),
  props: ['booked-username', 'booked-password'],
  data () {
    return {
      headers: {},
      fullName: '',
      eventName: '',
      eventDescription: '',
      eventStart: '',
      eventEnd: '',
      request: {"accessories":[],"customAttributes":[],"description":"","endDateTime":"","invitees":[],"participants":[],"recurrenceRule":{"type":"none","interval":0,"monthlyType":"null","weekdays":[],"repeatTerminationDate":""},"resourceId":3,
      "resources":[],"startDateTime":"","title":"","userId":6,"startReminder":{"value":0,"interval":"null"},"endReminder":null},
      user: {"password":"unencrypted password","language":"en_us","firstName":"first","lastName":"last","emailAddress":"email@address.com","userName":"email@address.com","timezone":"America\/Chicago","phone":"123-456-7989","organization":"organization","position":"position","customAttributes":[],"groups":[]}
    }
  },
  // Anything within the ready function will run when the application loads
  ready: function () {
    // When the application loads, call methods
    this.bookedAuthentication()
  },
  methods: {
    // Authenticate booked
    bookedAuthentication () {
      this.$http(
        {
          url: 'http://booked-dev.library.cornell.edu/Web/Services/index.php/Authentication/Authenticate',
          method: 'POST',
          data: JSON.stringify({username: this.bookedUsername, password: this.bookedPassword}),
          dataType: 'json'
        }).then(function (data) {
          // success callback
          if (data.data.isAuthenticated) {
            this.$set('headers', {'X-Booked-SessionToken': data.data.sessionToken, 'X-Booked-UserId': data.data.userId})
            // this.createBookedReservation()
            this.getUser()
          } else {
            console.log(data.message)
          }
        }, function (response) {
          // error callback
        })
    },
    getUser () {
      var bookedApiUrl = 'http://booked-dev.library.cornell.edu/Web/Services/index.php/Users/?email=.poduska@cornell.edu'
      this.$http(
        {
          method: 'GET',
          url: bookedApiUrl,
          headers: this.headers,
          // dataType: 'json',
          // data: JSON.stringify(this.user)
        })
        .then (function (data) {
          console.log(data.data.users.length)
          if (data.data.users.length === 1) {
            // this.createBookedReservation (data.data.users[0].id)
          }
        })
    },
    createGuestUser () {
      var bookedApiUrl = 'http://booked-dev.library.cornell.edu/Web/Services/index.php/Users/'
      this.$http(
        {
          method: 'POST',
          url: bookedApiUrl,
          headers: this.headers,
          dataType: 'json',
          data: JSON.stringify(this.user)
        })
        .then (function (data) {
          console.log(data.data.userId)
        })
    },
    createBookedReservation () {
      var bookedApiUrl = 'http://booked-dev.library.cornell.edu/Web/Services/index.php/Reservations/'
      console.log(this.eventName, this.eventDescription, this.eventStart, this.eventEnd)
      this.$http(
        {
          method: 'POST',
          url: bookedApiUrl,
          headers: this.headers,
          dataType: 'json',
          data: JSON.stringify(
            {"accessories":[],"customAttributes":[],"description":this.eventDescription,"endDateTime":this.eventEnd+":00-0400","invitees":[],"participants":[],"recurrenceRule":{"type":"none","interval":0,"monthlyType":"null","weekdays":[],"repeatTerminationDate":""},"resourceId":3,
            "resources":[],"startDateTime":this.eventStart+":00-0400","title":this.eventName,"userId":this.userId,"startReminder":{"value":0,"interval":"null"},"endReminder":null}
          )
        })
        .then (function (data) {
          console.log(data)
        })
    }
  }
}
</script>
