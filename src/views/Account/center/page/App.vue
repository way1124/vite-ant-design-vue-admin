<template>
  <div class="app-list">
    <a-list
      :grid="{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }"
      :dataSource="dataSource"
    >
      <template #renderItem="{ item }">
        <a-list-item :key="item.title">
          <a-card :hoverable="true">
            <a-card-meta>
              <template #title>
                <div style="margin-bottom: 3px">{{ item.title }}</div>
              </template>
              <template #avatar>
                <a-avatar class="card-avatar" :src="item.avatar" size="small" />
              </template>
              <template #description>
                <div class="meta-cardInfo">
                  <div>
                    <p>活跃用户</p>
                    <p>
                      <span>{{ item.activeUser }}<span>万</span></span>
                    </p>
                  </div>
                  <div>
                    <p>新增用户</p>
                    <p>{{ NumberFormat(item.newUser) }}</p>
                  </div>
                </div>
              </template>
            </a-card-meta>
            <template class="ant-card-actions" #actions>
              <a>
                <a-icon type="download" />
              </a>
              <a>
                <a-icon type="edit" />
              </a>
              <a>
                <a-icon type="share-alt" />
              </a>
              <a>
                <a-dropdown>
                  <a class="ant-dropdown-link" href="javascript:;">
                    <a-icon type="ellipsis" />
                  </a>
                  <template v-slot:overlay>
                    <a-menu>
                      <a-menu-item>
                        <a href="javascript:;">1st menu item</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a href="javascript:;">2nd menu item</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a href="javascript:;">3rd menu item</a>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a>
            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

function NumberFormat(value: number) {
  if (!value) {
    return "0";
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); // 将整数部分逢三一断
  return intPartFormat;
}

type ISource = {
  title: string;
  avatar: string;
  activeUser: number;
  newUser: number;
};
const dataSource: ISource[] = [];
for (let i = 0; i < 11; i++) {
  dataSource.push({
    title: "Alipay",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
    activeUser: 17,
    newUser: 1700,
  });
}

export default defineComponent({
  name: "Article",
  setup() {
    return {
      dataSource,
      NumberFormat,
    };
  },
});
</script>

<style lang="less" scoped>
.app-list {
  .meta-cardInfo {
    zoom: 1;
    margin-top: 16px;

    > div {
      position: relative;
      text-align: left;
      float: left;
      width: 50%;

      p {
        line-height: 32px;
        font-size: 24px;
        margin: 0;

        &:first-child {
          color: rgba(0, 0, 0, 0.45);
          font-size: 12px;
          line-height: 20px;
          margin-bottom: 4px;
        }
      }
    }
  }
}
</style>
