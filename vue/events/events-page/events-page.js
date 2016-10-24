var Vue = require('vue')
Vue.use(require('vue-resource'))
var VueRouter = require('vue-router')
Vue.use(VueRouter)
// create router
const router = new VueRouter({
  history: true,
  saveScrollPosition: true
})

// Change Vue delimiters, to work with liquid
Vue.config.delimiters = ['((', '))']
Vue.config.unsafeDelimiters = ['(((', ')))']

var Events = require('./components/Events.vue')

var App = Vue.extend({})
// Use eventsPath as key for the routes object
var routes = {}
routes[path_to_events_page] = {
                      name: 'events',
                      component: Events
                     }

router.map(routes)

router.start(App, 'body')

$('.ui.checkbox')
  .checkbox()
;
$(document).ready(function() {
  $('#datepicker .ui-datepicker-today a').removeClass('ui-state-active');
})
