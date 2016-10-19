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

var HomePageEvents = require('./components/HomepageEvents.vue')

var App = Vue.extend({})

router.map({
  '/': {
    name: 'homepage_events',
    component: HomePageEvents
  }
})

router.start(App, 'body')
