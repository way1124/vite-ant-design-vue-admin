<template>
  <div :class="prefixCls" :style="{ width: barWidth, transition: '0.3s all' }">
    <div style="float: left">
      <slot name="extra">{{ extra }}</slot>
    </div>
    <div style="float: right">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import settings from '@/config/settings';

export default defineComponent({
  name: 'FooterToolBar',
  props: {
    prefixCls: {
      type: String as PropType<string>,
      default: 'ant-pro-footer-toolbar'
    },
    collapsed: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    isMobile: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    siderWidth: {
      type: Number as PropType<number>,
      default: undefined
    },
    extra: {
      type: [String, Object],
      default: ''
    }
  },
	setup(props) {
    const { minWith, maxWith } = settings.menu
		return {
			barWidth: computed(() => props.isMobile ? undefined : `calc(100% - ${props.collapsed ? minWith : props.siderWidth || maxWith}px)`)
		}
	}
})
</script>

<style lang="less" scoped>
.ant-pro-footer-toolbar {
  position: fixed;
  width: 100%;
  bottom: 0;
  right: 0;
  height: 56px;
  line-height: 56px;
  box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.03);
  background: #fff;
  border-top: 1px solid #e8e8e8;
  padding: 0 24px;
  z-index: 9;

  &:after {
    content: "";
    display: block;
    clear: both;
  }
}
</style>