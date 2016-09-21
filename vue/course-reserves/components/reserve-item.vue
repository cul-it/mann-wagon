<template src="./reserve-item.html"></template>

<script>
  import moment from 'moment'

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

        // Use Moment to format due date of unavailable items
        if (this.item.dueDate !== 'Available' && this.item.dueDate !== 'Online' && this.item.location !== '?') {
          var due = moment(this.item.dueDate)
          var dueRelative = due.calendar()

          if (moment().isBefore(due)) {
            this.$set('item.checkedOut', true)
          } else {
            this.$set('item.overdue', true)
          }

          this.$set('item.formattedDueDate', dueRelative)
        }
      }
    }
  }
</script>
