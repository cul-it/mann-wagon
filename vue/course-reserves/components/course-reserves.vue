<template src="./course-reserves.html"></template>

<style src="components/course-reserves" lang="sass"></style>

<script>
  import ReserveItem from './reserve-item'

  import 'semantic-ui-css/components/loader.min.css'

  export default {
    components: {
      ReserveItem
    },

    data () {
      return {
        courses: [],
        items: [],
        itemsCourse: '',
        selectedCourse: ''
      }
    },

    created: function () {
      this.getMannCourses()
    },

    // Watch course list and retrieve items when a course is selected
    watch: {
      selectedCourse: 'getReserveItems'
    },

    methods: {
      getMannCourses () {
        var coursesApiUrl = 'http://mannservices.mannlib.cornell.edu/LibServices/showCourseReserveList.do?library=MANN&output=json'

        this.$http.get(coursesApiUrl).then(function (response) {
          // console.log(response.data.courseList)

          this.$set('courses', response.data.courseList)
          this.toggleLoader()
        })
      },
      getReserveItems () {
        if ( this.selectedCourse ) {
          var reservesApiBaseUrl = 'http://mannservices.mannlib.cornell.edu/LibServices/showCourseReserveItemInfo.do?output=json&courseid='
          var reservesApiUrl = reservesApiBaseUrl + this.selectedCourse

          this.toggleLoader()

          this.$http.get(reservesApiUrl).then(function (response) {
            // console.log(response.data)

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
  }
</script>
