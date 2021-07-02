<template>
  <page-header-wrapper :content="`Form pages are used to collect or verify information to users, and basic forms are common in scenarios where there are fewer data items.`">
    <a-card :bordered="false">
      <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item ref="title" label="标题" name="title">
          <a-input v-model:value="formState.title" placeholder="给目标起个名字" />
        </a-form-item>
        <a-form-item label="起止日期" required name="date1">
          <a-range-picker v-model:value="formState.date1" show-time type="date" style="width: 100%" />
        </a-form-item>
        <a-form-item label="目标描述" name="desc">
          <a-textarea v-model:value="formState.desc" placeholder="请输入你的阶段性工作目标" />
        </a-form-item>
        <a-form-item label="衡量标准" name="desc1">
          <a-textarea v-model:value="formState.desc1" placeholder="请输入衡量标准" />
        </a-form-item>
        <a-form-item name="customer">
          <template #label>
            <div>客户<span style="color: rgba(0,0,0,.45);">（选填）<InfoCircleOutlined /></span></div>
          </template>
          <a-input v-model:value="formState.customer" placeholder="请描述你服务的客户，内部客户直接 @姓名／工号" />
        </a-form-item>
        <a-form-item name="reviewers">
          <template #label>
            <div>邀评人<span style="color: rgba(0,0,0,.45);">（选填）<InfoCircleOutlined /></span></div>
          </template>
          <a-input v-model:value="formState.reviewers" placeholder="请直接 @姓名／工号，最多可邀请 5 人" />
        </a-form-item>
        <a-form-item name="weight">
          <template #label>
            <div>权重<span style="color: rgba(0,0,0,.45);">（选填）<InfoCircleOutlined /></span></div>
          </template>
          <a-input-number v-model:value="formState.weight" placeholder="请输入" /> %
        </a-form-item>
        <a-form-item label="目标公开" name="type">
          <a-radio-group v-model:value="formState.type">
            <a-radio :value="1">公开</a-radio>
            <a-radio :value="2">部分公开</a-radio>
            <a-radio :value="3">不公开</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onSubmit">提交</a-button>
          <a-button style="margin-left: 10px" @click="resetForm">保存</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </page-header-wrapper>
</template>
<script lang="ts">
import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";
import { Moment } from "moment";
import { defineComponent, reactive, ref, toRaw, UnwrapRef } from "vue";

import { PageHeaderWrapper } from '@/layout/PageHeaderWrapper';

interface FormState {
  name: string;
  region: string | undefined;
  date1: Moment | undefined;
  delivery: boolean;
  type: string[];
  resource: string;
  desc: string;
  customer: string;
  reviewers: string;
  weight: string;
  desc1: string;
}

export default defineComponent({
  components: {
    PageHeaderWrapper
  },
  setup() {
    const formRef = ref();
    const formState: UnwrapRef<FormState> = reactive({
      name: "",
      region: undefined,
      date1: undefined,
      delivery: false,
      type: [],
      resource: "",
      desc: "",
      customer: "",
      reviewers: "",
      weight: "",
      desc1: "",
    });
    const rules = {
      name: [
        {
          required: true,
          message: "Please input Activity name",
          trigger: "blur",
        },
        { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
      ],
      region: [
        {
          required: true,
          message: "Please select Activity zone",
          trigger: "change",
        },
      ],
      date1: [
        {
          required: true,
          message: "Please pick a date",
          trigger: "change",
          type: "object",
        },
      ],
      type: [
        {
          type: "array",
          required: true,
          message: "Please select at least one activity type",
          trigger: "change",
        },
      ],
      resource: [
        {
          required: true,
          message: "Please select activity resource",
          trigger: "change",
        },
      ],
      desc: [
        {
          required: true,
          message: "Please input activity form",
          trigger: "blur",
        },
      ],
    };
    const onSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          console.log("values", formState, toRaw(formState));
        })
        .catch((error: ValidateErrorEntity<FormState>) => {
          console.log("error", error);
        });
    };
    const resetForm = () => {
      formRef.value.resetFields();
    };
    return {
      formRef,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: "",
      formState,
      rules,
      onSubmit,
      resetForm,
    };
  },
});
</script>

<style scoped>
</style>

