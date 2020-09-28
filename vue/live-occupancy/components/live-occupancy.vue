<template>
  <div class="ui labeled icon basic blue large button">
    <span class="fa-sign-in large icon"></span>
    <span class="remaining">(( remaining )) people may enter</span>
    <div class="occupancy">Occupancy (( occupancy )) / Max (( capacity ))</div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        capacity: 0,
        occupancy: 0 
      }
    },

    computed: {
      remaining () {
        return this.capacity - this.occupancy
      }
    },

    created: function () {
      this.getSafespace()
    },

    methods: {
      getSafespace () {
        var vm = this

        const baseUrl = `https://display.safespace.io`
        const spaceCode = '469b3905'

        let occupancy = 0
        let capacity = 0

        Promise.all([
          this.$http.get(`${baseUrl}/value/live/${spaceCode}`)
            .then((response) => occupancy = +response.data),

          this.$http.get(`${baseUrl}/entity/space/hash/${spaceCode}`)
            .then((response) => capacity = +response.data.space.maxCapacity),

        ]).then(function (response) {
          vm.$set('occupancy', occupancy)
          vm.$set('capacity', capacity)
        })
      }
    }
  }
</script>

<style>
  .occupancy {
    margin: .2em 0 0 1em;
    font-size: .7em;
    color: #0c161d;
  }
  .remaining {
    margin-left: 1em;
    font-size: .9em;
    font-weight: 700;
    color: #0169b8;
  }
</style>
