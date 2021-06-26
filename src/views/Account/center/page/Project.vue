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

import { IProject } from '../center.interface';
import { getFakeList } from '../server';

export default defineComponent({
  name: "ProjectPage",
  setup() {
    const data = ref<IProject[]>([]);
    const getList = () => {
      getFakeList<IProject[]>().then((r) => (data.value = r));
    };

    onMounted(getList);

    return { data };
  },
});
</script>
