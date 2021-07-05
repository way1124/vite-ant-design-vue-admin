<template>
  <a-layout id="vite-layout">
    <a-layout-sider :theme="theme" v-model:collapsed="collapsed" :trigger="null" collapsible :class="`${fixSiderbar ? 'vite-sider' : ''}`">
      <div class="logo" />
      <app-menu :menus="menus" :propsKeys="propsKeys" :theme="theme" />
    </a-layout-sider>
    <a-layout class="vite-main" :style="{ marginLeft: fixSiderbar ? `${marginLeft}px` : null }">
      <a-layout-header :style="{ height: `${headerHeight}px`, lineHeight: `${headerHeight}px` }" :class="`vite-header ${fixedHeader ? 'vite-header-fixedHeader' : ''}`">
        <menu-unfold-outlined v-if="collapsed" :style="{ lineHeight: `${headerHeight}px` }" class="trigger" @click="trigger" />
        <menu-fold-outlined v-else :style="{ lineHeight: `${headerHeight}px` }" class="trigger" @click="trigger" />
        <right-content :top-menu="layout === 'topmenu'" :is-mobile="isMobile" :theme="theme" />
      </a-layout-header>
      <a-layout-content>
        <app-global-content :class="contentWidth">
          <template #content><basic-link /></template>
        </app-global-content>
        <setting-drawer />
        <a-layout-footer v-if="pageFooter" class="vite-footer">{{pageFooter}}</a-layout-footer>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from "vue";
import { useRoute, RouteRecordRaw, RouteLocationMatched } from 'vue-router';

import BasicLink from "./BasicLink.vue";
import { AppMenu } from './AppMenu';
import { IAppKeys } from './AppMenu/menu.interface';

import { RightContent } from "@/components/GlobalHeader";
import { AppGlobalContent } from "@/components/GlobalContent";
import { SettingDrawer } from "@/components/SettingDrawer";

import { routes } from "@/router";

import defaultSettings from "@/config/settings";

import { action, state } from "@/store";

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

function setLeft(collapsed: boolean) {
  const { minWith, maxWith } = defaultSettings.menu
  return collapsed ? minWith : maxWith
}

export default defineComponent({
  name: "BasicLayout",
  components: {
    AppMenu,
    BasicLink,
    RightContent,
    AppGlobalContent,
    SettingDrawer,
  },
  setup() {
    const route = useRoute()

    const menus = getRoutes(routes)
    const rootSubmenuKeys = useRootSubmenuKeys(menus)
    const paths = route.matched.map(r => r.path)

    const matchedRoutes = useMatchedRoutes(route.matched)

    const { layout } = state
    const settings = reactive({
      // 布局类型
      layout: layout.layout, // 'sidemenu', 'topmenu'
      // 主题 'dark' | 'light'
      theme: layout.navTheme,
      // 是否手机模式
      isMobile: false,
      fixedHeader: layout.fixedHeader,
      fixSiderbar: layout.fixSiderbar,
      contentWidth: layout.contentWidth,
      pageFooter: defaultSettings.footer,
      headerHeight: defaultSettings.headerHeight,
      menus,
      collapsed: defaultSettings.menu.locale,
      marginLeft: setLeft(defaultSettings.menu.locale)
    })

    const propsKeys = reactive<IAppKeys>({
      rootSubmenuKeys,
      openKeys: defaultSettings.menu.locale ? [] : paths,
      selectedKeys: paths,
    })

    const trigger = () => {
      settings.collapsed = !settings.collapsed
      settings.marginLeft = setLeft(settings.collapsed)
      action.updateLayoutMenuLocale(settings.collapsed)
    }

    watch([() => route.matched, () => settings.collapsed, state], ([matched, collapsed, newState]) => {
      const values = matched.map(r => r.path)
      propsKeys.openKeys = collapsed ? [] : values
      propsKeys.selectedKeys = values
      // console.log(navTheme)
      const { layout } = newState
      settings.theme = layout.navTheme
      settings.fixedHeader = layout.fixedHeader
      settings.fixSiderbar = layout.fixSiderbar
      settings.contentWidth = layout.contentWidth
      // pageHeader.breadcrumb.routes = useMatchedRoutes(matched)
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
