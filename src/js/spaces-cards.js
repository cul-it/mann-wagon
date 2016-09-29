var spacesCards = {
  onLoad: function() {
    this.bindEventListeners();
  },

  bindEventListeners: function() {
    // Make card's content div a clickable link
    $('.js-spacefinder-content').on('click', function() {
      window.location.href = $(this).data('link');
    });

    // But prevent that linkable content div if a nested anchor is clicked
    // -- i.e. Reserve button, circ desk map it, hours, etc
    $('.js-spacefinder-link').on('click', function(event) {
      event.stopPropagation();
    });
  }
}

$(document).ready(function() {
  spacesCards.onLoad();
});
