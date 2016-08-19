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

var App = Vue.extend({
})

router.map({
  '/news-events/events': {
    component: Events
  },
  'news-events/events?eventId': {
    component: Event
  }
})

router.start(App, 'body')
