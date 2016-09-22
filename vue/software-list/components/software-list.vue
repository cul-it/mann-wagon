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
      this.getCsv()
    },

    methods: {
      getCsv () {
        var csvUrl = 'https://raw.githubusercontent.com/cul-it/mann-softwarelist/master/csv/softwarelist.csv?token='
        var converter = new Converter()
        var vm = this;

        this.$http.get(csvUrl).then(function (response) {
          // console.log(response)
          converter.fromString(response.data)
        })

        // end_parsed is emitted after all csv rows have been processed
        converter.on('end_parsed', function (jsonObj) {
           // console.log(jsonObj)
           vm.$set('softwareList', jsonObj)
        });

        // record_parsed is emitted after each csv row is processed
        // converter.on('record_parsed', function (jsonObj) {
        //    console.log(jsonObj)
        // });
      }
    }
  }
</script>
