<template>
    <div id="app" class="container">
        <div class="row">
            <div class="col-sm-12 mb-3 mb-3">
                <h1>Original Component</h1>
            </div>
        </div>
        <grot-table-orignal
                :data-columns="columns"
                :data-values="values"
                class="mb-5">
        </grot-table-orignal>

        <div class="row">
            <div class="col-sm-12 mb-3 mb-3">
                <h1>Custom Component</h1>
            </div>
        </div>

        <!--<grot-table-customize
                :columns="columns"
                :values="values"
                class="mb-5"
            >
        </grot-table-customize>-->
    </div>
</template>

<script>
  import GrotTableOrignal from './examples/GrotTableOriginal'
  //import GrotTableCustomize from './examples/GrotTableCustomize'

  export default {

    name: 'app',

    data () {
      return {

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

    components: {
      GrotTableOrignal,
      //GrotTableCustomize
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
