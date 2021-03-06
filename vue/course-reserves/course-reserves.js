import Vue from 'vue'
import VueResource from 'vue-resource'

// Vue components
import ReserveItem from './components/reserve-item'

// Styles
import 'semantic-ui-css/components/loader.min.css'
import 'components/course-reserves'

Vue.use(VueResource)

// Change Vue delimiters, to avoid conflict with Liquid
Vue.config.delimiters = ['((', '))']
Vue.config.unsafeDelimiters = ['(((', ')))']

/* eslint-disable no-unused-vars */
var vm = new Vue({
  el: '.course-reserves',

  components: {
    ReserveItem
  },

  data () {
    return {
      items: [],
      itemsCourse: '',
      selectedCourse: ''
    }
  },

  // Watch course list and retrieve items when a course is selected
  watch: {
    selectedCourse: 'getReserveItems'
  },

  methods: {
    getReserveItems () {
      if (this.selectedCourse) {
        var reservesApiBaseUrl = 'https://coursereserves.library.cornell.edu/CourseReserves/showCourseReserveItemInfo?courseid='
        var reservesApiUrl = reservesApiBaseUrl + this.selectedCourse

        this.toggleLoader()

        this.$http.get(reservesApiUrl).then(function (response) {
          this.$set('itemsCourse', response.data.course)
          this.$set('items', response.data.reserveItemList)

          this.toggleLoader()
        })
      }
    },
    toggleLoader () {
      $('.course-reserves__loader').toggleClass('active')
    }
  }
})
