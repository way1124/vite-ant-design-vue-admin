<template>
  <a-modal title="新建规则" :visible="visible" :confirm-loading="confirmLoading" @ok="ok" @cancel="cancel">
    <a-form layout="vertical" ref="formRef" :model="model" :rules="rules">
      <a-form-item label="规则名称" name="name">
        <a-input v-model:value="model.name" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="描述">
        <a-textarea v-model:value="model.desc" placeholder="请输入" :rows="4" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs, ref, toRaw } from 'vue'
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';

import { Result } from '../data';

export interface ICreateFormProps {
  visible: boolean;
  confirmLoading: boolean;
  model: Result;
  ok: () => void;
  cancel: () => void;
}

const rules = {
  name: [
    { required: true, message: '规则名称为必填项', trigger: 'blur' },
  ],
};

export default defineComponent({
  props: {
    modelProps: {
      type: Object as PropType<ICreateFormProps>,
      required: true,
    }
  },
  setup(props) {
    const formRef = ref();

    const ok = () => {
      props.modelProps.confirmLoading = true
      formRef.value
        .validate()
        .then(() => props.modelProps.ok())
        .catch((error: ValidateErrorEntity<Result>) => {
          props.modelProps.confirmLoading = false
          console.log('error', error);
        });
    }
    
    return {
      formRef,
      ...toRefs(props.modelProps),
      rules,
      ok,
    }
  },
})
</script>

