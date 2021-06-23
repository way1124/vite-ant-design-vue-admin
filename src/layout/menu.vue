<template>
  <a-menu theme="dark" mode="inline" :openKeys="openKeys" v-model:selectedKeys="selectedKeys" @openChange="onOpenChange">
    <template v-for="r in menus" :key="r.path">
      <app-menu-item v-if="!(r.children && r.children.length !== 0)" :route="r" />
      <app-sub-menu v-else :route="r" />
    </template>
  </a-menu>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, PropType } from "vue";
import { RouteRecordRaw, useRouter, RouteLocationNormalizedLoaded, onBeforeRouteUpdate } from "vue-router";

import AppMenuItem from "./menuItem.vue";
import AppSubMenu from "./subMenu.vue";

function getPath() {
  const value: RouteLocationNormalizedLoaded = useRouter().currentRoute.value
  const matched: string[] = value.matched.map(r => r.path)
  return matched
}

export default defineComponent({
  name: "AppMenu",
  components: {
    AppMenuItem,
    AppSubMenu,
  },
  props: {
    menus: {
      type: Array as PropType<RouteRecordRaw[]>,
      required: true,
    },
    
  },
  setup(props) {
    const matched = getPath()

    const state = reactive({
      rootSubmenuKeys: props.menus.map((r) => {
        if (r.children) {
          return r.path;
        }
      }),
      openKeys: matched,
      selectedKeys: matched,
    });
    const onOpenChange = (openKeys: string[]) => {
      const latestOpenKey = openKeys.find(
        (key) => state.openKeys.indexOf(key) === -1
      );
      if (state.rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
        state.openKeys = openKeys;
      } else {
        state.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    };

    onBeforeRouteUpdate(to => {
      console.log(to)
    })
    return {
      ...toRefs(state),
      onOpenChange,
      collapsed: ref<boolean>(false),
      menus: props.menus,
    };
  },
});
</script>

<style></style>
