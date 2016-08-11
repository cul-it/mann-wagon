import 'semantic-ui-css/components/dimmer.min.js';
import 'semantic-ui-css/components/dimmer.min.css';
import 'semantic-ui-css/components/modal.min.js';
import 'semantic-ui-css/components/modal.min.css';
import 'semantic-ui-css/components/transition.min.js';
import 'semantic-ui-css/components/transition.min.css';
import 'semantic-ui/dist/components/calendar.min.js'
import 'semantic-ui/dist/components/calendar.min.css'
import 'semantic-ui-css/components/popup.min.js';
import 'semantic-ui-css/components/popup.min.css';
import 'semantic-ui-css/components/form.min.css';
import 'semantic-ui-css/components/form.min.js';
import 'semantic-ui-css/components/message.min.css';
import 'semantic-ui-css/components/transition.min.css';
import 'semantic-ui-css/components/transition.min.js';
import 'semantic-ui-css/components/checkbox.min.css';
import 'semantic-ui-css/components/checkbox.min.js';

var moment = require('moment')

var bookedReserve = {
  onLoad: function() {
    this.bindEventListeners();
    this.createBookedReservation();
  },

  bindEventListeners: function() {
    var form = $('.ui.form');
    $('.js-booked-reserve').on('click', function() {
      var resourceModal = ($(this).attr('id'));
      // $('#resource-'+resourceModal)
      //   .modal('show');
      $('#resource-'+resourceModal).modal({
          autofocus: false,
          onHide: function(){
            form.form('reset');
          },
          onShow: function(){
          },
          onApprove: function() {
          }
      }).modal('show');
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
      // Colleage information
      $('#colleague-'+resourceId['bookedResourceid']).checkbox({
        onChecked: function() {
          $('#colleague-reservation-'+resourceId['bookedResourceid']).show('slow');
        },
        onUnchecked: function() {
          $('#colleague-reservation-'+resourceId['bookedResourceid']).hide('slow');
        }
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
            // Scroll to top to see success/error messages
            $('.ui.dimmer').scrollTop(0);
            var $form = $('#reservation-form-'+resourceId['bookedResourceid']),
            authData = $form.form('get values', ['username', 'password']),
            reservationData = $form.form('get values', ['fullName', 'title', 'description', 'resourceId']),
            startDateTime = moment(new Date($form.form('get value', 'eventStart'))).format('YYYY-MM-DDTHH:mm:ssZZ'),
            endDateTime = moment(new Date($form.form('get value', 'eventEnd'))).format('YYYY-MM-DDTHH:mm:ssZZ');
            reservationData['startDateTime'] = startDateTime;
            reservationData['endDateTime'] = endDateTime;

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
                  var successElement = $('#reservation-form-success-'+resourceId['bookedResourceid']);
                  var errorElement = $('#reservation-form-error-'+resourceId['bookedResourceid']);
                  $.ajax({
                      method: 'POST',
                      url: 'http://booked-dev.library.cornell.edu/Web/Services/index.php/Reservations/',
                      headers: headers,
                      data: JSON.stringify(reservationData),
                      dataType: 'json',
                      success: function (data) {
                      // success callback
                      console.log(data);
                      errorElement.hide();
                      var message = data.messsage;
                      successElement.show();
                        $(successElement).find('p').text(message);
                        $form.form('reset');
                    }, error: function(data){
                        successElement.hide();
                        var errors = JSON.parse(data.responseText)['errors'];
                        errorElement.show();
                        $.each( errors, function( key, error ) {
                          $(errorElement).find('p').text(error);
                        });
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
