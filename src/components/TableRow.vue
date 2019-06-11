<template>
    <tr @click="click" style="cursor: pointer">
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

            <span v-else-if="!column.editable">{{ entry[column.name] }}</span>

            <value-field-section v-else
                                 :entry="entry"
                                 :columnname="column.name"
                                 :should-save="editFields"
                                 v-on:toggle-edit="toggleEdit"
                >
            </value-field-section>
        </td>

        <td v-if="editFields">
            <div class="btn-group" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-outline-primary" @click="saveFields">
                    <span class="fa fa-check" aria-hidden="true"></span>
                </button>
                <button type="button" class="btn btn-outline-danger" @click="cancelSave">
                    <span class="fa fa-times" aria-hidden="true"></span>
                </button>
            </div>
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

      click ($e) {
        this.$emit('selected', { event: $e, entry: this.entry })
      },

      saveFields () {
        this.$emit('save-fields', true)
        this.toggleEdit(false)
      },

      cancelSave () {
        this.$emit('save-fields', false)
        this.toggleEdit(false)
      },

      toggleEdit (toggle) {
        this.editFields = toggle
      }
    }
  }
</script>
