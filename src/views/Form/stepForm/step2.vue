<template>
  <div>
    <a-form ref="formRef" :model="form" :rules="rulesRef" style="max-width: 500px; margin: 40px auto 0">
      <a-alert :closable="true" message="确认转账后，资金将直接打入对方账户，无法退回。" style="margin-bottom: 24px" />
      <a-form-item label="付款账户" :labelCol="labelCol" :wrapperCol="wrapperCol" class="stepFormText">
        ant-design@alipay.com
      </a-form-item>
      <a-form-item label="收款账户" :labelCol="labelCol" :wrapperCol="wrapperCol" class="stepFormText">
        test@example.com
      </a-form-item>
      <a-form-item label="收款人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" class="stepFormText">
        Alex
      </a-form-item>
      <a-form-item label="转账金额" :labelCol="labelCol" :wrapperCol="wrapperCol" class="stepFormText">
        ￥ 5,000.00
      </a-form-item>
      <a-divider />
      <a-form-item label="支付密码" name="password" :labelCol="labelCol" :wrapperCol="wrapperCol" class="stepFormText">
        <a-input v-model:value="form.password" type="password" style="width: 80%" />
      </a-form-item>
      <a-form-item :wrapperCol="{ span: 19, offset: 5 }">
        <a-button :loading="loading" type="primary" @click="nextStep">提交</a-button>
        <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from 'vue';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';

export default defineComponent({
  name: "StepFormStep2",
	emits: ['click'],
	setup(_, ctx) {
		const formRef = ref();
		const form = reactive({
			loading: false,
			form: {
				password: '123456'
			}
		})

		const rulesRef = reactive({
			password: [
        {
          required: true,
          message: '需要支付密码才能进行支付',
        },
      ]
		})

		const prevStep = () => {
			ctx.emit('click', 0)
		}
		const nextStep = () => {
			form.loading = true
			formRef.value.validate()
        .then(() => {
					setTimeout(() => {
						form.loading = false
						console.log('values', form.form);
						ctx.emit('click', 1)
					} ,3000)
          
        })
        .catch((error: ValidateErrorEntity<any>) => {
          console.log('error', error);
        });
		}
		return {
			...toRefs(form),
			rulesRef,
			formRef,
			labelCol: { lg: { span: 5 }, sm: { span: 5 } },
			wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
			prevStep,
			nextStep,
		}
	}
});
</script>

<style lang="less" scoped>
.stepFormText {
  margin-bottom: 24px;
  .ant-form-item-label,
  .ant-form-item-control {
    line-height: 22px;
  }
}
</style>