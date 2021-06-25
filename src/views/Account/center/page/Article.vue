<template>
  <a-list
    size="large"
    rowKey="id"
    :loading="state.loading"
    itemLayout="vertical"
    :dataSource="state.data"
  >
    <template #renderItem="{ item }">
      <a-list-item :key="item.id">
        <template #actions>
          <icon-text type="StarOutlined" :text="item.star" />
          <icon-text type="LikeOutlined" :text="item.like" />
          <icon-text type="MessageOutlined" :text="item.message" />
        </template>
        <a-list-item-meta>
          <template #title>
            <a href="https://vue.ant.design/">{{ item.title }}</a>
          </template>
          <template #description>
            <span>
              <a-tag>Ant Design</a-tag>
              <a-tag>设计语言</a-tag>
              <a-tag>蚂蚁金服</a-tag>
            </span>
          </template>
        </a-list-item-meta>
        <article-list-content
          :description="item.description"
          :owner="item.owner"
          :avatar="item.avatar"
          :href="item.href"
          :updateAt="item.updatedAt"
        />
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRaw } from 'vue';
import { ArticleListContent } from "@/components/ArticleListContent";
import IconText from "./IconText.vue";
import { IArticle } from './types';

import { get } from "@/utils/request";

interface IState {
  loading: boolean;
  loadingMore: boolean;
  data: IArticle[];
}

export default defineComponent({
  name: "ArticlePage",
  components: {
    IconText,
    ArticleListContent,
  },
  setup() {
    const state = reactive<IState>({
      loading: true,
      loadingMore: false,
      data: [],
    })

    const getFakeList = () => {
      get<IArticle[]>('/api/fake_list').then(r => {
        state.data = r
        state.loading = false
      })
    }

    onMounted(getFakeList)

    return {
      state
    }
  },
});
</script>

<style scoped></style>
