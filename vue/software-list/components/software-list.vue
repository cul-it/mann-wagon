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
      }
    }
  }
</script>
