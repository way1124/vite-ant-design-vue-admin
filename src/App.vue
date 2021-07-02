<template>
  <a-config-provider :locale="locale === 'en' ? enUS : zhCN">
    <router-view></router-view>
  </a-config-provider>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

import moment from 'moment';
import 'moment/dist/locale/zh-cn';

export default defineComponent({
  name: "App",
  setup() {
    const locale = ref<string>(zhCN.locale);
    moment.locale(locale.value);
    return {
      locale,
      enUS,
      zhCN
    }
  }
});
</script>

<style>
/* body {
  overflow-x: hidden;
}
#app {
  height: 100%;
}

.colorWeak {
  filter: invert(80%);
} */
</style>
