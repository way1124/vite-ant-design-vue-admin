<template>
  <a-row :gutter="[16, 16]">
    <a-col :span="6" v-for="item in data" :key="item.id">
      <a-card hoverable>
        <template #cover>
          <img alt="example" :src="item.cover" />
        </template>
        <a-card-meta :title="item.title" :description="item.subDescription" />
      </a-card>
    </a-col>
  </a-row>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { get } from "@/utils/request";

import { IProject } from "./types";

export default defineComponent({
  name: "ProjectPage",
  setup() {
    const data = ref<IProject[]>([]);
    const getFakeList = () => {
      get<IProject[]>("/api/fake_list").then((r) => (data.value = r));
    };

    onMounted(getFakeList);

    return { data };
  },
});
</script>
