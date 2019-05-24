<template>
    <div class="btn-group">
        <button type="button" class="btn btn-outline-primary dropdown-toggle"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false">
            Columns <span class="caret"></span>
        </button>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
            <button v-for="(column, i) in options"
                    :key="i"
                    class="dropdown-item"
                    @click.prevent="() => selectColumn(column)"
            >
                <i v-if="column.visible" class="fa fa-check"></i> {{ column.title }}
            </button>
        </div>
    </div>
</template>

<script>
  export default {
    name: "ColumnPicker",

    props: {
      options: {
        required: true,
        type: Array
      }
    },

    methods: {
      selectColumn (column) {
        this.$emit('selected', column)
      }
    }

  }
</script>

