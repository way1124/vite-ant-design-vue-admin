<template>
  <a-layout id="vite-layout">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <app-menu :menus="menus" :collapsed="collapsed" />
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <menu-unfold-outlined v-if="collapsed" class="trigger" @click="trigger" />
        <menu-fold-outlined v-else class="trigger" @click="trigger" />
        <right-content :top-menu="layout === 'topmenu'" :is-mobile="isMobile" :theme="theme" />
      </a-layout-header>
      <a-layout-content class="vite-content">
        <basic-link style="flex: 1;" />
        <a-layout-footer style="text-align: center">
          ©2021 Created by Vexth
        </a-layout-footer>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { RouteRecordRaw } from 'vue-router';
import AppMenu from "./menu.vue";
import BasicLink from "./BasicLink.vue";

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

export default defineComponent({
  name: "BasicLayout",
  components: {
    AppMenu,
    BasicLink,
    RightContent,
  },
  setup() {
    const settings = reactive({
      // 布局类型
      layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
      // 主题 'dark' | 'light'
      theme: defaultSettings.navTheme,
      // 是否手机模式
      isMobile: false,
      // menus: routes.filter((r) => r.meta && !r.meta.hidden),
      menus: getRoutes(routes),
      collapsed: false,
    })

    const trigger = () => (settings.collapsed = !settings.collapsed)
    return {
      ...toRefs(settings),
      trigger,
    };
  },
});
</script>

<style lang="less" scoped>

#vite-layout {
  height: inherit;
  // min-height: 100vh;

  .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.3);
    margin: 16px;
  }

  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
    &:hover {
      color: #1890ff;
    }
  }

  .vite-content {
    display: flex;
    flex-direction: column;
    /* margin: 24px 16px; */
    padding: 24px;
    /* background: rgb(255, 255, 255); */
    min-height: 280px;
    overflow-y: auto;
    transition: all 0.2s;
  }
}

.vite-content::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 3px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

.vite-content::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  /* background: #535353; */
}

.vite-content::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #ededed;
}

.site-layout .site-layout-background {
  background: #fff;
}
</style>
