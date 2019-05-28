<template>
    <div class="btn-toolbar" role="toolbar" aria-label="pagination bar">
        <div class="btn-group mr-2" role="group" aria-label="first page">
            <button type="button" class="btn btn-outline-primary" @click="click(1)">&laquo;</button>
        </div>

        <div class="btn-group mr-2" role="group" aria-label="pages">
            <button v-for="index in currentPages"
                    :key="index"
                    type="button" class="btn btn-outline-primary"
                    :class="{ active: currentPage===index }"
                    @click="click(index)">
                {{index}}
            </button>
        </div>

        <div class="btn-group mr-2" v-if="showPaginationEtc">
            ...
        </div>

        <div class="btn-group" role="group" aria-label="last page">
            <button type="button" class="btn btn-outline-primary" @click="click(maxPage)">&raquo;</button>
        </div>
    </div>
</template>

<script>
  export default {
    name: "Pagination",

    props: {

      maxPage: {
        type: Number,
        required: true
      },

      currentPage: {
        type: Number,
        required: true
      }

    },

    computed: {
      currentPages: function () {
        let result = []
        let start = 1

        if (this.currentPage > 3) {
          start = this.currentPage - 2
        }

        for (var i = 0; start <= this.maxPage && i < 5; start++) {
          result.push(start)
          i++
        }

        return result
      },

      showPaginationEtc: function () {
        var temp = 1;
        if (this.currentPage > 3)
          temp = this.currentPage - 2;
        return ((temp + 4) < this.maxPage);
      }
    },

    methods: {
      click (newCurrentPage) {
        this.$emit('selected', newCurrentPage)
      }
    }
  }
</script>
