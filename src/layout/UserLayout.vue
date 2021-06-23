<template>
  <basic-link />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BasicLink from "./BasicLink.vue";

export default defineComponent({
  name: "UserLayout",
  components: {
    BasicLink
  },
  setup() {},
});
</script>
