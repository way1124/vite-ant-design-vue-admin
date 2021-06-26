<template>
  <a-layout id="vite-layout">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible class="vite-sider">
      <div class="logo" />
      <app-menu :menus="menus" :propsKeys="propsKeys" />
    </a-layout-sider>
    <a-layout class="vite-main" :style="{ marginLeft }">
      <a-layout-header class="vite-header">
        <menu-unfold-outlined v-if="collapsed" class="trigger" @click="trigger" />
        <menu-fold-outlined v-else class="trigger" @click="trigger" />
        <right-content :top-menu="layout === 'topmenu'" :is-mobile="isMobile" :theme="theme" />
      </a-layout-header>
      <a-layout-content>
        <a-page-header style="background: #fff;" title="Title" :breadcrumb="{ routes }" sub-title="This is a subtitle" />
        <div class="vite-content">
          <basic-link style="flex: 1;" />
        </div>
        
        <a-layout-footer style="text-align: center">
          ©2021 Created by Vexth
        </a-layout-footer>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">

import { defineComponent, reactive, toRefs, watch } from "vue";
import { useRoute, RouteRecordRaw, RouteLocationMatched } from 'vue-router';


import BasicLink from "./BasicLink.vue";
import { AppMenu } from './AppMenu';
import { IAppKeys } from './AppMenu/types';

import { RightContent } from "@/components/GlobalHeader";

import { routes } from "@/router";

import defaultSettings from "@/config/settings";

function getRoutes(routes: RouteRecordRaw[]) {
  return routes.filter((r) => r.meta && !r.meta.hidden).map(r => {
    if (r.children && r.children.length !== 0) {
      r.children = getRoutes(r.children)
    }
    return r
  })
}

function useRootSubmenuKeys(menus: RouteRecordRaw[]) {
  return menus.filter(r => r.children).map((r) => r.path)
}

function useMatchedRoutes(matched: RouteLocationMatched[]) {
  return matched.map(r => ({path: r.path, breadcrumbName: r.meta.title}))
}

export default defineComponent({
  name: "BasicLayout",
  components: {
    AppMenu,
    BasicLink,
    RightContent,
  },
  setup() {
    const route = useRoute()

    const menus = getRoutes(routes)
    const rootSubmenuKeys = useRootSubmenuKeys(menus)
    const paths = route.matched.map(r => r.path)

    const matchedRoutes = useMatchedRoutes(route.matched)

    const settings = reactive({
      // 布局类型
      layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
      // 主题 'dark' | 'light'
      theme: defaultSettings.navTheme,
      // 是否手机模式
      isMobile: false,
      menus,
      collapsed: false,
      routes: matchedRoutes,
      marginLeft: '200px'
    })

    const propsKeys = reactive<IAppKeys>({
      rootSubmenuKeys,
      openKeys: paths,
      selectedKeys: paths,
    })

    const trigger = () => {
      settings.collapsed = !settings.collapsed
      settings.marginLeft = settings.collapsed ? '80px' : '200px'
    }

    watch([() => route.matched, () => settings.collapsed], ([matched, collapsed]) => {
      const values = matched.map(r => r.path)
      propsKeys.openKeys = collapsed ? [] : values
      propsKeys.selectedKeys = values
      settings.routes = useMatchedRoutes(matched)
    })

    return {
      ...toRefs(settings),
      propsKeys,
      trigger,
    };
  },
});
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
