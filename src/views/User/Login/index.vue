<template>
  <div class="login">
    <a-alert message="错误的用户名和密码（admin/ant.design)" type="error" show-icon style="margin-bottom: 24px;" v-if="error" />
    <a-form layout="horizontal" :model="formState" :rules="rules" @finish="handleFinish" @finishFailed="handleFinishFailed">
      <a-form-item name="userName">
        <a-input v-model:value="formState.userName" placeholder="Username">
          <template #prefix>
            <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item name="password">
        <a-input v-model:value="formState.password" type="password" placeholder="Password">
          <template #prefix>
            <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button style="width: 100%;" :loading="confirmLoading" type="primary" html-type="submit">
          Log in
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts">
import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";
import { defineComponent, reactive, toRaw, UnwrapRef } from "vue";
import { useRouter } from 'vue-router';
import { useState } from "@/store";

import { FormState, Login } from "./server";

export default defineComponent({
  setup() {
    const router = useRouter()
    const { action, state } = useState()
    // action.updateToken('xxxxx')
    // console.log(action, state)
    const formState: UnwrapRef<FormState> = reactive({
      autoLogin: true,
      type: "account",
      userName: "admin",
      password: "ant.design",
    });
    const confirm: UnwrapRef<{confirmLoading: boolean; error: boolean}> = reactive({
      confirmLoading: false,
      error: false,
    })

    const rules = {
      userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
      password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
    };
    const handleFinish = () => {
      confirm.confirmLoading = true
      confirm.error = false
      Login(formState).then(value => {
        confirm.confirmLoading = false
        if (value.status === 'error') {
          confirm.error = true
          return
        } else {
          action.updateUser(value)
          action.updateToken(value.currentAuthority)
        }
      }).then(_ => {
        router.push({ path: "/" }).catch(() => {});
      })
    };
    const handleFinishFailed = (errors: ValidateErrorEntity<FormState>) => {
      console.log(errors);
    };
    return {
      formState,
      rules,
      ...toRaw(confirm),
      handleFinish,
      handleFinishFailed,
    };
  },
});
</script>

<style scoped>
.login {
  width: 328px;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  position: absolute;
  top: 50%;
  left: 50%;
}
</style>
