<template>
    <div class="btn-toolbar" role="toolbar" aria-label="pagination bar">
        <div class="btn-group mr-2" role="group" aria-label="first page">
            <button type="button" class="btn btn-outline-primary" @click="click(1)">&laquo;</button>
        </div>
        <div class="btn-group mr-2" role="group" aria-label="pages">
            <button v-for="index in pageNumbers"
                    :key="index"
                    type="button" class="btn btn-outline-primary"
                    :class="{ active: currentPage===index }"
                    @click="click(index)">
                {{index}}
            </button>
        </div>
        <div class="btn-group mr-2" v-if="showPaginationEtc">...</div>
        <div class="btn-group" role="group" aria-label="last page">
            <button type="button" class="btn btn-outline-primary" @click="click(maxPage)">&raquo;</button>
        </div>
    </div>
</template>

<script>
  export default {
    name: "Pagination",

    props: {
      pageNumbers: {
        type: Array,
        required: true
      },

      maxPage: {
        type: Number,
        required: true
      },

      page: {
        type: Number,
        required: true
      },

      showPaginationEtc: {
        type: Boolean,
        required: true
      }
    },

    data () {
      return {
        currentPage: this.page
      }
    },

    watch: {
      page: function (newValue) {
        return this.currentPage = newValue
      }
    },

    methods: {
      click (newCurrentPage) {
        this.$emit('selected', newCurrentPage)
      }
    }
  }
</script>
