export default {
  props: {

    /**
     * Enable/disable input filter, optional, default false
     */
    showFilter: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Enable/disable column picker to show/hide table columns, optional, default false
     */
    showColumnPicker: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  watch: {

    showColumnPicker: function () {
      this.displayCols.forEach(function (column) {
        column.visible = true
      })
    },

    showFilter: function () {
      // Reset filter key on toggle showFilter
      this.filterKey = ""
    }
  }
}