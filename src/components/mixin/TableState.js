/**
 * Mixin GrotTableState
 *
 * This mixin is intended as a drop-in mixin to enable the default functionality of the GrotTable.
 *
 * The default supported use cases are:
 *
 *  * Select all item -> This is implemented by calling the function selectAll, which sets the allSelected to either
 *    true/false. Which if true will set select=true on all items.
 *
 */
export default {
  data: function () {
    return {
      filteredSize: 0,
      filterKey: "",
      filteredValues: [],

      sortKey: [],
      sortOrders: {},

      displayCols: [],

      rawValues: [],

      page: 1,
      definedPageSize: 10,

      allSelected: false,
      currentlyEditedRow: -1
    }
  },

  watch: {

    allSelected () {
      const val = this.allSelected;

      this.values.forEach(value => {
        value.selected = false;
      })

      this.filteredValuesSorted.forEach(value => {
        value.selected = val;
      })
    }
  },

  methods: {

    /**
     * Function SelectAll
     *
     * This function is used to select all the items in the table
     *
     */
    selectAll (value) {
      this.allSelected = value
    }
  }
}


