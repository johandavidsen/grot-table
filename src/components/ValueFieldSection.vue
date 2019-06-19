<template>
    <span v-if="!enabled"
          @dblclick="toggleInput"
          class="editableField">
        {{ this.entry[this.columnname] }}
    </span>
    <div v-else-if="enabled"
         class="input-group">
      <textarea type="text"
                class="form-control"
                v-model="dataValue" />
    </div>
</template>

<script>
  export default {
    name: "ValueFieldSection",

    props: {

      columnname: {

      },

      entry: {

      },

      shouldSave: {
        type: Boolean
      }
    },


    data: function () {
      return {
        enabled: false,
        dataValue: "",
      }
    },

    created: function () {
      // Listen for the
      this.$parent.$on('save-fields', this.handleParent)
    },

    methods: {

      saveThis () {
        if (this.dataValue) {
          this.entry[this.columnname] = this.dataValue
        }
        this.enabled = false
        this.$emit('save-entry', { field: this.columnname, value: this.dataValue })
      },

      handleParent ({ save }) {
        if (save) {
          this.saveThis()
        } else {
          this.cancelThis()
        }
      },

      cancelThis () {
        this.dataValue = this.entry[this.columnname]
        this.enabled = false
      },

      toggleInput () {
        this.dataValue= this.entry[this.columnname]
        this.enabled=!this.enabled
        this.$emit('toggle-edit', true)
      },
    }
  }
</script>
