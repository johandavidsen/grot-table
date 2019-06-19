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
                <div :class="{ 'table-responsive': true, 'table-expanded': currentlyEditedRow === (filteredValuesSorted.length - 1)}">
                    <table class="table table-bordered table-hover table-condensed table-striped">
                        <thead>
                        <table-header :columns="displayColsVisible"
                                      :sortable="sortable"
                                      :sort-key="sortKey"
                                      :sort-orders="sortOrders"
                                      v-on:selected="sortBy" >
                            <th v-if="selectable">
                                <check-box :checked="allSelected" v-on:selected="selectAll"></check-box>
                            </th>
                        </table-header>
                        </thead>

                        <tbody>
                            <table-row v-for="(entry, index) in filteredValuesSorted"
                                       :entry="entry"
                                       :columns="displayColsVisible"
                                       :key="index"
                                       :class="{ 'tr-row-overlay': currentlyEditedRow < 0 ? false : index !== currentlyEditedRow }"
                                       v-on:edit-row="(obj) => setCurrentlyEditedRow(index, obj)"
                                       v-on:update-model="saveFields"
                                       track-by="entry"
                                >
                                <td v-if="selectable" track-by="entry" >
                                    <check-box :checked="entry.selected" v-on:selected="(value) => highlightRow(index, value)"></check-box>
                                </td>
                            </table-row>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="paginated" class="col-sm-12 d-flex justify-content-center">
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

  import TableState from './mixin/TableState'
  import VisualProps from './mixin/VisualProps'
  import DefaultProps from './mixin/DefaultProps'

  import Column from './models/Column'
  import SearchInput from './SearchInput'
  import ColumnPicker from "./ColumnPicker"
  import TableHeader from "./TableHeader"
  import CheckBox from "./CheckBox"
  import TableRow from "./TableRow"
  import Pagination from "./Pagination"

  export default {
    name: "GrotTable",

    /**
     *
     */
    mixins: [
      VisualProps, DefaultProps, TableState
    ],

    /**
     *
     */
    components: {
      Pagination,
      TableRow,
      CheckBox,
      TableHeader,
      ColumnPicker,
      SearchInput
    },

    /**
     * Once mounted and ready to start
     */
    mounted: function () {
      this.$nextTick(function () {

        //this.setSortOrders();

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

      rawValues: function () {
        this.processFilter()
      },

      filterKey: function () {
        // filter was updated, so resetting to page 1
        this.page = 1;
        this.processFilter()
      },

      sortKey: function () {
        this.processFilter()
      },

      page: function () {
        this.processFilter()
      },

      paginated: function () {
        this.processFilter()
      },

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

        return orderBy(this.filteredValues, this.sortKey, tColsDir)
      },

      maxPage: function () {
        return Math.ceil(this.filteredSize / this.definedPageSize)
      }
    },

    methods: {

      /**
       * Function HighlightRow
       *
       * This functions adds a selected variable to the entry object. This methods generates a SELECTED event.
       *
       */
      highlightRow (index, value) {
        let rowf = this.filteredValuesSorted[index]
        rowf.selected = value

        this.filteredValuesSorted[index] = rowf

        this.onModelChange({ type: "SELECTED", entry: rowf })
      },

      /**
       * Function SetCurrentlyEditedRow
       *
       * Indicate which row is currently being edited.
       *
       */
      setCurrentlyEditedRow (index, { toggle }) {

        if (toggle) {
          this.currentlyEditedRow = index
        } else {
          this.currentlyEditedRow = -1
        }

      },

      /**
       * Function SaveFields
       *
       * This function calls the onModelChange function if the field should be saved.
       *
       */
      saveFields ({ save, entry }) {
        if (save && entry) {
          this.onModelChange({ type: "SAVE", entry: entry })
        }
      },

      selectPage (index) {
        this.page = index
      },

      /**
       * This function is called on filterKey change
       */
      processFilter () {
        // Populate and filter data
        let self = this

        // Show based on columns that are visible
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

        // Sort according to sortOrders
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
