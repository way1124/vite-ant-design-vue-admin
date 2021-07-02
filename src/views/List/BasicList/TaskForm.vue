<template>
  <a-form @submit="handleSubmit" :model="formState" :rules="rules" ref="formRef">
    <a-form-item label="任务名称" :labelCol="labelCol" :wrapperCol="wrapperCol" name="title">
      <a-input v-model:value="formState.title" />
    </a-form-item>
    <a-form-item label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol" name="startAt">
      <a-date-picker style="width: 100%" format="YYYY-MM-DD HH:mm" v-model:value="formState.startAt" />
    </a-form-item>
    <a-form-item label="任务负责人" :labelCol="labelCol" :wrapperCol="wrapperCol" name="owner">
      <a-select v-model:value="formState.owner">
        <a-select-option value="0">付晓晓</a-select-option>
        <a-select-option value="1">周毛毛</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="产品描述" :labelCol="labelCol" :wrapperCol="wrapperCol" name="description">
      <a-textarea v-model:value="formState.description"></a-textarea>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import moment, { Moment } from 'moment';
import { defineComponent, PropType, reactive, ref, toRaw, watch } from 'vue';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';

export interface IRecord {
	title: string;
	startAt: Moment | undefined;
	owner: string;
	description: string;
}

export default defineComponent({
  name: 'TaskForm',
  props: {
    record: {
      type: Object as PropType<IRecord>,
      default: null
    }
  },
	setup(props) {

		const formRef = ref()
		const formState = reactive({
			title: props.record.title,
			startAt: props.record.startAt,
			owner: props.record.owner,
			description: props.record.description,
		})

		const rules = {
			title: [{required: true, message: '请输入任务名称'}],
			startAt: [{required: true, message: '请选择开始时间', type: 'object'}],
			owner: [{required: true, message: '请选择任务负责人'}],
		}

		watch(() => props.record, value => {
			formState.title = value.title || ''
			formState.startAt = value.startAt || undefined
			formState.owner = value.owner || ''
			formState.description = value.description || ''
		})

    const handleSubmit = () => {
			return new Promise((resolve, reject) => {
				formRef.value
					.validate()
					.then((value: IRecord) => resolve(value))
					.catch((error: ValidateErrorEntity<IRecord>) => reject(error));
			})
			
    }

		return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
			formRef,
      formState,
			rules,
			handleSubmit,
    }
	}
})
</script>