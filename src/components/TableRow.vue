<template>
    <tr class="custom-row" @click="clickRow">
        <slot></slot>

        <td :key="index"
            v-for="(column, index) in columns"
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
                                 :value="{ edit: editable(column.name), name: column.name, value: entry[column.name] }"
                                 v-on:propertyChange="(value) => propertyChange(index, value)"
                >
            </value-field-section>

            <span class="options-button-grp" v-if="editable(column.name) ">
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button type="button" class="btn btn-outline-primary" @click.stop.prevent="saveRow">
                        <span class="fa fa-check" aria-hidden="true"></span>
                    </button>
                    <button type="button" class="btn btn-outline-danger" @click.stop.prevent="cancelSaveRow">
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


    data: function () {
      return {
        editFields: [],
        row: this.entry
      }
    },

    methods: {

      propertyChange(index, field) {
        let itemIndex = this.editFields.findIndex((item) => item.name === field.name)
        // Check if local state is enabled
        if (itemIndex === -1) {
          this.editFields.push(field)
          this.notifyHandler('edit-row', { toggle: true })
        } else if (field.edit === this.editFields[itemIndex].edit) {
          this.editFields[itemIndex] = field
        } else {
          this.editFields.splice(itemIndex, 1)
        }
      },

      editable (name) {
        return this.editFields.find((item) => item.name === name ) !== undefined
      },

      clickRow () {
        this.notifyHandler('click-row', { entry: this.row })
      },

      saveRow () {
        let self = this
        this.editFields.forEach((item) => {
          self.row[item.name] = item.value
        })
        this.editFields = []
        this.notifyHandler('save-edit-row', { entry: this.row })
      },

      cancelSaveRow() {
        this.editFields = []
        this.notifyHandler('cancel-edit-row', { entry: this.row })
      },

      notifyHandler (type, data) {
        this.$emit('notifyHandler', { type: type, data: data })
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
