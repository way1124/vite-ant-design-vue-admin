<template>
  <div class="setting-drawer">
    <a-drawer
      width="300"
      placement="right"
      @close="onClose"
      :closable="false"
      :visible="visible"
      :drawer-style="{ position: 'absolute', width: '100%' }"
    >
      <div class="setting-drawer-index-content">

        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">整体风格设置</h3>

          <div class="setting-drawer-index-blockChecbox">
            <a-tooltip>
              <template #title>
                暗色菜单风格
              </template>
              <div class="setting-drawer-index-item" @click="handleMenuTheme('dark')">
                <img src="https://gw.alipayobjects.com/zos/rmsportal/LCkqqYNmvBEbokSDscrm.svg" alt="dark">
                <div class="setting-drawer-index-selectIcon" v-if="navTheme === 'dark'">
									<CheckOutlined />
                </div>
              </div>
            </a-tooltip>

            <a-tooltip>
              <template #title>
                亮色菜单风格
              </template>
              <div class="setting-drawer-index-item" @click="handleMenuTheme('light')">
                <img src="https://gw.alipayobjects.com/zos/rmsportal/jpRkZQMyYRryryPNtyIC.svg" alt="light">
                <div class="setting-drawer-index-selectIcon" v-if="navTheme !== 'dark'">
                  <CheckOutlined />
                </div>
              </div>
            </a-tooltip>
          </div>
        </div>

        <!-- <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">主题色</h3>

          <div style="height: 20px">
            <a-tooltip class="setting-drawer-theme-color-colorBlock" v-for="(item, index) in colorList" :key="index">
              <template #title>
                {{ item.key }}
              </template>
              <a-tag :color="item.color" @click="changeColor(item.color)">
								<CheckOutlined v-if="item.color === primaryColor" />
              </a-tag>
            </a-tooltip>

          </div>
        </div> -->
        <a-divider />

        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">导航模式</h3>

          <!-- <div class="setting-drawer-index-blockChecbox">
            <a-tooltip>
              <template #title>
                侧边栏导航
              </template>
              <div class="setting-drawer-index-item" @click="handleLayout('sidemenu')">
                <img src="https://gw.alipayobjects.com/zos/rmsportal/JopDzEhOqwOjeNTXkoje.svg" alt="sidemenu">
                <div class="setting-drawer-index-selectIcon" v-if="layoutMode === 'sidemenu'">
                  <CheckOutlined />
                </div>
              </div>
            </a-tooltip>

            <a-tooltip>
              <template #title>
                顶部栏导航
              </template>
              <div class="setting-drawer-index-item" @click="handleLayout('topmenu')">
                <img src="https://gw.alipayobjects.com/zos/rmsportal/KDNDBbriJhLwuqMoxcAr.svg" alt="topmenu">
                <div class="setting-drawer-index-selectIcon" v-if="layoutMode !== 'sidemenu'">
                  <CheckOutlined />
                </div>
              </div>
            </a-tooltip>
          </div> -->
          <div :style="{ marginTop: '24px' }">
            <a-list :split="false">
              <a-list-item>
								<template #actions>
									<a-tooltip>
										<template #title>
											该设定仅 [顶部栏导航] 时有效
										</template>
										<a-select size="small" style="width: 80px;" v-model:value="contentWidth" @change="handleContentWidthChange">
											<a-select-option value="Fixed">固定</a-select-option>
											<a-select-option value="Fluid" v-if="layoutMode !== 'sidemenu'">流式</a-select-option>
										</a-select>
									</a-tooltip>
								</template>
                <a-list-item-meta>
                  <template #title>内容区域宽度</template>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
								<template #actions>
                	<a-switch size="small" v-model:checked="fixedHeader" @change="handleFixedHeader" />
								</template>
                <a-list-item-meta>
                  <template #title>固定 Header</template>
                </a-list-item-meta>
              </a-list-item>
              <!-- <a-list-item>
								<template #actions>
                	<a-switch size="small" :disabled="!fixedHeader" v-model:checked="autoHideHeader" @change="handleFixedHeaderHidden" />
                </template>
								<a-list-item-meta>
									<template #title>
										<a-tooltip placement="left">
											<template #title>固定 Header 时可配置</template>
											<div :style="{ opacity: !fixedHeader ? '0.5' : '1' }">下滑时隐藏 Header</div>
										</a-tooltip>
									</template>
                </a-list-item-meta>
              </a-list-item> -->
              <a-list-item >
								<template #actions>
									<a-switch size="small" :disabled="(layoutMode === 'topmenu')" v-model:checked="fixSiderbar" @change="handleFixSiderbar" />
								</template>
                
                <a-list-item-meta>
									<template #title>
                  	<div :style="{ textDecoration: layoutMode === 'topmenu' ? 'line-through' : 'unset' }">固定侧边菜单</div>
									</template>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </div>
        </div>
        <a-divider />

        <!-- <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">其他设置</h3>
          <div>
            <a-list :split="false">
              <a-list-item>
								<template #actions>
									<a-switch size="small" v-model:checked="colorWeak" @change="onColorWeak" />
								</template>
                
                <a-list-item-meta>
									<template #title>
                  	<div>色弱模式</div>
									</template>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
								<template #actions>
									<a-switch size="small" v-model:checked="multiTab" @change="onMultiTab" />
								</template>
                
                <a-list-item-meta>
									<template #title>
                  	<div>多页签模式</div>
									</template>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </div>
        </div>
        <a-divider /> -->
        <!-- <div :style="{ marginBottom: '24px' }">
          <a-button @click="doCopy" block>
						<template #icon><CopyOutlined /></template>
						拷贝设置
					</a-button>
          <a-alert type="warning" :style="{ marginTop: '24px' }">
            <template #message>
              配置栏只在开发环境用于预览，生产环境不会展现，请手动修改配置文件。修改配置文件后，需要清空本地缓存和LocalStorage
              <a href="" target="_blank">src/config/settings.ts</a>
            </template>
          </a-alert>
        </div> -->
      </div>
      <template #handle>
        <div class="setting-drawer-index-handle" @click="toggle">
					<SettingOutlined v-if="!visible" />
					<CloseOutlined v-else />
				</div>
      </template>
    </a-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, watch } from 'vue';
import SettingItem from './SettingItem.vue'
import config from '@/config/settings'
import { updateTheme, updateColorWeak, colorList } from './settingConfig'

import { state, action } from "@/store";

import { useStore } from "vuex";

export default defineComponent({
  components: {
    SettingItem
  },
	setup() {
		const setting_drawer_state = reactive({
			visible: false,
			...config,
			fixedHeader: state.layout.fixedHeader,
			fixSiderbar: state.layout.fixSiderbar,
			navTheme: state.layout.navTheme,
			layoutMode: config.contentWidth,
			multiTab: false,
			autoHideHeader: config.fixedHeader
		})

		watch(() => state.layout.navTheme, theme => setting_drawer_state.navTheme = theme)

		const showDrawer = () => {
      setting_drawer_state.visible = true
    }
    const onClose = () => {
      setting_drawer_state.visible = false
    }
    const toggle = () => {
      setting_drawer_state.visible = !setting_drawer_state.visible
    }
    const onColorWeak = (checked: any) => {
			console.log('onColorWeak', checked)
      // this.$store.dispatch('ToggleWeak', checked)
      updateColorWeak(checked)
    }
    const onMultiTab = (checked: any) => {
			console.log(checked)
      // this.$store.dispatch('ToggleMultiTab', checked)
    }
    const handleMenuTheme = (theme: string) => {
			// console.log(theme)
			action.updateLayoutNavTheme(theme)
      // this.$store.dispatch('ToggleTheme', theme)
    }
    const doCopy = () => {
      // get current settings from mixin or this.$store.state.app, pay attention to the property name
//       const text = `export default {
//   primaryColor: '${st.primaryColor}', // primary color of ant design
//   navTheme: '${this.navTheme}', // theme for nav menu
//   layout: '${this.layoutMode}', // nav menu position: sidemenu or topmenu
//   contentWidth: '${this.contentWidth}', // layout of content: Fluid or Fixed, only works when layout is topmenu
//   fixedHeader: ${this.fixedHeader}, // sticky header
//   fixSiderbar: ${this.fixSiderbar}, // sticky siderbar
//   autoHideHeader: ${this.autoHideHeader}, //  auto hide header
//   colorWeak: ${this.colorWeak},
//   multiTab: ${this.multiTab},
//   production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true'
// }`
//       this.$copyText(text).then(message => {
//         console.log('copy', message)
//         this.$message.success('复制完毕')
//       }).catch(err => {
//         console.log('copy.err', err)
//         this.$message.error('复制失败')
//       })
    }
    const handleLayout = (mode: string) => {
			action.updateLayoutLayout(mode)
      // this.$store.dispatch('ToggleLayoutMode', mode)
      // 因为顶部菜单不能固定左侧菜单栏，所以强制关闭
      // this.handleFixSiderbar(false)
    }
    const handleContentWidthChange = (type: string) => {
			action.updateLayoutContentWidth(type)
    }
    const changeColor = (color: string) => {
      if (setting_drawer_state.primaryColor !== color) {
        // this.$store.dispatch('ToggleColor', color)
        updateTheme(color)
      }
    }
    const handleFixedHeader = (fixed: boolean) => {
			action.updateLayoutFixedHeader(fixed)
      // this.$store.dispatch('ToggleFixedHeader', fixed)
    }
    const handleFixedHeaderHidden = (autoHidden: any) => {
      // this.$store.dispatch('ToggleFixedHeaderHidden', autoHidden)
    }
    const handleFixSiderbar = (fixed: boolean) => {
      if (setting_drawer_state.layoutMode === 'topmenu') {
        action.updateLayoutFixSiderbar(false)
        return
      }
			action.updateLayoutFixSiderbar(fixed)
    }

		onMounted(() => {
			updateTheme(setting_drawer_state.primaryColor)
			if (setting_drawer_state.colorWeak !== config.colorWeak) {
				updateColorWeak(setting_drawer_state.colorWeak)
			}
		})

		return {
			...toRefs(setting_drawer_state),
			colorList,
			showDrawer,
			onClose,
			toggle,
			onColorWeak,
			onMultiTab,
			handleMenuTheme,
			doCopy,
			handleLayout,
			handleContentWidthChange,
			changeColor,
			handleFixedHeader,
			handleFixedHeaderHidden,
			handleFixSiderbar,
		}
	}
})
</script>

<style lang="less" scoped>
.setting-drawer-index-content {
  .setting-drawer-index-blockChecbox {
    display: flex;
    .setting-drawer-index-item {
      margin-right: 16px;
      position: relative;
      border-radius: 4px;
      cursor: pointer;
      img {
        width: 48px;
      }
      .setting-drawer-index-selectIcon {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        padding-top: 15px;
        padding-left: 24px;
        height: 100%;
        color: #1890ff;
        font-size: 14px;
        font-weight: 700;
      }
    }
  }
  .setting-drawer-theme-color-colorBlock {
    width: 20px;
    height: 20px;
    border-radius: 2px;
    float: left;
    cursor: pointer;
    margin-right: 8px;
    padding-left: 0px;
    padding-right: 0px;
    text-align: center;
    color: #fff;
    font-weight: 700;
    i {
      font-size: 14px;
    }
  }
}
.setting-drawer-index-handle {
  position: absolute;
  top: 240px;
  background: #1890ff;
  width: 48px;
  height: 48px;
  right: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
  z-index: 1001;
  text-align: center;
  font-size: 16px;
  border-radius: 4px 0 0 4px;
  color: rgb(255, 255, 255);
}
</style>

