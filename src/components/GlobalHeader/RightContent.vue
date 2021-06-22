<template>
  <div :class="wrpCls()">
    <avatar-dropdown :menu="showMenu" :class="prefixCls" />
    <!-- <select-lang :class="prefixCls" /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRaw } from 'vue';
import AvatarDropdown from './AvatarDropdown.vue'
// import SelectLang from '@/components/SelectLang'



export default defineComponent({
  name: 'RightContent',
  components: {
    AvatarDropdown,
    // SelectLang
  },
  props: {
    prefixCls: {
      type: String as PropType<String>,
      default: 'vite-header-index-action',
    },
    isMobile: {
      type: Boolean as PropType<Boolean>,
      default: () => false,
      required: true
    },
    topMenu: {
      type: Boolean as PropType<Boolean>,
      required: true
    },
    theme: {
      type: String as PropType<String>,
      required: true
    }
  },
  setup(props) {

    const data = reactive({
      showMenu: true,
    })
    const wrpCls = () => {
      return {
        'vite-header-right': true,
        [`vite-header-${(props.isMobile || !props.topMenu) ? 'light' : props.theme}`]: true
      }
    }

    return {
      ...toRaw(data),
      wrpCls,
      prefixCls: props.prefixCls
    }
  }
})
</script>

<style lang="less" scoped>
.vite-header-right {
  float: right;
  height: 100%;
  margin-left: auto;
  overflow: hidden;
  margin-right: 8px;
}
</style>
