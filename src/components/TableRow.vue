<template>
    <tr>
        <slot></slot>
        <td :key="index"
            v-for="(column, index) in columns" track-by="column"
            v-show="column.visible" :class="column.cellstyle">
            <slot :name="column.name" :column="column" :value="entry">
                <span v-if="column.renderfunction!==false"
                      v-html="column.renderfunction( column.name, entry )"></span>
                <span v-else-if="!column.editable">{{ entry[column.name] }}</span>
                <value-field-section v-else
                                     :entry="entry"
                                     :columnname="column.name">
                </value-field-section>
            </slot>
        </td>
    </tr>
</template>

<script>
  import ValueFieldSection from "./ValueFieldSection.vue"

  export default {
    name: "TableRow",

    components: {
      'value-field-section': ValueFieldSection
    },

    props: {
      columns: {
        type: Array,
        required: true
      },

      entry: {
        type: Object,
        required: false
      }
    }
  }
</script>
