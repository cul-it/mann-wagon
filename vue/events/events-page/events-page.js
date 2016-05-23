var Vue = require('vue')
Vue.use(require('vue-resource'))
// Change Vue delimiters, to work with liquid
Vue.config.delimiters = ['((', '))']
Vue.config.unsafeDelimiters = ['(((', ')))']

var Events = require('./components/Events.vue')

new Vue({
  el: 'body',
  components: { Events }
})
