<template src="./reserve-item.html"></template>

<script>
  export default {
    props: {
      item: {
        type: Object
      }
    },

    created: function () {
      this.itemLogistics()
    },

    methods: {
      itemLogistics () {


        // Indicate online under availability
        if (this.item.location === 'electronic reserve') {
          this.$set('item.dueDate', 'Online')
        }

        // Identify physical reserves not at Mann
        if (this.item.location != 'Mann Library Reserve' && this.item.location != 'electronic reserve') {
          this.$set('item.elsewhere', true)
        }

        // Prep due dates for unavailable items
        if (this.item.dueDate != 'Available' && this.item.dueDate != 'Online') {
          this.$set('item.formattedDueDate', 'Not Yet')
        }
      }
    }
  }
</script>
