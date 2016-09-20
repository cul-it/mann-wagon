import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

// Change Vue delimiters, to avoid conflict with Liquid
Vue.config.delimiters = ['((', '))']
Vue.config.unsafeDelimiters = ['(((', ')))']

import CourseReserves from './components/CourseReserves'

new Vue({
  el: 'body',
  components: { CourseReserves }
})
