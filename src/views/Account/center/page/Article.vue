<template>
  <a-list
    size="large"
    rowKey="id"
    :loading="loading"
    itemLayout="vertical"
    :dataSource="data"
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
import { defineComponent } from 'vue';
import { ArticleListContent } from "@/components/ArticleListContent";
import IconText from "./IconText.vue";

import { IArticle } from '../center.interface';
import { useServer } from '../use.server';

export default defineComponent({
  name: "ArticlePage",
  components: {
    IconText,
    ArticleListContent,
  },
  setup() {
    const { data, loading } = useServer<IArticle[]>()

    return {
      data,
      loading,
    }
  },
});
</script>

<style scoped></style>
