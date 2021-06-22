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
          <icon-text type="star-o" :text="item.star" />
          <icon-text type="like-o" :text="item.like" />
          <icon-text type="message" :text="item.message" />
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
    <template #footer>
      <div v-if="data.length > 0" style="text-align: center; margin-top: 16px">
        <a-button @click="loadMore" :loading="loadingMore">加载更多</a-button>
      </div>
    </template>
  </a-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ArticleListContent from "@/components/ArticleListContent";
import IconText from "./IconText.vue";

import { get } from "@/utils/request";

interface IArticle {
  id: number;
  description: string;
  owner: string;
  avatar: string;
  href: string;
  updatedAt: string;
  star: string;
  like: string;
  message: string;
  title: string;
}

const dataSource: IArticle[] = [];
for (let i = 0; i < 11; i++) {
  dataSource.push({
    // title: "Alipay",
    // avatar:
    //   "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
    // activeUser: 17,
    // newUser: 1700,
    id: i,
    description: "string;",
    owner: "string;",
    avatar: "string;",
    href: "string;",
    updatedAt: "string;",
    star: "string;",
    like: "string;",
    message: "string;",
    title: "string;",
  });
}

export default defineComponent({
  name: "Article",
  components: {
    IconText,
    ArticleListContent,
  },
  setup() {
    return {
      loading: true,
      loadingMore: false,
      data: dataSource,
    }
  },
});
</script>

<style scoped></style>
