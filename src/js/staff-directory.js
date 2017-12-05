import 'semantic-ui-css/components/dropdown.min.css'
import 'semantic-ui-css/components/dropdown.min.js'
import 'semantic-ui-css/components/transition.min.css'
import 'semantic-ui-css/components/transition.min.js'

$('#staff-table').css('display', 'none')

$('.ui.dropdown').dropdown()

$('#sort').change(function () {
  sortStaff($(this).val())
})

$('#division').change(function () {
  window.location.replace($(this).val())
})

$('#view > button').on('click', function () {
  $('.staff-directory').hide()
  var layoutSelected = $(this).val()
  $('#staff-' + layoutSelected).show()
})

// sort cards - last name, first name or division
function sortStaff (field) {
  // sort cards
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  $('.staff-directory').each(function () {
    var $wrapper = $(this)
    // console.log($wrapper)
    $wrapper.find('.employee').sort(function (a, b) {
      var valueA = a.dataset[field]
      var valueB = b.dataset[field]
      if (valueA < valueB) {
        return -1
      }
      if (valueA > valueB) {
        return 1
      }
      // values must be equal
      return 0
    }).appendTo($wrapper)
  })

  // sort table
  // $wrapper = $('#staff-table');

  // $wrapper.find('.employee').sort(function (a, b) {
  //     var valueA = a.dataset[field];
  //     var valueB = b.dataset[field];
  //     if (valueA < valueB) {
  //       return -1;
  //     }
  //     if (valueA > valueB) {
  //       return 1;
  //     }
  //     //values must be equal
  //     return 0;
  // }).appendTo( $wrapper );
}
