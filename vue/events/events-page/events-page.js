var Vue = require('vue')
Vue.use(require('vue-resource'))
var VueRouter = require('vue-router')
Vue.use(VueRouter)
// create router
const router = new VueRouter({
  history: true,
  saveScrollPosition: true
})

// Styles
require('semantic-ui-css/components/icon.min.css')

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
