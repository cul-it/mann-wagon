import Vue from 'vue'

// Vue components
import SoftwareList from './components/software-list'

import 'sticky-sort/jquery.stickysort.min.js'
import 'sticky-sort/stickysort.css'

// Styles
import 'components/software-list'

// Change Vue delimiters, to avoid conflict with Liquid
Vue.config.delimiters = ['((', '))']
Vue.config.unsafeDelimiters = ['(((', ')))']

/* eslint-disable no-unused-vars */
var vm = new Vue({
  el: '.software-list',

  components: {
    SoftwareList
  }
})
