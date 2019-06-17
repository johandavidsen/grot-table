<template>

    <div class="input-group">
        <input type="text" class="form-control" placeholder="Filter" :value="value" @input="uppdate" aria-label="" aria-describedby="FilterItems">
        <div class="input-group-append">
            <span class="input-group-text fa fa-search" id="FilterItems"></span>
        </div>
    </div>
</template>

<script>
  export default {
    name: "SearchInput",

    props: {
      value: {
        type: String
      }
    },

    methods: {
      uppdate (e) {
        this.$emit('input', e.target.value)
      }
    }
  }
</script>
