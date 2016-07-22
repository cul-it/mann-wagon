import 'semantic-ui-css/components/dropdown.min.css';
import 'semantic-ui-css/components/dropdown.js';
import 'semantic-ui-css/components/form.min.css';
import 'semantic-ui-css/components/message.min.css';
import 'semantic-ui-css/components/transition.min.css';
import 'semantic-ui-css/components/transition.js';

var siteFeedback = {
  onLoad: function() {
    this.urlField = $('.mann-form__url');
    this.nabReferer();
  },

  nabReferer: function() {
    // If url field is empty, inject page referer
    if (siteFeedback.urlField.val() == '') {
      $('.mann-form__url').val(document.referrer);
    }
  }
}

$(document).ready(function() {
  siteFeedback.onLoad();
});

// Would like to use semantic-ui dropdown component but mobile usability is awful
// -- limits the number of displayed options to 3 and scrolling is not obvious
// -- this is configurable via a LESS variable
// -- https://github.com/Semantic-Org/Semantic-UI/issues/3376

// $('select.dropdown')
//   .dropdown()
// ;
