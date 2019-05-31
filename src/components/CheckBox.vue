<template>
    <div class="custom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input" :id="id"
               aria-label="Select All" v-model="checkedLocal">
        <label class="custom-control-label" :for="id"></label>
    </div>
</template>

<script>
  export default {
    name: "CheckBox",

    props: {
      checked: {
        type: Boolean,
        required: false,
        default: false
      }
    },

    watch: {
      checked: function (newVal) {
        return this.checkedLocal = newVal
      },

      checkedLocal: function (newValue) {
        this.$emit('selected', newValue)
      }
    },

    data() {
      return {
        id: Math.floor((Math.random() * 100000000) + 1),
        checkedLocal: this.checked
      }
    }
  }
</script>
