var Vue = require('vue')
Vue.use(require('vue-resource'));

// Change Vue delimiters, to work with liquid
Vue.config.delimiters = ['((', '))'];
Vue.config.unsafeDelimiters = ['(((', ')))']

// require a *.vue component
var Events = require('./components/Events.vue')


// mount a root Vue instance
new Vue({
  el: 'body',
  components: {
    // include the required component
    events: Events
  }
})
