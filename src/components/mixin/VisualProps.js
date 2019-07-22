export default {
  props: {

    /**
     * Enable/disable input filter, optional, default false
     */
    dataShowFilter: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Enable/disable column picker to show/hide table columns, optional, default false
     */
    dataShowColumnPicker: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  watch: {

    dataShowColumnPicker: function () {
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