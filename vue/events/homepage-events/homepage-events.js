var Vue = require('vue')
Vue.use(require('vue-resource'));

// Change Vue delimiters, to work with liquid
Vue.config.delimiters = ['((', '))'];
Vue.config.unsafeDelimiters = ['(((', ')))']

// require a *.vue component
var HomePageEvents = require('./components/HomepageEvents.vue')


// mount a root Vue instance
new Vue({
  el: 'body',
  components: {
    // include the required component
    // in the options
    events: HomePageEvents
  }
})
