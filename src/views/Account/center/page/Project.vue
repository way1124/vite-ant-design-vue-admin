<template>
  <a-row :gutter="[16, 16]">
    <a-col :span="6" v-for="item in data" :key="item.id">
      <a-card hoverable>
        <template #cover>
          <img alt="example" :src="item.cover" />
        </template>
        <a-card-meta :title="item.title" :description="item.subDescription"></a-card-meta>
      </a-card>
    </a-col>
  </a-row>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { get } from "@/utils/request";

interface IProject {}

export default defineComponent({
  name: "ProjectPage",
  setup() {
    const data = ref([]);
    const getFakeList = () => {
      get("/api/fake_list").then((r) => {
        data.value = r as any;
      });
    };

    onMounted(getFakeList);

    return {
      data,
    };
  },
});
</script>
