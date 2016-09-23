import Vue from 'vue'

// Change Vue delimiters, to avoid conflict with Liquid
Vue.config.delimiters = ['((', '))']
Vue.config.unsafeDelimiters = ['(((', ')))']

// Vue components
import SoftwareList from './components/software-list'

new Vue({
  el: '.software-list',

  components: {
    SoftwareList
  }
})
