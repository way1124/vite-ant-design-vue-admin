<template>
  <page-header-wrapper content="将一个冗长或用户不熟悉的表单任务分成多个步骤，指导用户完成。">
    <a-card :bordered="false">
      <a-steps :current="current" style="max-width: 750px; margin: 16px auto">
        <a-step title="填写转账信息" />
        <a-step title="确认转账信息" />
        <a-step title="完成" />
      </a-steps>

      <step-form-step-1 v-if="current === 0" @click="click" />
      <step-form-step-2 v-if="current === 1" @click="click" />
      <step-form-step-3 v-if="current === 2" @click="click" />
    </a-card>
  </page-header-wrapper>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { PageHeaderWrapper } from '@/layout/PageHeaderWrapper';

import StepFormStep1 from "./step1.vue";
import StepFormStep2 from './step2.vue';
import StepFormStep3 from "./step3.vue";

export default defineComponent({
  components: {
    PageHeaderWrapper,
    StepFormStep1,
    StepFormStep2,
    StepFormStep3,
  },
  setup() {
    const current = ref<number>(0);
    const click = (item: number) => {
      if (item === 1) {
        current.value++
      } else {
        current.value = item
      }
    }
    return {
      current,
      click
    };
  },
});
</script>

<style lang="less" scoped>
</style>

