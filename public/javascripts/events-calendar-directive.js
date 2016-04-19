Vue.directive('datepicker', {
  bind: function () {
    var vm = this.vm;
    var key = this.expression;
    var dateToday = '';
    $(this.el).datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: function(date, inst) {
        vm.getCornellEvents("date", date);
        vm.getBookedReservations("date", date);
      }
    });
  }
});
