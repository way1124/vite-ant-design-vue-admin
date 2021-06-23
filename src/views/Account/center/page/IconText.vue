<template>
  <span>
    <component :is="type" style="margin-right: 8px" />
    <!-- <a-icon :type="type" style="margin-right: 8px" /> -->
    {{ text }}
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: 'IconText',
  props: {
    'type': {
      type: String,
      required: true
    },
    text: {
      type: [String, Number],
      required: true
    }
  }
})
</script>