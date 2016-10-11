// SUI calendar component via mdehoog fork until PR is merged
// -- https://github.com/mdehoog/Semantic-UI/tree/calendar-dist
// -- https://github.com/Semantic-Org/Semantic-UI/pull/3256#issuecomment-224113834
import 'semantic-ui-calendar/calendar.min.js';
import 'semantic-ui-calendar/calendar.min.css';

import 'semantic-ui-css/components/checkbox.min.css';
import 'semantic-ui-css/components/checkbox.min.js';
import 'semantic-ui-css/components/dropdown.min.css';
import 'semantic-ui-css/components/dropdown.min.js';
import 'semantic-ui-css/components/form.min.css';
import 'semantic-ui-css/components/form.min.js';
import 'semantic-ui-css/components/header.min.css';
import 'semantic-ui-css/components/icon.min.css';
import 'semantic-ui-css/components/message.min.css';
import 'semantic-ui-css/components/popup.min.css';
import 'semantic-ui-css/components/popup.min.js';
import 'semantic-ui-css/components/transition.min.css';
import 'semantic-ui-css/components/transition.min.js';

$('.ui.date-selector').calendar({
  type: 'date',
});

$('.ui.checkbox')
  .checkbox()
;

$('.ui.dropdown')
  .dropdown()
;

// Would like to adjust the default prompt for the empty rule, but unclear how
// $fn.form.settings.prompt = function(rule, field) {
//   empty: 'Please enter your {name}'
// }

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
      department: {
        identifier  : 'content[department]',
        rules: [{
          type    : 'empty',
          prompt  : 'Please enter your department name'
        }]
      },
      affiliation: {
        identifier  : 'content[affiliation]',
        rules: [{
          type    : 'empty',
          prompt  : 'Please select your affiliation'
        }]
      },
      title: {
        identifier  : 'content[title]',
        rules: [{
          type    : 'empty',
          prompt  : 'Please enter the software title'
        }]
      },
      company: {
        identifier  : 'content[company]',
        rules: [{
          type    : 'empty',
          prompt  : 'Please enter the software company name'
        }]
      },
      url: {
        identifier  : 'content[url]',
        rules: [{
          type    : 'empty',
          prompt  : 'Please enter the URL for software website'
        }]
      },
      platform: {
        identifier  : 'content[platform]',
        rules: [{
          type    : 'empty',
          prompt  : 'Please select the platform where the software should be installed'
        }]
      },
      date: {
        identifier  : 'content[date]',
        rules: [{
          type    : 'empty',
          prompt  : 'Please select a preferred date for the software installation'
        }]
      },
      delivery: {
        identifier  : 'content[delivery]',
        rules: [{
          type    : 'empty',
          prompt  : 'Please select the delivery method'
        }]
      },
      location: {
        identifier  : 'content[location]',
        rules: [{
          type    : 'empty',
          prompt  : 'Please select the location where the software should be installed'
        }]
      }
    }
  })
;
