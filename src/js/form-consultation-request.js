
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
        optional  : true,
        rules: [{
            type : 'regExp[^(?:(?:\\+?1\\s*(?:[.-]\\s*)?)?(?:\\(\\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\\s*\\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\\s*(?:[.-]\\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\\s*(?:[.-]\\s*)?([0-9]{4})(?:\\s*(?:#|x\\.?|ext\\.?|extension)\\s*(\\d+))?$]',
            prompt : 'Please enter a valid phone number'
        }]
      },
      program: {
        identifier  : 'content[program]',
        rules: [{
            type    : 'empty',
            prompt  : 'Please enter your program, department of major'
        }]
      },
      request: {
        identifier  : 'content[request]',
        rules: [{
            type    : 'empty',
            prompt  : 'Please provide details so we can better assist you'
        }]
      }
    },
    inline : true,
    on     : 'blur'
  })
;
