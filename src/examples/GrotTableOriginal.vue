<template>
    <div>
        <div class="row">
            <div class="col-sm-12">
                <div class="btn-group" role="group">
                    <button @click="addItem" class="btn btn-primary"><i class="glyphicon glyphicon-plus-sign"></i>
                        Add an item
                    </button>
                    <button @click="toggleFilter" class="btn btn-outline-primary">Toggle Filter</button>
                    <button @click="togglePicker" class="btn btn-outline-primary">Toggle Column Picker</button>
                    <button @click="toggleSelect" class="btn btn-outline-primary">Toggle Select column</button>
                    <button @click="togglePagination" class="btn btn-outline-primary">Toggle Pagination</button>
                </div>
            </div>
        </div>

        <grot-table
                :data-columns="dataColumns"
                :data-values="dataValues"
                :data-show-filter="showFilter"
                :data-show-column-picker="showPicker"
                :data-paginated="paginated"
                :data-multi-column-sortable="multiColumnSortable"
                :data-on-model-change="handleModelChange"
                :data-filter-case-sensitive=false
                :data-selectable="showSelect"
        >
        </grot-table>
    </div>
</template>

<script>
  import GrotTable from "../components/GrotTable"
  import DefaultProps from "../components/mixin/DefaultProps"

  export default {
    name: "GrotTableOriginal",

    mixins: [
      DefaultProps
    ],

    components: {
      GrotTable
    },

    data () {
      return {

        showFilter: true,
        showPicker: true,
        showSelect: true,

        paginated: true,

        multiColumnSortable: true,
        columnToSortBy: "name",
      }
    },

    methods: {

      handleModelChange ({ type, entry }) {
        // eslint-disable-next-line
        console.log("CLICK ROW: " + type + ' ' + JSON.stringify(entry))
      },

      addItem  () {
        const item = {
          "id": this.values.length + 1,
          "name": "name " + (this.values.length + 1)
        }
        this.dataValues.push(item)
      },

      toggleFilter () {
        this.showFilter = !this.showFilter
      },

      togglePicker () {
        this.showPicker = !this.showPicker
      },

      toggleSelect () {
        this.showSelect = !this.showSelect
      },

      togglePagination () {
        this.paginated = !this.paginated
      }
    }
  }
</script>
