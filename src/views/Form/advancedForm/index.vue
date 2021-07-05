<template>
  <page-header-wrapper content="高级表单常见于一次性输入和提交大批量数据的场景">
    <a-card class="card" title="仓库管理" :bordered="false">
      <repository-form ref="repository" :showSubmit="false" />
    </a-card>
    <a-card class="card" title="任务管理" :bordered="false">
      <task-form ref="task" :showSubmit="false" />
    </a-card>

    <!-- table -->
    <a-card>
      <a-table :columns="columns" :dataSource="data" :pagination="false" :loading="memberLoading">
        <template #name="{text, record}">
          <a-input v-if="record.editable" style="margin: -5px 0" :value="text" :placeholder="columns[0].title" @change="e => handleChange(e.target.value, record.key, 'name')" />
          <template v-else>{{ text }}</template>
        </template>
        <template #workId="{text, record}">
          <a-input v-if="record.editable" style="margin: -5px 0" :value="text" :placeholder="columns[1].title" @change="e => handleChange(e.target.value, record.key, 'workId')" />
          <template v-else>{{ text }}</template>
        </template>
        <template #department="{text, record}">
          <a-input v-if="record.editable" style="margin: -5px 0" :value="text" :placeholder="columns[2].title" @change="e => handleChange(e.target.value, record.key, 'department')" />
          <template v-else>{{ text }}</template>
        </template>
        <template #operation="{ record }">
          <template v-if="record.editable">
            <span v-if="record.isNew">
              <a @click="saveRow(record)">添加</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                <a>删除</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="saveRow(record)">保存</a>
              <a-divider type="vertical" />
              <a @click="cancel(record.key)">取消</a>
            </span>
          </template>
          <span v-else>
            <a @click="toggle(record.key)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </a-table>
      <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" @click="newMember"><PlusOutlined />新增成员</a-button>
    </a-card>

    <!-- fixed footer toolbar -->
    <footer-tool-bar :isMobile="isMobile" :collapsed="sideCollapsed">
      <span class="popover-wrapper">
        <a-popover title="表单校验信息" overlayClassName="vite-pages-forms-style-errorPopover" trigger="click" :getPopupContainer="trigger => trigger.parentNode">
          <template #content>
            <li v-for="item in errors" :key="item.key" @click="scrollToField(item.key)" class="vite-pages-forms-style-errorListItem">
              <TrademarkCircleTwoTone class="vite-pages-forms-style-errorIcon" />
              <div class="">{{ item.message }}</div>
              <div class="vite-pages-forms-style-errorField">{{ item.fieldLabel }}</div>
            </li>
          </template>
          <span class="vite-pages-forms-style-errorIcon" v-if="errors.length > 0">
            <ExclamationCircleOutlined />{{ errors.length }}
          </span>
        </a-popover>
      </span>
      <a-button type="primary" @click="validate" :loading="loading">提交</a-button>
    </footer-tool-bar>
  </page-header-wrapper>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, watch } from 'vue';
import { message, notification } from 'ant-design-vue';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import FooterToolBar from '@/components/FooterToolbar'
import { PageHeaderWrapper } from '@/layout/PageHeaderWrapper';
import { state } from "@/store";
import { IFormState } from '@/components/PageHeader';

import RepositoryForm from './RepositoryForm.vue'
import TaskForm from './TaskForm.vue'

import { IRepositoryForm, ITaskForm } from './form.interface';


const fieldLabels = {
  name: '仓库名',
  url: '仓库域名',
  owner: '仓库管理员',
  approver: '审批人',
  dateRange: '生效日期',
  type: '仓库类型',
  name2: '任务名',
  url2: '任务描述',
  owner2: '执行人',
  approver2: '责任人',
  dateRange2: '生效日期',
  type2: '任务类型'
}

const columns = [
	{
		title: '成员姓名',
		dataIndex: 'name',
		key: 'name',
		width: '20%',
		slots: { customRender: 'name' }
	},
	{
		title: '工号',
		dataIndex: 'workId',
		key: 'workId',
		width: '20%',
		slots: { customRender: 'workId' }
	},
	{
		title: '所属部门',
		dataIndex: 'department',
		key: 'department',
		width: '40%',
		slots: { customRender: 'department' }
	},
	{
		title: '操作',
		key: 'action',
		slots: { customRender: 'operation' }
	}
]

type DataItem = {
	key: string;
	name: string;
	workId: string;
	editable: boolean;
	department: string;
	isNew: boolean;
	_originalData?: DataItem;
}


const data: DataItem[] = [
	{
		key: '1',
		name: '小明',
		workId: '001',
		editable: false,
		department: '行政部',
		isNew: false,
	},
	{
		key: '2',
		name: '李莉',
		workId: '002',
		editable: false,
		department: 'IT部',
		isNew: false,
	},
	{
		key: '3',
		name: '王小帅',
		workId: '003',
		editable: false,
		department: '财务部',
		isNew: false,
	}
]

type ErrorItem = {
	key: string;
	message: string;
	fieldLabel: string;
}
const errors: ErrorItem[] = []

export default defineComponent({
  components: {
		PageHeaderWrapper,
    FooterToolBar,
    RepositoryForm,
    TaskForm
  },
  setup() {
    const repository = ref()
    const task = ref()
		const fromState = reactive({
			loading: false,
      memberLoading: false,
			isMobile: false,
			sideCollapsed: state.layout.menu.locale,

      // table
      columns: columns,
      data: data,

      errors: errors,
		})

		const handleSubmit = (e: Event) => {
      e.preventDefault()
    }
    const newMember = () => {
      const length = fromState.data.length
      fromState.data.push({
        key: length === 0 ? '1' : (parseInt(fromState.data[length - 1].key) + 1).toString(),
        name: '',
        workId: '',
        department: '',
        editable: true,
        isNew: true
      })
    }
    const remove = (key: string) => {
      const newData = fromState.data.filter(item => item.key !== key)
      fromState.data = newData
    }
    const saveRow = (record: DataItem) => {
      fromState.memberLoading = true
      const { key, name, workId, department } = record
      if (!name || !workId || !department) {
        fromState.memberLoading = false
        message.error('请填写完整成员信息。')
        return
      }
      // 模拟网络请求、卡顿 800ms
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({ loop: false })
        }, 800)
      }).then(() => {
        const target = fromState.data.find(item => item.key === key) as DataItem
        target.editable = false
        target.isNew = false
        fromState.memberLoading = false
      })
    }
    const toggle = (key: string) => {
      const target = fromState.data.find(item => item.key === key) as DataItem
      target._originalData = { ...target }
      target.editable = !target.editable
    }
    const getRowByKey = (key: string, newData: DataItem[]) => {
      const data = fromState.data
      return (newData || data).find(item => item.key === key)
    }
    const cancel = (key: string) => {
      const target = fromState.data.find(item => item.key === key) as DataItem
      Object.keys(target).forEach((key) => { (target as any)[key] = (target._originalData as any)[key] })
      target._originalData = undefined
    }
    const handleChange = (value: string | boolean | DataItem, key: string, column: string) => {
      const newData = [...fromState.data]
      const target = newData.find(item => key === item.key) as DataItem
      if (target) {
        (target as any)[column] = value
        fromState.data = newData
      }
    }

    // 最终全页面提交
    const validate = () => {
      const repositoryFormRef = repository.value.formRef
      const taskFormRef = task.value.formRef

      const error_list: any[] = []

      const repositoryForm = new Promise((resolve, reject) => {
        repositoryFormRef.validate().then((value: IRepositoryForm) => resolve(value)).catch((err: ValidateErrorEntity<IRepositoryForm>) => {
          error_list.push(...err.errorFields)
          return reject(err)
        })
      })
      const taskForm = new Promise((resolve, reject) => {
        taskFormRef.validate().then((value: ITaskForm) => resolve(value)).catch((err: ValidateErrorEntity<IFormState>) => {
          error_list.push(...err.errorFields)
          return reject(err)
        })
      })

      // clean this.errors
      fromState.errors = []
      Promise.race([taskForm, repositoryForm]).then(values => {
        notification.success({
          message: 'Received values of form:',
          description: JSON.stringify(values)
        })
      }).catch(() => {
        const tem = error_list.reduce((pre, cur) => {
          const name = cur['name'][0]
          const value = cur['errors'][0]
          pre[name] = value
          return pre
        }, {})
        errorList(tem)
      })
    }
    const errorList = (errors: any) => {
      if (!errors || errors.length === 0) {
        return
      }
      fromState.errors = Object.keys(errors).filter(key => errors[key]).map(key => ({
          key,
          message: errors[key],
          fieldLabel: (fieldLabels as any)[key]
        }))
    }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
      if (labelNode) {
        labelNode.scrollIntoView(true)
      }
    }

		watch(state, value => {
			fromState.sideCollapsed = value.layout.menu.locale
		})

		return {
      repository,
      task,
			...toRefs(fromState),
			handleSubmit,
			newMember,
			remove,
			saveRow,
			toggle,
			getRowByKey,
			cancel,
			handleChange,
			validate,
			errorList,
			scrollToField,
		}
	}
})
</script>

<style lang="less" scoped>
  .card{
    margin-bottom: 24px;
  }
  .popover-wrapper {
    :deep(.vite-pages-forms-style-errorPopover .ant-popover-inner-content) {
      min-width: 256px;
      max-height: 290px;
      padding: 0;
      overflow: auto;
    }
  }
  .vite-pages-forms-style-errorIcon {
    user-select: none;
    margin-right: 24px;
    color: #f5222d;
    cursor: pointer;
    i {
      margin-right: 4px;
    }
  }
  .vite-pages-forms-style-errorListItem {
    padding: 8px 16px;
    list-style: none;
    border-bottom: 1px solid #e8e8e8;
    cursor: pointer;
    transition: all .3s;

    &:hover {
      background: #e6f7ff;
    }
    .vite-pages-forms-style-errorIcon {
      float: left;
      margin-top: 4px;
      margin-right: 12px;
      padding-bottom: 22px;
      color: #f5222d;
    }
    .vite-pages-forms-style-errorField {
      margin-top: 2px;
      color: rgba(0,0,0,.45);
      font-size: 12px;
    }
  }
</style>
