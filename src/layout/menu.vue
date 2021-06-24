<template>
  <a-menu theme="dark" mode="inline" :openKeys="openKeys" v-model:selectedKeys="selectedKeys" @openChange="onOpenChange">
    <template v-for="r in menus" :key="r.path">
      <app-menu-item v-if="!(r.children && r.children.length !== 0)" :route="r" />
      <app-sub-menu v-else :route="r" />
    </template>
  </a-menu>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, PropType, watch } from "vue";
import { RouteRecordRaw, useRoute } from "vue-router";

import AppMenuItem from "./menuItem.vue";
import AppSubMenu from "./subMenu.vue";

function useMatchedPaths() {
  const route = useRoute()
  const paths = route.matched.map(r => r.path)
  return paths
}

function useRootSubmenuKeys(menus: RouteRecordRaw[]) {
  return menus.map((r) => {
    if (r.children) {
      return r.path;
    }
  })
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
    collapsed: {
      type: Boolean as PropType<Boolean>,
      required: true,
    },
  },
  setup(props) {
    const matched = useMatchedPaths()
    const router = useRoute()

    const state = reactive({
      rootSubmenuKeys: useRootSubmenuKeys(props.menus),
      openKeys: matched,
      selectedKeys: matched,
      collapsed: false,
      menus: props.menus,
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

    watch([() => router.matched, props], ([value, props]) => {
      const values = value.map(r => r.path)
      state.openKeys = !props.collapsed ? values : []
      state.selectedKeys = values
    })

    return {
      ...toRefs(state),
      onOpenChange,
    };
  },
});
</script>

<style></style>
