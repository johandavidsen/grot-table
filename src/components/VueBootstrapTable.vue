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
                <table class="table table-bordered table-hover table-condensed table-striped vue-table">
                    <thead>
                        <table-header :columns="displayColsVisible" :sortable="sortable" :sort-key="sortKey" :sort-orders="sortOrders" v-on:selected="sortBy">
                            <th>
                                <check-box v-if="selectable" :checked="allSelected" v-on:selected="changeAllSelected"></check-box>
                            </th>
                        </table-header>
                    </thead>

                    <tbody>
                        <table-row v-for="(entry, index) in filteredValuesSorted"
                                   :entry="entry"
                                   :columns="displayColsVisible"
                                   track-by="entry"
                                   :key="index"
                                   v-on:selected="selectRow">
                            <td>
                                <check-box v-if="selectable" :checked="entry.selected" v-on:selected="(value) => toggleCheckbox(index, value)"></check-box>
                            </td>
                        </table-row>
                    </tbody>
                </table>
            </div>

            <div v-if="paginated" class="col-sm-12">
                <pagination :max-page="maxPage"
                            :current-page="page"
                            v-on:selected="updateCurrentPage">
                </pagination>
            </div>

        </div>
    </div>
</template>

<style lang="scss">
    .vue-table { }

    .vue-table-loading .spinner {
        border: 16px solid #f3f3f3; /* Light grey */
        border-top: 16px solid #3498db; /* Blue */
        border-radius: 50%;
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -60px 0 0 -60px;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }


    .vue-table-loading {
        position: absolute;
        z-index: 99;
        background-color: #ddd;
        opacity: 0.5;
        width: 100%;
        height: 100%;
    }

    .vue-table-loading-hidden {
        display: none;
    }

    table.vue-table thead > tr > th {
        cursor: pointer;
        padding-right: 30px !important;
    }

    .vue-table .icon::before {
        display: inline-block;
        font-style: normal;
        font-variant: normal;
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;
    }

    .vue-table .arrow {
        opacity: 1;
        position: relative;
    }

    .vue-table .arrow:before {
        position: absolute;
        bottom: 8px;
        right: 8px;
        display: block;
        font-family: "Font Awesome 5 Free";
        font-weight: 900;
        content: "\f0dc";
    }

    .vue-table .arrow.asc:before {
        content: "\f0de";
    }

    .vue-table .arrow.dsc:before {
        content: "\f0dd";
    }


    .vue-table .editableField {
        cursor: pointer;
    }

</style>

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
    },

    data: function () {
      return {
        filteredSize: 0,
        filterKey: "",
        sortKey: [],
        sortOrders: {},
        sortChanged: 1,
        displayCols: [],
        filteredValues: [],
        rawValues: [],
        page: 1,
        definedPageSize: 10,
        allSelected: false
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

      showFilter: function () {
        this.filterKey = ""
      },

      showColumnPicker: function () {
        this.displayCols.forEach(function (column) {
          column.visible = true
        })
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

      selectRow ({ event, entry }) {
        this.rowClickHandler(event, entry)
      },

      updateCurrentPage (index) {
        this.page = index
      },

      toggleCheckbox (index, value) {
        let row = this.values[index]
        row.selected = false
        this.values[index] = row

        let rowf = this.filteredValuesSorted[index]
        rowf.selected = value
        this.filteredValuesSorted[index] = rowf
      },

      changeAllSelected (value) {
        this.allSelected = value
      },

      refresh: function () {
        this.processFilter()
      },

      setPageSize: function (newPageSize) {
        this.definedPageSize = newPageSize
        this.processFilter()
      },

      processFilter: function () {
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

      setSortOrders: function () {
        this.sortKey = []
        var sortOrders = {}
        this.columns.forEach(function (column) {
          sortOrders[column.name] = ""
        })
        this.sortOrders = sortOrders
      },

      sortBy: function ({ event, column: { name, sortable } }) {
        let key = name

        if (!sortable) return

        if (this.sortable) {
          var self = this

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

      toggleColumn: function (column) {
        column.visible = !column.visible
      }
    }
  }
</script>
