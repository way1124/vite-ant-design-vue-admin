<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
      <a-col :md="24" :lg="7">
        <a-card :bordered="false">
          <div class="account-center-avatarHolder">
            <div class="avatar">
              <img :src="userInfo.avatar">
            </div>
            <div class="username">{{ userInfo.name }}</div>
            <div class="bio">{{userInfo.signature}}</div>
          </div>
          <div class="account-center-detail">
            <p><i class="title"></i>{{userInfo.title}}</p>
            <p><i class="group"></i>{{userInfo.group}}</p>
            <p>
              <i class="address"></i>
              <span v-for="item in Object.values(userInfo.geographic)" :key="item.key">{{item.label}}</span>
            </p>
          </div>
          <a-divider/>

          <div class="account-center-tags">
            <div class="tagsTitle">标签</div>
            <div>
              <span v-for="(tag, index) in userInfo.tags" :key="index">
                <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                  <a-tag :closable="index !== 0" :close="() => handleTagClose(tag)">{{ `${tag.slice(0, 20)}...` }}</a-tag>
                </a-tooltip>
                <a-tag v-else :closable="index !== 0" :close="() => handleTagClose(tag)">{{ tag.label }}</a-tag>
              </span>
              <a-input v-if="team.tagInputVisible" ref="tagInput" type="text" size="small" :style="{ width: '78px' }" :value="team.tagInputValue" @change="handleInputChange" @blur="handleTagInputConfirm" @keyup.enter="handleTagInputConfirm" />
              <a-tag v-else @click="showTagInput" style="background: #fff; borderStyle: dashed;">
                <PlusOutlined />New Tag
              </a-tag>
            </div>
          </div>
          <a-divider :dashed="true"/>

          <div class="account-center-team">
            <div class="teamTitle">团队</div>
            <a-spin :spinning="team.teamSpinning">
              <div class="members">
                <a-row>
                  <a-col :span="12" v-for="(item, index) in userInfo.notice" :key="index">
                    <a>
                      <a-avatar size="small" :src="item.logo"/>
                      <span class="member">{{ item.member }}</span>
                    </a>
                  </a-col>
                </a-row>
              </div>
            </a-spin>
          </div>
        </a-card>
      </a-col>
      <a-col :md="24" :lg="17">
        <a-card
          style="width:100%"
          :bordered="false"
          :tabList="tabListNoTitle"
          :activeTabKey="team.noTitleKey"
          @tabChange="handleTabChange"
        >
          <article-page v-if="team.noTitleKey === 'article'"></article-page>
          <app-page v-if="team.noTitleKey === 'app'"></app-page>
          <project-page v-if="team.noTitleKey === 'project'"></project-page>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRaw, nextTick } from 'vue';
import { AppPage, ArticlePage, ProjectPage } from './page'

import { get } from "@/utils/request";

type TypeItem = {
  key: string;
  label: string;
}
type Geographic = {
  city: TypeItem;
  province: TypeItem;
}

type INotice = {
  description: string;
  href: string;
  id: string;
  logo: string;
  member: string;
  memberLink: string;
  title: string;
  updatedAt: string;
}
interface IUserInfo {
  address: string;
  avatar: string;
  country: string;
  email: string;
  geographic: Geographic;
  group: string;
  name: string;
  notice: INotice[];
  notifyCount: number;
  phone: string;
  signature: string;
  tags: TypeItem[];
  title: string;
  unreadCount: number;
  userid: string;
}

const defaultIUserInfo: IUserInfo = {
  address: "",
  avatar: "",
  country: "",
  email: "",
  geographic: {
    city: {
      key: '',
      label: '',
    },
    province: {
      key: '',
      label: '',
    },
  },
  group: "",
  name: "",
  notice: [],
  notifyCount: 0,
  phone: "",
  signature: "",
  tags: [],
  title: "",
  unreadCount: 0,
  userid: "",
}

const tabListNoTitle = [
  {
    key: 'article',
    tab: '文章(8)'
  },
  {
    key: 'app',
    tab: '应用(8)'
  },
  {
    key: 'project',
    tab: '项目(8)'
  }
]

export default defineComponent({
  components: {
    AppPage,
    ArticlePage,
    ProjectPage
  },
  setup() {
    const tagInput = ref()
    const userInfo = ref<IUserInfo>(defaultIUserInfo)
    const team = reactive({
      tagInputVisible: false,
      teamSpinning: false,
      tagInputValue: '',
      noTitleKey: 'app'
    })

    const getUserInfo = () => {
      team.teamSpinning = true
      get<IUserInfo>('/api/currentUser').then(r => {
        userInfo.value = r
        team.teamSpinning = false
      })
    }
    onMounted(getUserInfo)

    const handleTabChange = (key: string) => {
      team.noTitleKey = key
    }
    const handleTagClose = (removeTag: TypeItem) => {
      const tags = userInfo.value.tags.filter(tag => tag !== removeTag)
      userInfo.value.tags = tags
    }
    const showTagInput = () => {
      team.tagInputVisible = true
      nextTick(() => {
        if (tagInput.value) {
          tagInput.value.focus()
        }
      })
    }
    const handleInputChange = (e: InputEvent) => {
      team.tagInputValue = (e.target as any).value
    }
    const handleTagInputConfirm = () => {
      const inputValue: TypeItem = {
        key: team.tagInputValue,
        label: team.tagInputValue,
      }
      let tags = userInfo.value.tags
      if (inputValue && !tags.map(r => JSON.stringify(r)).includes(JSON.stringify(inputValue))) {
        tags = [...tags, inputValue]
      }
      userInfo.value.tags = tags
      team.tagInputVisible = false
      team.tagInputValue = ''
    }
    
    return {
      tagInput,
      team,
      userInfo,
      tabListNoTitle,
      handleTabChange,
      handleTagClose,
      showTagInput,
      handleInputChange,
      handleTagInputConfirm,
    }
  }
  // data () {
  //   return {
  //     tags: ['很有想法的', '专注设计', '辣~', '大长腿', '川妹子', '海纳百川'],
  //     tagInputVisible: false,
  //     tagInputValue: '',
  //     teams: [],
  //     teamSpinning: true,
  //     tabListNoTitle: [
  //       {
  //         key: 'article',
  //         tab: '文章(8)'
  //       },
  //       {
  //         key: 'app',
  //         tab: '应用(8)'
  //       },
  //       {
  //         key: 'project',
  //         tab: '项目(8)'
  //       }
  //     ],
  //     noTitleKey: 'app'
  //   }
  // },
  // mounted () {
  //   this.getTeams()
  // },
})
</script>

<style lang="less" scoped>
.page-header-wrapper-grid-content-main {
  width: 100%;
  // height: 100%;
  min-height: 100%;
  transition: 0.3s;
  .account-center-avatarHolder {
    text-align: center;
    margin-bottom: 24px;
    & > .avatar {
      margin: 0 auto;
      width: 104px;
      height: 104px;
      margin-bottom: 20px;
      border-radius: 50%;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
      }
    }
    .username {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      margin-bottom: 4px;
    }
  }
  .account-center-detail {
    p {
      margin-bottom: 8px;
      padding-left: 26px;
      position: relative;
    }
    i {
      position: absolute;
      height: 14px;
      width: 14px;
      left: 0;
      top: 4px;
      background: url(https://gw.alipayobjects.com/zos/rmsportal/pBjWzVAHnOOtAUvZmZfy.svg);
    }
    .title {
      background-position: 0 0;
    }
    .group {
      background-position: 0 -22px;
    }
    .address {
      background-position: 0 -44px;
    }
  }
  .account-center-tags {
    .ant-tag {
      margin-bottom: 8px;
    }
  }
  .account-center-team {
    .members {
      a {
        display: block;
        margin: 12px 0;
        line-height: 24px;
        height: 24px;
        .member {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
          line-height: 24px;
          max-width: 100px;
          vertical-align: top;
          margin-left: 12px;
          transition: all 0.3s;
          display: inline-block;
        }
        &:hover {
          span {
            color: #1890ff;
          }
        }
      }
    }
  }
  .tagsTitle,
  .teamTitle {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 12px;
  }
}
</style>