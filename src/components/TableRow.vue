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
                                 v-on:toggle-edit="toggleEditFields"
                                 v-on:save-entry="saveFields"
                >
            </value-field-section>

            <span class="options-button-grp" v-if="editFields && index === 0">
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button type="button" class="btn btn-outline-primary" @click="initiateSave">
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
        editFields: false,
        row: this.entry
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
      }

    },

    methods: {

      initiateSave () {
        this.$emit('save-fields', { save: true })
        this.toggleEditFields(false)
      },

      saveFields({ field, value }) {
        if (value) {
          this.row[field] = value
          // Used in ValueFieldSection and VueBootstrapTable
          this.$emit('update-model', { save: true, entry: this.entry })
        }
      },

      cancelSave() {
        // Used in ValueFieldSection and VueBootstrapTable
        this.$emit('save-fields', { save: false })
        this.$emit('update-model', { save: false })
        this.toggleEditFields(false)
      },

      toggleEditFields(toggle) {
        this.$emit('edit-row', { toggle: toggle })
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
