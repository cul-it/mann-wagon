var Vue = require('vue')
require('jquery-ui/datepicker')

Vue.directive('datepicker', {
  bind: function () {
    var vm = this.vm
    $(this.el).datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: function (date) {
        vm.localistReservations = vm.libcalReservations = vm.r25Reservations = []
        vm.getCornellEvents('date', date)
        vm.getLibCalEvents('date', date)
        // vm.getR25Events('date', date)
        vm.showNoEventsMessage = true
        vm.allEvents = []
        vm.dateSelected = date
      }
    })
  }
})
