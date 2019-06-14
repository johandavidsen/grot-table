<template>
    <tr class="custom-row">
        <slot></slot>

        <td :key="index"
            v-for="(column, index) in columns"
            track-by="column"
            v-show="column.visible"
            :class="column.cellstyle"
        >

            <span v-if="column.renderfunction!==false"
                  v-html="column.renderfunction( column.name, entry )">
            </span>

            <span v-else-if="!column.editable">
                {{ entry[column.name] }}
            </span>

            <value-field-section v-else
                                 :entry="entry"
                                 :columnname="column.name"
                                 :should-save="editFields"
                                 v-on:toggle-edit="toggleEdit"
                >
            </value-field-section>

            <span class="options-button-grp" v-if="editFields && index === 0">
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button type="button" class="btn btn-outline-primary" @click="saveFields">
                        <span class="fa fa-check" aria-hidden="true"></span>
                    </button>
                    <button type="button" class="btn btn-outline-danger" @click="cancelSave">
                        <span class="fa fa-times" aria-hidden="true"></span>
                    </button>
                </div>
            </span>
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

    data: function () {
      return {
        editFields: false
      }
    },

    props: {
      columns: {
        type: Array,
        required: true
      },

      entry: {
        type: Object,
        required: false
      },

      rowClicked: {
        type: Function,
        required: false,
        default: function () {

        }
      }
    },

    methods: {

      saveFields() {
        // Used in ValueFieldSection and VueBootstrapTable
        this.$emit('save-fields', true)
        this.toggleEdit(false)
      },

      cancelSave() {
        // Used in ValueFieldSection and VueBootstrapTable
        this.$emit('save-fields', false)
        this.toggleEdit(false)
      },

      toggleEdit(toggle) {
        this.$emit('edit-row', { entry: this.entry })
        this.editFields = toggle
      }
    }
  }
</script>

<style lang="scss">
    .custom-row {
        position: relative;
        cursor: pointer;
    }

    .options-button-grp {
        position: absolute;
        z-index: 1050;
        background-color: white;
        right: 20px;
        bottom: -48px;
    }
</style>
