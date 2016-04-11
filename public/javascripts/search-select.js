$('.ui.dropdown')
  .dropdown()
;

// Set form action for search (catalog or website)
$('.js-search-target').click(function() {
  $('.search').attr('action', $(this).data("action"));
});
