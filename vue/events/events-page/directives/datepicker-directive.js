var Vue = require('vue')
require('jquery-ui/datepicker')

Vue.directive('datepicker', {
  bind: function () {
    var vm = this.vm
    $(this.el).datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: function (date) {
        vm.getCornellEvents('date', date)
        vm.getMannServicesEvents('date', date)
        vm.getR25Events('date', date)
        vm.showNoEventsMessage = true
        vm.allEvents = []
        vm.dateSelected = date
      }
    })
  }
})
