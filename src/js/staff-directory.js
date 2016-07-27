import 'semantic-ui-css/components/dropdown.min.css';
import 'semantic-ui-css/components/dropdown.min.js';
import 'semantic-ui-css/components/transition.min.css';
import 'semantic-ui-css/components/transition.min.js';

$('.ui.dropdown').dropdown();

$('#sort_by').change(function () {
  sortCards($(this).val());
});

$('#filter_by').change(function () {
  filterCards('division', $(this).val());
});

//sort cards - last name, first name or division
function sortCards(field) {

  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  var $wrapper = $('#staff-cards');

  $wrapper.find('.card').sort(function (a, b) {
      var valueA = a.dataset[field];
      var valueB = b.dataset[field];
      if (valueA < valueB) {
        return -1;
      }
      if (valueA > valueB) {
        return 1;
      }
      //values must be equal
      return 0;
  }).appendTo( $wrapper );
}

function filterCards(field, value) {
  var $wrapper = $('#staff-cards');
  if (value == 'all') {
    $wrapper.find('.card').css('display', 'block');
  } else {
    //hide all
    $wrapper.find('.card').hide();
    //show division selected
    $wrapper.find('.card').filter('[data-'+ field + '="' + value + '"]').show();
  }
}