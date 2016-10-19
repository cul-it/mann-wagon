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

      stickyHeaders () {
        $('.software-list__table').stickySort()
      }
    }
  }
</script>
