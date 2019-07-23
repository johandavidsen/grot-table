<template>
    <div id="app" class="container">
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
                :columns="columns"
                :values="values"
                :show-filter="showFilter"
                :show-column-picker="showPicker"
                :paginated="paginated"
                :multi-column-sortable="multiColumnSortable"
                :on-model-change="handleModelChange"
                :filter-case-sensitive=false
                :selectable="showSelect"
            >
        </grot-table>


    </div>
</template>

<script>
  import GrotTable from "./components/GrotTable"

  export default {

    name: 'app',

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

        columns: [
          {
            title: 'Id',
            name: 'id'
          },
          {
            title: 'Name',
            name: 'name',
            filterable: false,
            editable: true,
          },
          {
            title: 'Description',
            name: 'description',
            editable: true
          },
          {
            title: 'Address',
            name: 'street_address'
          },
          {
            title: 'City',
            name: 'city'
          },
          {
            title: 'State',
            name: 'state_province'
          },
          {
            title: 'Code',
            name: 'postal_code'
          }
        ],

        values: [
          {
            "id": "111",
            "name": "Casper Cliff",
            "description": "Id est rem aliquam animi libero minima. Praesentium ad cum autem quo voluptatum autem ea. Non rerum aliquam atque minima et. Omnis maiores debitis odio consequatur officiis.",
            "created_by": 3,
            "street_address": "90947 Schaefer Ramp",
            "city": "Lake Jammiemouth",
            "state_province": "Alaska",
            "postal_code": "35070",
            "status": "open"
          },
          {
            "id": "0D7D9DB64C7946E0B3FBDDFC",
            "name": "Alfredo Shore",
            "description": "Beatae deserunt aut voluptas modi repudiandae sit animi. Minima sit quam eligendi non aliquid et excepturi. Fugit reiciendis illo illum eum quidem minus.",
            "created_by": 4,
            "street_address": "1943 Ericka Shoal Suite 196",
            "city": "Johnathanshire",
            "state_province": "Georgia",
            "postal_code": "87106",
            "status": "open"
          }
        ]
      }
    },

    methods: {

      /* eslint-disable */
      handleModelChange ({ type, entry }) {
        // eslint-disable-next-line
        console.log("CLICK ROW: " + type + ' ' + JSON.stringify(entry))
      },

      addItem  () {
        const item = {
          "id": this.values.length + 1,
          "name": "name " + (this.values.length + 1)
        }
        this.values.push(item)
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

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        margin-top: 60px;
    }
</style>
