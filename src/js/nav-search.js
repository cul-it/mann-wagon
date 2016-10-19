var navSearch = {
  onLoad: function() {
    this.bindEventListeners();
  },

  bindEventListeners: function() {
    $('.search__button').on('click', function() {
      // Focus on search input
      $('.search__term').focus();

      // Toggle search icon within input
      $('.search__input').toggleClass('left icon');

      // Toggle reveal of search input (slide in/out from top)
      $('body').toggleClass('search--engaged');

      // Toggle button state to trigger differences in rendering/style
      $(this).toggleClass('search__button--active');
    });
  }
}

$(document).ready(function() {
  navSearch.onLoad();
});
