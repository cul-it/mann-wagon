import 'semantic-ui-css/components/dropdown.min.css';
// import 'semantic-ui-css/components/dropdown.min.js';
import 'semantic-ui-css/components/form.min.css';
import 'semantic-ui-css/components/form.min.js';
import 'semantic-ui-css/components/icon.min.css';
import 'semantic-ui-css/components/message.min.css';
import 'semantic-ui-css/components/transition.min.css';
import 'semantic-ui-css/components/transition.min.js';

// Validation via semantic-ui
$('.ui.form')
  .form({
    fields: {
      'content[name]'      : 'empty',
      'content[email]'     : 'email',
      'content[category]'  : 'empty',
      'content[url]'       : 'url',
      'content[feedback]'  : 'empty'
    },
    inline : true,
    on     : 'blur'
  })
;

// Would like to use semantic-ui dropdown component but mobile usability is awful
// -- limits the number of displayed options to 3 and scrolling is not obvious
// -- this is configurable via a LESS variable
// -- https://github.com/Semantic-Org/Semantic-UI/issues/3376

// $('select.dropdown')
//   .dropdown()
// ;
