var Vue = require('vue')
Vue.use(require('vue-resource'))

var Auth = require('./components/Auth.vue')

new Vue({
  el: '#reservation-form',
  components: {
    reservation: Auth
   }
})
