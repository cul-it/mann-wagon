import Vue from 'vue'
import VueResource from 'vue-resource'

// Vue components
import LiveOccupancy from './components/live-occupancy'

Vue.use(VueResource)

// Change Vue delimiters, to avoid conflict with Liquid
Vue.config.delimiters = ['((', '))']
Vue.config.unsafeDelimiters = ['(((', ')))']

/* eslint-disable no-unused-vars */
var vm = new Vue({
  el: '.quiet-study__live-occupancy',

  components: {
    LiveOccupancy
  }
})
