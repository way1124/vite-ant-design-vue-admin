<template>
  <a-dropdown v-if="currentUser" placement="bottomRight">
    <span class="vite-account-avatar">
      <a-avatar size="small" src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" class="vite-header-avatar" />
      <span>{{ currentUser }}</span>
    </span>
    <template v-slot:overlay>
      <a-menu class="vite-drop-down menu" :selected-keys="[]">
        <a-menu-item v-if="menu" key="center" @click="handleToCenter">
          <UserOutlined />
          个人中心
          <!-- {{ $t('menu.account.center') }} -->
        </a-menu-item>
        <a-menu-item v-if="menu" key="settings" @click="handleToSettings">
          <!-- <a-icon type="setting" /> -->
          <SettingOutlined />
          个人设置
          <!-- {{ $t('menu.account.settings') }} -->
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="logout" @click="handleLogout">
          <!-- <a-icon type="logout" /> -->
          <LogoutOutlined />
          退出登录
          <!-- {{ $t('menu.account.logout') }} -->
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import { Router, useRouter } from 'vue-router';
import { Modal } from 'ant-design-vue'

import { useState } from "@/store";

export default defineComponent({
  name: 'AvatarDropdown',
  props: {
    menu: {
      type: Boolean as PropType<Boolean>,
      required: true,
    }
  },
  setup(props) {
    const { state, action } = useState()
    const router: Router = useRouter()

    const currentUser = ref<string>(state.user.currentAuthority)

    const handleToCenter = () => {
      router.push({ path: '/account/center' })
    }
    const handleToSettings = () => {
      router.push({ path: '/account/settings' })
    }
    const handleLogout = (e: MouseEvent) => {
      // console.log(e)
      Modal.confirm({
        title: '信息',
        content: '您确定要注销吗？',
        onOk: () => {
          action.Logout({})
          router.push({ name: 'login' })
        },
        onCancel () {}
      })
    }

    watch(state, value => currentUser.value = value.user.currentAuthority)
    
    return {
      currentUser,
      menu: props.menu,
      handleToCenter,
      handleToSettings,
      handleLogout,
    }
  }
})

</script>

<style lang="less" scoped>
.vite-drop-down {
  :deep(.action) {
    margin-right: 8px;
  }
  :deep(.ant-dropdown-menu-item) {
    min-width: 160px;
  }
}

.vite-header-index-action {
  display: inline-block;
  height: 100%;
  padding: 0 12px;
  cursor: pointer;
  -webkit-transition: all .3s;
  transition: all .3s;
}

.vite-header-avatar {
  margin-right: 8px;
  color: #1890ff;
  background: hsla(0,0%,100%,.85);
}
</style>
