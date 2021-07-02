<template>
  <a-list
    :grid="{ gutter: 24, lg: 4, md: 3, sm: 2, xs: 1 }"
    :dataSource="data"
    :loading="loading"
  >
    <template #renderItem="{ item }">
      <a-list-item :key="item.title">
        <a-card hoverable>
          <template #cover>
            <img alt="example" :src="item.cover" />
          </template>
          <a-card-meta :title="item.title" :description="item.subDescription" />
        </a-card>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { IProject } from '../center.interface';
import { useServer } from '../use.server';

export default defineComponent({
  name: "ProjectPage",
  setup() {
    const { data, loading } = useServer<IProject[]>();

    return { data, loading };
  },
});
</script>
