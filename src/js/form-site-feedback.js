import 'semantic-ui-css/components/dropdown.min.css'
import 'semantic-ui-css/components/dropdown.min.js'
import 'semantic-ui-css/components/form.min.css'
import 'semantic-ui-css/components/form.min.js'
import 'semantic-ui-css/components/message.min.css'
import 'semantic-ui-css/components/transition.min.css'
import 'semantic-ui-css/components/transition.min.js'

// Use <span> for embedded icon component
import suiA11y from 'sui-a11y-dropdown.js'

$('.ui.dropdown').dropdown({
  templates: {
    dropdown: suiA11y.dropdown
  }
})

// Validation via semantic-ui
$('.ui.form')
  .form({
    fields: {
      'content[name]': 'empty',
      'content[email]': 'email',
      'content[category]': 'empty',
      'content[url]': 'url',
      'content[feedback]': 'empty'
    },
    inline: true,
    on: 'blur'
  })
