<template>
  <a-list itemLayout="horizontal" :dataSource="data">
  </a-list>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    return {
      data: []
    }
  }
})
</script>

<style scoped>

</style>
