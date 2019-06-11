<template>
    <span v-if="!enabled" @dblclick="toggleInput" class="editableField">{{this.entry[this.columnname]}}</span>
    <div v-else-if="enabled" class="input-group">
      <textarea type="text" class="form-control" v-model="datavalue" />
    </div>
</template>

<script>
  export default {
    name: "ValueFieldSection",

    props: [
      'entry',
      'columnname',
      'shouldSave'
    ],

    data: function () {
      return {
        enabled: false,
        datavalue: "",
      }
    },

    created: function () {
        this.$parent.$on('save-fields', this.handleParent)
    },

    methods: {
      saveThis () {
        var originalValue = this.entry[this.columnname]
        this.entry[this.columnname] = this.datavalue
        this.$parent.$emit('cellDataModifiedEvent', originalValue, this.datavalue, this.columnname,  this.entry)
        this.enabled = false
      },

      handleParent: function (save) {
        if (save) {
          this.saveThis()
        } else {
          this.cancelThis()
        }
      },

      cancelThis () {
        this.datavalue = this.entry[this.columnname]
        this.enabled = false
      },

      toggleInput () {
        this.datavalue= this.entry[this.columnname]
        this.enabled=!this.enabled
        this.$emit('toggle-edit', true)
      },
    }
  }
</script>
