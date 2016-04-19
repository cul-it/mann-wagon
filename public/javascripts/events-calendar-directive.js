Vue.directive('datepicker', {
  bind: function () {
    var vm = this.vm;
    $(this.el).datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: function(date) {
        vm.getCornellEvents("date", date);
        vm.getBookedReservations("date", date);
      }
    });
  }
});
