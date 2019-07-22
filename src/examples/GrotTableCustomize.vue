<template>
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
</template>

<script>
  import { polyfill } from 'es6-promise'
  polyfill()

  import orderBy from 'lodash.orderby'
  import includes from 'lodash.includes'

  import TableState from '../components/mixin/TableState'
  import DefaultProps from '../components/mixin/DefaultProps'

  import Column from '../components/models/Column'
  import TableHeader from '../components/TableHeader'
  import CheckBox from "../components/CheckBox"
  import TableRow from "../components/TableRow"

  export default {
    name: "GrotTableCustomize",

    /**
     *
     */
    mixins: [
      DefaultProps, TableState
    ],

    /**
     *
     */
    components: {
      TableRow,
      CheckBox,
      TableHeader,
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
