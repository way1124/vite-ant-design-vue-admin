<template>
  <div class="vite-components-article-listContent">
    <div class="description">
      <slot>
        {{ description }}
      </slot>
    </div>
    <div class="extra">
      <a-avatar :src="avatar" size="small" />
      <a :href="href">{{ owner }}</a> 发布在 <a :href="href">{{ href }}</a>
      <em>{{ getMoment(updateAt) }}</em>
    </div>
  </div>
</template>

<script lang="ts">

import moment from 'moment'
import { defineComponent, PropType, toRaw } from 'vue';

function getMoment(dataStr: string, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
}
export default defineComponent({
  name: 'ArticleListContent',
  props: {
    prefixCls: {
      type: String as PropType<String>,
      default: 'vite-components-article-listContent'
    },
    description: {
      type: String as PropType<String>,
      default: ''
    },
    owner: {
      type: String as PropType<String>,
      required: true
    },
    avatar: {
      type: String as PropType<String>,
      required: true
    },
    href: {
      type: String as PropType<String>,
      required: true
    },
    updateAt: {
      type: String as PropType<String>,
      required: true
    }
  },
  setup(props) {
    return {
      ...toRaw(props),
      getMoment,
    }
  }
})
</script>

<style lang="less" scoped>
// @import "~ant-design-vue/lib/style/index";

// The prefix to use on all css classes from ant-pro.
// @ant-pro-prefix             : ant-pro;
// @ant-global-sider-zindex    : 106;
// @ant-global-header-zindex   : 105;

.vite-components-article-listContent {
  .description {
    max-width: 720px;
    line-height: 22px;
  }
  .extra {
    margin-top: 16px;
    color: rgba(0,0,0,.45);
    line-height: 22px;

    & :deep(.ant-avatar) {
      position: relative;
      top: 1px;
      width: 20px;
      height: 20px;
      margin-right: 8px;
      vertical-align: top;
    }

    & > em {
      margin-left: 16px;
      color: rgba(0,0,0,.25);
      font-style: normal;
    }
  }
}

@media screen and (max-width: 480px) {
  .vite-components-article-listContent {
    .extra {
      & > em {
        display: block;
        margin-top: 8px;
        margin-left: 0;
      }
    }
  }
}
</style>
