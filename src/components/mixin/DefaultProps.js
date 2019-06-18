import Column from '../models/Column'
import findIndex from 'lodash.findindex'

/**
 * Mixin DefaultProps
 *
 * This mixin is intended to be used together with the mixin TableState as it operates on the default data structure.
 *
 * On property Columns : the data variables displayCols and sortOrders are calculated and populated.
 */
export default {
  props: {
    /**
     * The column titles, required
     */
    columns: {
      type: Array,
      required: true,
    },

     /**
      * The rows, an Array of objects
      */
     values: {
       type: Array,
       required: false,
     },

     /**
      * Enable/disable table row selection, optional, default false.
      * When true, it will add a checkbox column on the left side and use the value.selected field
      */
     selectable: {
       type: Boolean,
       required: false,
       default: true,
     },

     /**
      * Enable/disable table sorting, optional, default true
      */
     sortable: {
       type: Boolean,
       required: false,
       default: true,
     },

     /**
      * Enable/disable table multicolumn sorting, optional, default false.
      * Also sortable must be enabled for this function to work.
      */
     multiColumnSortable: {
       type: Boolean,
       required: false,
       default: false,
     },

     /**
      * Enable/disable pagination for the table, optional, default false
      */
     paginated: {
       type: Boolean,
       required: false,
       default: false,
     },

     /**
      * If pagination is enabled defining the page size, optional, default 10
      */
     pageSize: {
       type: Number,
       required: false,
       default: 10,
     },

     /**
      * Setting default order column. Expected name of the column
      */
     defaultOrderColumn: {
       type: String,
       required: false,
       default: null,
     },

     /**
      * Setting default order direction. Boolean: true = ASC , false = DESC
      */
     defaultOrderDirection: {
       type: Boolean,
       required: false,
       default: true,
     },

     /**
      * Function that is called every time the model is changed
      */
     onModelChange: {
       type: Function,
       required: false,
     },

     /**
      * Define if Filter search field is to work in a case Sensitive way. Default: true
      */
     filterCaseSensitive: {
       type: Boolean,
       required: false,
       default: true,
     }
  },

  watch: {

    /**
     * The rawValues data property is set equal to the values property
     */
    values () {
      this.rawValues = this.values
    },

    /**
     * The displayCols data property is calculated based on the property: columns
     */
    columns: function () {
      // Reset displayCols
      this.displayCols = []

      let self = this

      this.columns.forEach(function (column) {
        let obj = new Column(column)
        // Update the displayCols array
        self.displayCols.push(obj)
      })

      // Update the setSortOrders
      this.setSortOrders()
    },

    /**
     * The sortOrders data property is populated based on the property: columns
     */
    setSortOrders () {
      // Reset sortKey
      this.sortKey = []

      let sortOrders = {}

      this.columns.forEach(function (column) {
        sortOrders[column.name] = ""
      })

      this.sortOrders = sortOrders
    },
  },

  methods: {

    /**
     * Function SortBy
     *
     * This function is used to sort the collection
     *
     * @param event
     * @param name
     * @param sortable
     */
    sortBy ({ event, column: { name, sortable } }) {
      let key = name

      // If Sortable is not true
      if (!sortable) return

      // Sort
      let self = this

      // Sort single column
      if (!this.multiColumnSortable || (this.multiColumnSortable && !event.shiftKey)) {
        // Clear all keys except <key>
        this.sortKey = [key]
        this.columns.forEach(function (column) {
          if (column.name !== key) {
            self.sortOrders[column.name] = ""
          }
        })
      } else {
        // TODO: What is this?
        if (findIndex(this.sortKey, function (o) {
          return o === key
        }) === -1) {
          this.sortKey.push(key)
        }
      }

      // The section is only for the selected key
      if (this.sortOrders[key] === "") {
        this.sortOrders[key] = "ASC"
      } else if (this.sortOrders[key] === "ASC") {
        this.sortOrders[key] = "DESC"
      } else {
        this.sortOrders[key] = "ASC"
      }
    }
  }
}