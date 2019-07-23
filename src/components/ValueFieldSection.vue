<template>
    <div v-if="edit"
         class="input-group"
        >
        <label>
            <textarea type="text"
                class="form-control"
                v-model="dataValue">
            </textarea>
        </label>
    </div>
    <span v-else
          @click.stop.prevent
          @dblclick="toggleInput"
          class="editableField">
        {{ dataValue }}
    </span>
</template>

<script>

  export default {
    name: "ValueFieldSection",

    props: {

      value: {
        type: Object,
        required: true
      }
    },

    data: function () {
      return {
        edit: this.value.edit,
        name: this.value.name,
        dataValue: this.value.value,
      }
    },

    watch: {
      value: function ({ edit, value }) {
        this.edit = edit
        this.dataValue = value
      },

      dataValue: function (value) {
        this.$emit('propertyChange', { edit: this.edit, name: this.name, value: value })
      }
    },

    methods: {

     toggleInput () {
       this.$emit('propertyChange', { edit: !this.edit, name: this.name, value: this.dataValue })
     }
    }
  }
</script>
