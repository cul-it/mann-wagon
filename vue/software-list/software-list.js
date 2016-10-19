import Vue from 'vue'

// Change Vue delimiters, to avoid conflict with Liquid
Vue.config.delimiters = ['((', '))']
Vue.config.unsafeDelimiters = ['(((', ')))']

// Vue components
import SoftwareList from './components/software-list'

// Styles
import 'components/software-list'

new Vue({
  el: '.software-list',

  components: {
    SoftwareList
  }
})

import 'sticky-sort/jquery.stickysort.min.js'
import 'sticky-sort/stickysort.css'
