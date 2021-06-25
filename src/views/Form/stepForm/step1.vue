<template>
  <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" style="max-width: 500px; margin: 40px auto 0">
		<a-form-item label="付款账户">
			<a-select v-model:value="formState.paymentUser" style="width: 100%">
				<a-select-option value="1">ant-design@alipay.com</a-select-option>
				<a-select-option value="2">ant-design@wexinpay.com</a-select-option>
			</a-select>
		</a-form-item>
		<a-form-item label="收款账户">
			<a-input-group compact>
				<a-select v-model:value="formState.pay" style="width: 100px;">
					<a-select-option value="wexinpay">微信</a-select-option>
					<a-select-option value="alipay">支付宝</a-select-option>
					<a-select-option value="cardpay">银行账户</a-select-option>
				</a-select>
				<a-input v-model:value="formState.payType" style="width: calc(100% - 100px);" placeholder="请输入收款人账户" />
			</a-input-group>
		</a-form-item>
		<a-form-item label="收款人姓名">
			<a-input v-model:value="formState.name" placeholder="请输入收款人姓名" />
		</a-form-item>
		<a-form-item label="转账金额">
			<a-input v-model:value="formState.momey" prefix="￥" placeholder="请输入转账金额" />
		</a-form-item>
		<a-form-item :wrapper-col="{span: 19, offset: 5}">
			<a-button type="primary" @click="Next">下一步</a-button>
		</a-form-item>
  </a-form>
	 <a-divider />
	<div class="step-form-style-desc">
		<h3>说明</h3>
		<h4>转账到支付宝账户</h4>
		<p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
		<h4>转账到银行卡</h4>
		<p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
	</div>
</template>

<script lang="ts">
import { defineComponent, UnwrapRef, reactive } from "vue";

type IFormState = {
  paymentUser: string;
  pay: string;
  payType: string;
  name: string;
  momey: string;
};

export default defineComponent({
	name: 'StepFormStep1',
	emits: ["click"],
	setup(_, ctx) {
		const formState: UnwrapRef<IFormState> = reactive({
      paymentUser: "1",
      pay: "微信",
      payType: 'test@example.com',
      name: 'Vexth',
      momey: "500",
    });

		const Next = () => {
			ctx.emit("click", 1)
		}

    return {
      formState,
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
			Next,
    };
	},
})
</script>

<style lang="less" scoped>
.step-form-style-desc {
  padding: 0 56px;
  color: rgba(0,0,0,.45);
  h3 {
    margin: 0 0 12px;
    color: rgba(0,0,0,.45);
    font-size: 16px;
    line-height: 32px;
  }
  h4 {
    margin: 0 0 4px;
    color: rgba(0,0,0,.45);
    font-size: 14px;
    line-height: 22px;
  }
  p {
    margin-top: 0;
    margin-bottom: 12px;
    line-height: 22px;
  }
}
</style>

