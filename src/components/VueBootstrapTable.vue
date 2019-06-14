<template>
    <div>
        <div class="row">
            <div class="col-6">
                <div v-if="showFilter" class="mb-3 mt-3">
                    <search-input v-model="filterKey"></search-input>
                </div>
            </div>
            <div class="col-6">
                <div v-if="showColumnPicker" class="mb-3 mt-3 d-flex justify-content-end">
                    <column-picker :options="displayCols" v-on:selected="toggleColumn"></column-picker>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-sm-12">
                <div :class="{ 'table-responsive': true, 'table-expanded': selectedRow === (filteredValuesSorted.length - 1)}">
                    <table class="table table-bordered table-hover table-condensed table-striped">
                        <thead>
                        <table-header :columns="displayColsVisible"
                                      :sortable="sortable"
                                      :sort-key="sortKey"
                                      :sort-orders="sortOrders"
                                      v-on:selected="sortBy" >
                            <th v-if="selectable">
                                <check-box  :checked="allSelected" v-on:selected="selectAll"></check-box>
                            </th>
                        </table-header>
                        </thead>

                        <tbody>
                            <table-row v-for="(entry, index) in filteredValuesSorted"
                                       :entry="entry"
                                       :columns="displayColsVisible"
                                       :key="index"
                                       :class="{ 'tr-row-overlay': selectedRow < 0 ? false : index !== selectedRow }"
                                       v-on:edit-row="(obj) => selectRow(index, obj)"
                                       track-by="entry"
                                >
                                <td track-by="entry" v-if="selectable">
                                    <check-box  :checked="entry.selected" v-on:selected="(value) => highlightRow(index, value)"></check-box>
                                </td>
                            </table-row>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="paginated" class="col-sm-12">
                <pagination :max-page="maxPage"
                            :current-page="page"
                            v-on:selected="selectPage">
                </pagination>
            </div>

        </div>
    </div>
</template>

<script>
  /* used for fixing IE problems*/
  import { polyfill } from 'es6-promise'
  polyfill()

  import orderBy from 'lodash.orderby'
  import includes from 'lodash.includes'
  import findIndex from 'lodash.findindex'

  import Column from './Column'
  import SearchInput from './SearchInput'
  import ColumnPicker from "./ColumnPicker"
  import TableHeader from "./TableHeader"
  import CheckBox from "./CheckBox"
  import TableRow from "./TableRow"
  import Pagination from "./Pagination"

  export default {
    name: "VueBootstrapTable",

    components: {
      Pagination,
      TableRow,
      CheckBox,
      TableHeader,
      ColumnPicker,
      SearchInput
    },

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
       * Enable/disable column picker to show/hide table columns, optional, default false
       */
      showColumnPicker: {
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
       * Function to handle row clicks
       */
      rowClickHandler: {
        type: Function,
        required: false,
        default: function () {
        }
      },

      /**
       * Enable/disable input filter, optional, default false
       */
      showFilter: {
        type: Boolean,
        required: false,
        default: false,
      },

      /**
       * Define if Filter search field is to work in a case Sensitive way. Default: true
       */
      filterCaseSensitive: {
        type: Boolean,
        required: false,
        default: true,
      },
    },

    data: function () {
      return {
        filteredSize: 0,
        filterKey: "",
        filteredValues: [],

        sortKey: [],
        sortOrders: {},
        sortChanged: 1,

        displayCols: [],

        rawValues: [],

        page: 1,
        definedPageSize: 10,

        allSelected: false,
        selectedRow: -1
      }
    },

    /**
     * Once mounted and ready to start
     */
    mounted: function () {
      this.$nextTick(function () {

        this.setSortOrders();

        this.definedPageSize = this.pageSize;

        var self = this;

        //
        if (this.defaultOrderColumn !== null) {
          self.sortKey[0] = this.defaultOrderColumn;
          if (this.defaultOrderDirection)
            self.sortOrders[this.defaultOrderColumn] = "ASC";
          else
            self.sortOrders[this.defaultOrderColumn] = "DESC";
        }

        // Build columns
        this.columns.forEach(function (column) {
          var obj = new Column(column);
          self.displayCols.push(obj);
        });

        self.rawValues = self.values
      })
    },

    watch: {

      values() {
        this.rawValues = this.values;
      },

      rawValues: function () {
        this.processFilter()
      },

      columns: function () {
        this.displayCols = []
        var self = this
        this.columns.forEach(function (column) {
          var obj = new Column(column)
          self.displayCols.push(obj)
        })
        this.setSortOrders()
      },

      showColumnPicker: function () {
        this.displayCols.forEach(function (column) {
          column.visible = true
        })
      },

      showFilter: function () {
        // Reset filter key on toggle showFilter
        this.filterKey = ""
      },

      filterKey: function () {
        // filter was updated, so resetting to page 1
        this.page = 1;
        this.processFilter()
      },

      sortKey: function () {
        this.processFilter()
      },

      sortChanged: function () {
        this.processFilter()
      },

      page: function () {
        this.processFilter()
      },

      paginated: function () {
        this.processFilter()
      },

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

    computed: {

      displayColsVisible: function () {
        var displayColsVisible = []

        for (var a in this.displayCols) {
          if (this.displayCols[a].visible)
            displayColsVisible.push(this.displayCols[a])
        }

        return displayColsVisible
      },

      filteredValuesSorted: function () {
        var tColsDir = []

        for (var i = 0, len = this.sortKey.length; i < len; i++) {
          tColsDir.push(this.sortOrders[this.sortKey[i]].toLowerCase())
        }

        if (typeof this.ajax !== 'undefined' && this.ajax.enabled && this.ajax.delegate) {
          return this.filteredValues
        } else {
          return orderBy(this.filteredValues, this.sortKey, tColsDir)
        }
      },

      maxPage: function () {
        return Math.ceil(this.filteredSize / this.definedPageSize)
      }
    },

    methods: {

      highlightRow (index, value) {
        let row = this.values[index]
        row.selected = false
        this.values[index] = row

        let rowf = this.filteredValuesSorted[index]
        rowf.selected = value
        this.filteredValuesSorted[index] = rowf
      },

      // eslint-disable-next-line
      selectRow (index, { entry }) {

        if (this.selectedRow >= 0) {
          this.selectedRow = -1
        } else {
          this.selectedRow = index
        }
        //this.rowClickHandler(null, entry)
      },

      selectPage (index) {
        this.page = index
      },

      selectAll (value) {
        this.allSelected = value
      },

      setPageSize (newPageSize) {
        this.definedPageSize = newPageSize
        this.processFilter()
      },

      setSortOrders () {
        this.sortKey = []
        let sortOrders = {}
        this.columns.forEach(function (column) {
          sortOrders[column.name] = ""
        })
        this.sortOrders = sortOrders
      },

      sortBy ({ event, column: { name, sortable } }) {
        let key = name

        if (!sortable) return

        if (this.sortable) {
          let self = this

          if (!this.multiColumnSortable || (this.multiColumnSortable && !event.shiftKey)) {
            this.sortKey = [key]
            this.columns.forEach(function (column) {
              if (column.name !== key) {
                self.sortOrders[column.name] = ""
              }
            })
          } else {
            if (findIndex(this.sortKey, function (o) {
              return o === key
            }) === -1) {
              this.sortKey.push(key)
            }
          }

          if (this.sortOrders[key] === "") {
            this.sortOrders[key] = "ASC"
          } else if (this.sortOrders[key] === "ASC") {
            this.sortOrders[key] = "DESC"
          } else {
            this.sortOrders[key] = "ASC"
          }

          this.sortChanged = this.sortChanged * -1
        }
      },

      refresh () {
        this.processFilter()
      },

      /**
       * This function is called on filterKey change
       */
      processFilter () {
        // Populate and filter data
        let self = this

        let result = this.rawValues.filter(item => {
          for (let col in self.displayColsVisible) {

            if (self.displayColsVisible[col].filterable && self.filterCaseSensitive && includes(item[self.displayColsVisible[col].name] + "", self.filterKey + "")) {
              return true
            } else if (self.displayColsVisible[col].filterable && includes((item[self.displayColsVisible[col].name] + "").toLowerCase(), (self.filterKey + "").toLowerCase())) {
              return true
            }
          }
          return false
        })

        var tColsDir = []
        for (var i = 0, len = this.sortKey.length; i < len; i++) {
          tColsDir.push(this.sortOrders[this.sortKey[i]].toLowerCase())
        }

        result = orderBy(result, this.sortKey, tColsDir)

        // Setup pagination
        // Based on results filtered on filterKey set Size
        this.filteredSize = result.length

        if (this.paginated) {
          var startIndex = (this.page - 1) * this.definedPageSize
          var tIndex = 0
          var tempResult = []

          while (tIndex < this.definedPageSize) {
            if (typeof result[startIndex + tIndex] !== "undefined") {
              tempResult.push(result[startIndex + tIndex])
            }
            tIndex++
          }

          self.filteredValues = tempResult
        } else {
          self.filteredValues = result
        }
      },

      toggleColumn (column) {
        column.visible = !column.visible
      }
    }
  }
</script>

<style lang="scss">
    .table-expanded {
        padding-bottom: 50px;
    }

    .tr-row-overlay {
        pointer-events: none;
    }

    .tr-row-overlay:after {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.8);
        background-position: center;
        background-repeat: no-repeat;
        content: "";
    }
</style>
