<template>
  <page-header-wrapper content="">
    <a-card :bordered="false">
      <a-row>
        <a-col :sm="8" :xs="24">
          <info title="我的待办" value="8个任务" :bordered="true" />
        </a-col>
        <a-col :sm="8" :xs="24">
          <info title="本周任务平均处理时间" value="32分钟" :bordered="true" />
        </a-col>
        <a-col :sm="8" :xs="24">
          <info title="本周完成任务数" value="24个" />
        </a-col>
      </a-row>
    </a-card>

    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="标准列表">

      <template #extra>
        <a-radio-group v-model="status">
          <a-radio-button value="all">全部</a-radio-button>
          <a-radio-button value="processing">进行中</a-radio-button>
          <a-radio-button value="waiting">等待中</a-radio-button>
        </a-radio-group>
        <a-input-search style="margin-left: 16px; width: 272px;" />
      </template>

      <div class="operate">
        <a-button type="dashed" style="width: 100%" @click="add"><PlusOutlined />添加</a-button>
      </div>

      <a-list size="large" :pagination="{showSizeChanger: true, showQuickJumper: true, pageSize: 5, total: 50}">
        <a-list-item :key="index" v-for="(item, index) in data">
          <a-list-item-meta :description="item.description">
						<template #avatar><a-avatar size="large" shape="square" :src="item.avatar"/></template>
						<template #title><a>{{ item.title }}</a></template>
          </a-list-item-meta>
          <template #actions>
            <a @click="edit(item)">编辑</a>
						<a-dropdown>
							<template #overlay>
								<a-menu>
									<a-menu-item><a>编辑</a></a-menu-item>
									<a-menu-item><a>删除</a></a-menu-item>
								</a-menu>
							</template>
              <a>更多<DownOutlined /></a>
            </a-dropdown>
          </template>
          <div class="list-content">
            <div class="list-content-item">
              <span>Owner</span>
              <p>{{ item.owner }}</p>
            </div>
            <div class="list-content-item">
              <span>开始时间</span>
              <p>{{ item.startAt }}</p>
            </div>
            <div class="list-content-item">
              <a-progress :percent="item.progress.value" :status="!item.progress.status ? null : item.progress.status" style="width: 180px" />
            </div>
          </div>
        </a-list-item>
      </a-list>
    </a-card>
		<a-modal v-model:visible="visible" :title="title" @ok="handleOk" @cancel="handleCancel">
			<template #footer>
        <a-button key="back" @click="handleCancel">Return</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">Submit</a-button>
      </template>
      <task-form :record="record" ref="taskForm" />
    </a-modal>
  </page-header-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'

import { PageHeaderWrapper } from '@/layout/PageHeaderWrapper';

import Info from './Info.vue';
import TaskForm from './TaskForm.vue';

const data: any[] = []
data.push({
  title: 'Alipay',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
  description: '那是一种内在的东西， 他们到达不了，也无法触及的',
  owner: '付晓晓',
  startAt: '2018-07-26 22:44',
  progress: {
    value: 90
  }
})
data.push({
  title: 'Angular',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
  description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
  owner: '曲丽丽',
  startAt: '2018-07-26 22:44',
  progress: {
    value: 54
  }
})
data.push({
  title: 'Ant Design',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
  description: '生命就像一盒巧克力，结果往往出人意料',
  owner: '林东东',
  startAt: '2018-07-26 22:44',
  progress: {
    value: 66
  }
})
data.push({
  title: 'Ant Design Pro',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
  owner: '周星星',
  startAt: '2018-07-26 22:44',
  progress: {
    value: 30
  }
})
data.push({
  title: 'Bootstrap',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
  description: '那时候我只会想自己想要什么，从不想自己拥有什么',
  owner: '吴加好',
  startAt: '2018-07-26 22:44',
  progress: {
    status: 'exception',
    value: 100
  }
})

export default defineComponent({
	components: {
    PageHeaderWrapper,
		Info,
		TaskForm,
  },
	setup() {
		const taskForm = ref()
		const basicListState = reactive({
			data,
			status: 'all',
			visible: false,
			loading: false,
			title: '',
			record: {}
		})
		const handleOk = () => {
			taskForm.value.handleSubmit().then((value: any) => {
				console.log(value)
				basicListState.loading = true
				setTimeout(() => {
					basicListState.loading = false
					handleCancel()
				}, 1000)
			}).catch((error: any) => {
				console.log(error)
			})
		}
		const add = () => {
			basicListState.title = '新增'
			basicListState.visible = true
			basicListState.record = {}
    }

		const edit = (record: any) => {
      console.log('record', record)
			basicListState.visible = true
			basicListState.record = record
			basicListState.title = '操作'
    }
		const handleCancel = () => {
			basicListState.visible = false
			basicListState.record = {}
		}
		return {
			taskForm,
			...toRefs(basicListState),
			add,
			edit,
			handleOk,
			handleCancel,
		}
	},
})
</script>
<style lang="less" scoped>
.ant-avatar-lg {
	width: 48px;
	height: 48px;
	line-height: 48px;
}
.list-content-item {
	color: rgba(0, 0, 0, .45);
	display: inline-block;
	vertical-align: middle;
	font-size: 14px;
	margin-left: 40px;
	span {
		line-height: 20px;
	}
	p {
		margin-top: 4px;
		margin-bottom: 0;
		line-height: 22px;
	}
}
</style>


