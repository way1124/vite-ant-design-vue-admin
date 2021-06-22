<template>
  <a-layout id="vite-layout">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <app-menu :menus="menus" />
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        <right-content :top-menu="layout === 'topmenu'" :is-mobile="isMobile" :theme="theme" />
      </a-layout-header>
      <a-layout-content class="vite-content">
        <!-- <router-view v-slot="{ Component }">
          <transition name="slide-right" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view> -->
        <user-layout></user-layout>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRaw } from "vue";

import AppMenu from "./menu.vue";
import UserLayout from "./UserLayout.vue";

import { RightContent } from "@/components/GlobalHeader";

import { routes } from "@/router";

import defaultSettings from "@/config/settings";

export default defineComponent({
  name: "BasicLayout",
  components: {
    AppMenu,
    UserLayout,
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
      menus: routes.filter((r) => r.meta && !r.meta.hidden),
    })
    return {
      ...toRaw(settings),
      collapsed: ref<boolean>(false),
    };
  },
});
</script>

<style>
#vite-layout {
  height: inherit;
}
#vite-layout .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#vite-layout .trigger:hover {
  color: #1890ff;
}

#vite-layout .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

#vite-layout .vite-content {
  /* margin: 24px 16px; */
  padding: 24px;
  /* background: rgb(255, 255, 255); */
  min-height: 280px;
  overflow-y: auto;
  transition: all 0.2s;
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
