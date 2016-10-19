$('.ui.dropdown')
  .dropdown()
;

// Set form action & target for search (catalog or website)
$('.js-search-target').click(function() {
  $('.search').attr({
    action: $(this).data("action"),
    target: $(this).data("target")
  });

  // If a query string has already been entered, GO!
  if ( $('.search__term').val() ) {
    $('.search').submit();
  }
});
