<template>
  <a-menu theme="dark" mode="inline" :openKeys="openKeys" v-model:selectedKeys="selectedKeys" @openChange="onOpenChange">
    <template v-for="r in menus" :key="r.path">
      <app-menu-item v-if="!(r.children && r.children.length !== 0)" :route="r" />
      <app-sub-menu v-else :route="r" />
    </template>
  </a-menu>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, PropType, watch } from "vue";
import { RouteRecordRaw } from "vue-router";

import AppMenuItem from "./menuItem.vue";
import AppSubMenu from "./subMenu.vue";
import { IAppKeys } from './types';

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
    propsKeys: {
      type: Object as PropType<IAppKeys>,
      required: true,
    },
  },
  setup(props) {

    const state = reactive({
      rootSubmenuKeys: props.propsKeys.rootSubmenuKeys,
      openKeys: props.propsKeys.openKeys,
      selectedKeys: props.propsKeys.selectedKeys,
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

    watch(props.propsKeys, (propsKeys) => {
      state.openKeys = propsKeys.openKeys
      state.selectedKeys = propsKeys.selectedKeys
    })

    return {
      ...toRefs(state),
      onOpenChange,
    };
  },
});
</script>

<style></style>
