<template>
  <div>
    <a-button type="primary" @click="showModal">Open Modal</a-button>
    <a-modal v-model:visible="visible" title="Basic Modal" @ok="handleOk">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";


import { useState } from "@/store";

import { get } from "@/utils/request";

export default defineComponent({
  setup() {
    const { state, action } = useState();
    const visible = ref<boolean>(false);

    // get('/api/list').then(r => console.log(r))

    const showModal = () => {
      action.updateUser({ status: "ok", type: "account", currentAuthority: "admin" });
      visible.value = true;
    };

    const handleOk = (e: MouseEvent) => {
      console.log(e);
      visible.value = false;
    };
    return {
      visible,
      showModal,
      handleOk,
    };
  },
});
</script>
