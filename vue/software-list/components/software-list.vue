<template src="./software-list.html"></template>

<script>
  import { Converter } from 'csvtojson'

  export default {
    data () {
      return {
        softwareList: []
      }
    },

    created: function () {
      this.parseCsv()
    },

    // Ensure stickyheaders are applied after softwareList is populated/generated/created
    watch: {
      softwareList: 'stickyHeaders'
    },

    methods: {
      parseCsv () {
        var converter = new Converter()
        var vm = this;

        converter.fromString(softwareCsvString)

        // end_parsed is emitted after all csv rows have been processed
        converter.on('end_parsed', function (jsonObj) {
           // console.log(jsonObj)
           vm.$set('softwareList', jsonObj)
        });
      },

      // Convert software location names to working SmartMap links
      smartmapQuery (location) {
        if (location.indexOf('iMacs') !== -1 || location.indexOf('Research') !== -1) {
          return 'stone computing center'
        } else if (location.indexOf('PCs') !== -1) {
          return location.replace('PCs', '').trim().toLowerCase()
        } else if (location.indexOf('Circ') !== -1) {
          return 'circulation services'
        } else {
          return false
        }
      },

      stickyHeaders () {
        $('.software-list__table').stickySort()
      }
    }
  }
</script>
