import 'semantic-ui-css/components/dimmer.min.js';
import 'semantic-ui-css/components/dimmer.min.css';
import 'semantic-ui-css/components/modal.min.js';
import 'semantic-ui-css/components/modal.min.css';
import 'semantic-ui-css/components/transition.min.js';
import 'semantic-ui-css/components/transition.min.css';
import 'semantic-ui/dist/components/calendar.min.js'
import 'semantic-ui/dist/components/calendar.min.css'
import 'semantic-ui/dist/components/popup.min.js'
import 'semantic-ui/dist/components/popup.min.css'
import 'semantic-ui-css/components/form.min.css';
import 'semantic-ui-css/components/form.min.js';
var moment = require('moment')

var bookedReserve = {
  onLoad: function() {
    this.bindEventListeners();
    this.createBookedReservation();
  },

  bindEventListeners: function() {
    $('.js-booked-reserve').on('click', function() {
      var resourceModal = ($(this).attr('id'));
      $('#resource-'+resourceModal)
        .modal('show');
    });
  },
  createBookedReservation: function() {
    $('.js-booked-reserve').each(function(){
      var resourceModal = ($(this).attr('id'));
      var resourceId = $('#resource-'+resourceModal).data();
      // Semantic-UI calendar datetime range
      $('#rangestart'+resourceId['bookedResourceid']).calendar({
        endCalendar: $('#rangeend'+resourceId['bookedResourceid'])
      });
      $('#rangeend'+resourceId['bookedResourceid']).calendar({
        startCalendar: $('#rangestart'+resourceId['bookedResourceid'])
      });

    // Semantic-UI validation
      $('#reservation-form-'+resourceId['bookedResourceid'])
        .form({
          fields: {
            'fullName'      : 'empty',
            'title'     : 'empty',
            'description'  : 'empty',
            'eventStart'       : 'empty',
            'eventEnd'  : 'empty'
          },
          inline : true,
          on     : 'blur',
          onSuccess : function(){
            var $form = $('#reservation-form-'+resourceId['bookedResourceid']),
            authData = $form.form('get values', ['username', 'password']),
            reservationData = $form.form('get values', ['fullName', 'title', 'description', 'resourceId']),
            startDateTime = moment(new Date($form.form('get value', 'eventStart'))).format('YYYY-MM-DDTHH:mm:ssZZ'),
            endDateTime = moment(new Date($form.form('get value', 'eventEnd'))).format('YYYY-MM-DDTHH:mm:ssZZ');
            reservationData["startDateTime"] = startDateTime;
            reservationData["endDateTime"] = endDateTime;

            // Authenticate booked
            var headers = '';
            $.ajax({
                url: 'http://booked-dev.library.cornell.edu/Web/Services/index.php/Authentication/Authenticate',
                method: 'POST',
                data: JSON.stringify(authData),
                dataType: 'json',
                success: function (data) {
                // success callback
                if (data.isAuthenticated) {
                  headers = {'X-Booked-SessionToken': data.sessionToken, 'X-Booked-UserId': data.userId};
                  console.log(reservationData);
                  // Create reservation
                  $.ajax({
                      method: 'POST',
                      url: 'http://booked-dev.library.cornell.edu/Web/Services/index.php/Reservations/',
                      headers: headers,
                      data: JSON.stringify(reservationData),
                      dataType: 'json',
                      success: function (data) {
                      // success callback
                      console.log(data);
                    }, error: function(data){
                      console.log(data);
                    }
                  });
                } else {
                  console.log(data.message)
                }
              }, error: function (data) {
                console.log(data);
              }
            });
          }

      });
    });
  }
}

$(document).ready(function() {
  bookedReserve.onLoad();
});
