<template>
  <app-menu-item v-if="route.children.length === 1" :route="route" />
  <a-sub-menu v-else :key="route.path">
    <template #title>
        <template v-if="route.meta && route.meta.icon">
          <component :is="`${route.meta.icon}`" />
        </template>
        <span>{{route.meta.title}}</span>
    </template>

    <template v-for="r in route.children" :key="r.path">
      <app-menu-item v-if="!r.children" :route="r" />
      <app-sub-menu v-else :route="r" />
    </template>
    
  </a-sub-menu>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { RouteRecordRaw } from 'vue-router';

import AppMenuItem from './MenuItem.vue';

export default defineComponent({
  name: "AppSubMenu",
  components: {
    AppMenuItem
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
