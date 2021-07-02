<template>
  <a-form @submit="handleSubmit" :model="formState" :rules="rules" class="form" ref="formRef">
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="仓库名" name="name">
          <a-input placeholder="请输入仓库名称" v-model:value="formState.name"/>
        </a-form-item>
      </a-col>
      <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
        <a-form-item label="仓库域名" name="url">
          <a-input addonBefore="http://" addonAfter=".com" placeholder="请输入" v-model:value="formState.url" />
        </a-form-item>
      </a-col>
      <a-col :xl="{ span: 9, offset: 1 }" :lg="{ span: 10 }" :md="{ span: 24 }" :sm="24">
        <a-form-item label="仓库管理员" name="owner">
          <a-select placeholder="请选择管理员" v-model:value="formState.owner">
            <a-select-option value="王同学">王同学</a-select-option>
            <a-select-option value="李同学">李同学</a-select-option>
            <a-select-option value="黄同学">黄同学</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="审批人" name="approver">
          <a-select placeholder="请选择审批员" v-model:value="formState.approver">
            <a-select-option value="王晓丽">王晓丽</a-select-option>
            <a-select-option value="李军">李军</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :xl="{ span: 7, offset: 1 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
        <a-form-item label="生效日期" name="dateRange">
          <a-range-picker v-model:value="formState.dateRange" style="width: 100%" />
        </a-form-item>
      </a-col>
      <a-col :xl="{ span: 9, offset: 1 }" :lg="{ span: 10 }" :md="{ span: 24 }" :sm="24">
        <a-form-item name="type" label="仓库类型">
          <a-select v-model:value="formState.type" placeholder="请选择仓库类型">
            <a-select-option value="公开">公开</a-select-option>
            <a-select-option value="私密">私密</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item v-if="showSubmit">
      <a-button htmlType="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, UnwrapRef, PropType } from "vue";
import { notification } from 'ant-design-vue';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';

import { IRepositoryForm } from './form.interface';


export default defineComponent({
  name: "RepositoryForm",
  props: {
    showSubmit: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  setup() {
    const formRef = ref();
    const formState: UnwrapRef<IRepositoryForm> = reactive({
      name: "",
      url: "",
      owner: "",
      approver: "",
      dateRange: undefined,
      type: "",
    });
    const validate = (rule: any, value: any, callback: Function) => {
      const regex = /^user-(.*)$/;
      if (!regex.test(value)) {
				return Promise.reject("请输入仓库域名, 需要以 user- 开头")
        // callback(new Error("需要以 user- 开头"));
      }
			return Promise.resolve()
      // callback();
    };
    const rules = reactive({
      name: [{ required: true, message: "请输入仓库名称", whitespace: true }],
      url: [{ required: true, whitespace: true, validator: validate }],
      owner: [{ required: true, message: "请选择管理员" }],
      approver: [{ required: true, message: "请选择审批员" }],
      // dateRange: [{ required: true, message: "请选择生效日期", type: 'object' }],
      type: [{ required: true, message: "请选择仓库类型" }],
    });

    const handleSubmit = (e: Event) => {
      e.preventDefault();
			formRef.value.validate().then(() => {

			}).catch((err: ValidateErrorEntity<IRepositoryForm>) => {
				notification['error']({
					message: 'Received values of form:',
					description: formState
				})
			})
      
    };
    return {
			formRef,
      formState,
      rules,
      handleSubmit,
    };
  },
});
</script>

<style scoped>
</style>