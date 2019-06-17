<template>
    <tr>
        <slot></slot>

        <th v-for="(column, i) in columns" @click="($event) => select($event, column)"
            track-by="column"
            class="icon"
            :key="i"
            :class="getClasses(column)"
            >
            {{ column.title }}
        </th>
    </tr>
</template>

<script>
  import lodashFindIndex from 'lodash.findindex'

  export default {
    name: "TableHeader",

    props: {
      columns: {
        required: true,
        type: Array
      },

      sortable: {
        type: Boolean,
        required: false,
        default: true,
      },

      sortKey: {
        type: Array
      },

      sortOrders: {
        type: Object
      }
    },

    methods: {

      select ($e, column) {
        this.$emit('selected', { event: $e, column: column })
      },

      getClasses (column) {
        let classes = [ column.columnstyle ]
        let key = column.name

        if (this.sortable && column.sortable) {
          classes.push("arrow");

          if (lodashFindIndex(this.sortKey, function (o) {
            return o === key;
          }) !== -1) {
            classes.push("active");
          }

          if (this.sortOrders[key] === "ASC") {
            classes.push("asc");
          } else if (this.sortOrders[key] === "DESC") {
            classes.push("dsc");
          }
        }
        return classes
      }
    }
  }
</script>
