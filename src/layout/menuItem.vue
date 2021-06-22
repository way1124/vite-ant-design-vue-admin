<template>
  <a-menu-item :key="route.path">
    <app-link :to="route.path">
      <template v-if="route.meta && route.meta.icon">
        <component :is="`${route.meta.icon}`" />
      </template>
      <span>{{route.meta.title}}</span>
    </app-link>
  </a-menu-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { RouteRecordRaw } from 'vue-router';

import AppLink from './Link.vue';

export default defineComponent({
  name: "AppMenuItem",
  components: {
    AppLink
  },
  props: {
    route: {
      type: Object as PropType<RouteRecordRaw>,
      required: true
    }
  },
  setup(props) {
    // console.log(props.route)
    return {
      route: props.route
    }
  },
})
</script>

<style scoped>

</style>

