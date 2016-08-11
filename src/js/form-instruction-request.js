// SUI calendar component via mdehoog fork until PR is merged
// -- https://github.com/mdehoog/Semantic-UI/tree/calendar-dist
// -- https://github.com/Semantic-Org/Semantic-UI/pull/3256#issuecomment-224113834
import 'semantic-ui-calendar/calendar.min.js';
import 'semantic-ui-calendar/calendar.min.css';

import 'semantic-ui-css/components/dropdown.min.css';
import 'semantic-ui-css/components/dropdown.min.js';
import 'semantic-ui-css/components/form.min.css';
import 'semantic-ui-css/components/form.min.js';
import 'semantic-ui-css/components/message.min.css';
import 'semantic-ui-css/components/popup.min.css';
import 'semantic-ui-css/components/popup.min.js';
import 'semantic-ui-css/components/transition.min.css';
import 'semantic-ui-css/components/transition.min.js';

$('.date-selector').calendar({
  type: 'date'
});

// FEW ITEMS TO NOTE
// i see nick's comment on the feedback form that he doesn't like this for mobile
// probably needs to be reworked, but i do like the multiple select that comes with semantic-ui
// another caveat - because we're not using the "semantic-ui way" of using font-awesome icons:
// the multiple select doesn't show the "x" to remove an item
// the calendar doesn't show the < > (previous/next) icons on month view
$('.ui.dropdown')
  .dropdown()
;

// Validation via semantic-ui
$('.ui.form')
  .form({
    inline : true,
    on     : 'blur',
    fields: {
      name: {
        identifier  : 'content[name]',
        rules: [{
          type    : 'empty',
          prompt  : 'Please enter your name'
        }]
      },
      email: {
        identifier  : 'content[email]',
        rules: [{
            type    : 'email',
            prompt  : 'Please enter a valid e-mail'
        }]
      },
      phone: {
        identifier  : 'content[phone]',
        rules: [{
            type : 'regExp[^(?:(?:\\+?1\\s*(?:[.-]\\s*)?)?(?:\\(\\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\\s*\\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\\s*(?:[.-]\\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\\s*(?:[.-]\\s*)?([0-9]{4})(?:\\s*(?:#|x\\.?|ext\\.?|extension)\\s*(\\d+))?$]',
            prompt : 'Please enter a valid phone number'
        }]
      },
      // for some reason on the "on blur" event doesn't seem to trigger this validation rule
      // only working on form submit
      type_of_instruction: {
        identifier  : 'content[type_of_instruction]',
        rules: [{
            type    : 'empty',
            prompt  : 'Please select at least one type of instruction'
        }]
      },
      // would like to use moment and a custom inline function for date validation
      // don't see a way to do this using semantic ui form validation
      // date_first: {
      //   identifier  : 'content[date_first]',
      //   optional  : true,
      //   rules: [{
      //       type    : 'regExp[]'
      //       prompt  : 'Please enter a valid date'
      //   }]
      // },
      // date_second: {
      //   identifier  : 'content[date_second]',
      //   optional  : true,
      //   rules: [{
      //       type    : 'regExp[]'
      //       prompt  : 'Please enter a valid date'
      //   }]
      // },
      // date_third: {
      //   identifier  : 'content[date_third]',
      //   optional  : true,
      //   rules: [{
      //       type    : 'regExp[]'
      //       prompt  : 'Please enter a valid date'
      //   }]
      // }
    }
  })
;
