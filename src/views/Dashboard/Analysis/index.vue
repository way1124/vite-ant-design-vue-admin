<template>
  <a-page-header
    style="background: #fff;margin: -24px -24px 24px;"
    title="Title"
    :breadcrumb="{ routes }"
    sub-title="This is a subtitle"
  />
  <div>
    <a-card :bordered="false" class="vite-page-header-card">
      <app-page-header :config="config" :loading="loading" @onSubmit="setPagination"></app-page-header>
    </a-card>

    <app-page-card :props="page_card_props">
      <template #body>
        <a-table
          :size="tableSize"
          :columns="columns"
          :row-key="record => record.key"
          :data-source="tableData"
          :pagination="{...pagination, 'show-size-changer': true, 'show-quick-jumper': true}"
          :loading="loading"
          @change="handleTableChange"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        >
          <template #name="{ text }"><a>{{ text }}</a></template>
          <template #status="{ text }">
            <a-badge :status="statusTypeFilter(text)" :text="statusFilter(text)" />
          </template>

          <template #updatedAt="{ text }">{{ timeFilter(text) }}</template>

          <template #action="{ record }">
            <a @click="handleEdit(record)">配置</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record)">订阅报警</a>
          </template>
        </a-table>
      </template>
    </app-page-card>
    <create-form :modelProps="modelProps" />
  </div>
  
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

import { ColumnProps } from 'ant-design-vue/es/table/interface';
type Key = ColumnProps['key'];

import AppPageHeader from '@/components/PageHeader/index.vue';
import AppPageCard, { IPageCardProps } from '@/components/PageCard/index.vue';
import { usePaginationData } from '@/hooks/use_pagination_data';

import { config, columns, statusFilter, statusTypeFilter, timeFilter } from "./config";
import { getList, addRule } from "./server";
import { Result, IColumns } from './data';

import CreateForm from "./modules/CreateForm.vue";

const routes = [
  {
    path: 'index',
    breadcrumbName: 'First-level Menu',
  },
  {
    path: 'first',
    breadcrumbName: 'Second-level Menu',
  },
  {
    path: 'second',
    breadcrumbName: 'Third-level Menu',
  },
];

const modelProps = reactive({
  visible: false,
  confirmLoading: false,
  model: {
    name: '',
    desc: '',
  } as Result,
  ok: () => {},
  cancel: () => {
    modelProps.model = {
      name: '',
      desc: '',
    }
    modelProps.confirmLoading = false;
    modelProps.visible = false
  },
})
const onAdd = () => modelProps.visible = true;
const onDelete = () => console.log('批量删除')

const buttons = [
  {
    title: '新增',
    type: 'primary',
    icon: 'PlusOutlined',
    onClick: onAdd,
  },
  {
    title: '批量删除',
    type: "danger",
    icon: 'DeleteOutlined',
    disabled: true,
    onClick: onDelete
  },
  {
    title: '修改',
    // type: 'primary',
    icon: 'FormOutlined',
    disabled: true,
    onClick: () => console.log('修改')
  },
  {
    title: '导入',
    type: 'primary',
    icon: 'ArrowUpOutlined',
    onClick: () => console.log('导入')
  },
  {
    title: '导出',
    // type: 'primary',
    icon: 'ArrowDownOutlined',
    onClick: () => console.log('导出')
  },
]

const handleEdit = (record: Result) => {
  modelProps.visible = true;
  modelProps.model = { ...record }
  // console.log({...record})
}
const handleSub = (record: Result) => console.log({...record})

export default defineComponent({
  components: {
    AppPageHeader,
    AppPageCard,
    CreateForm,
  },
  setup() {

    const { pagination, tableData, loading, handleTableChange, setPagination } = usePaginationData<Result>(getList)
    const state = reactive({
      tableSize: 'default',
      config,
      columns,
      pagination,
      loading,
      tableData,
      selectedRowKeys: []
    });

    const handleMenuClick = (e: string) => {
      state.tableSize = e
    };

    const page_card_props = reactive<IPageCardProps>({
      title:"查询表格",
      columns: columns,
      buttons,
      onRefresh: setPagination,
      onMenuClick: handleMenuClick,
      onSetColumns: (item) => {
        state.columns = item as IColumns[]
      }
    })

    const onSelectChange = (selectedRowKeys: Key[]) => {
      page_card_props.buttons[1].disabled = selectedRowKeys.length > 0 ? false : true
      page_card_props.buttons[2].disabled = selectedRowKeys.length > 0 ? false : true
      // console.log('selectedRowKeys changed: ', selectedRowKeys);
      state.selectedRowKeys = selectedRowKeys as never[];
    };

    // watch(modelProps, val => console.log(val))

    modelProps.ok = async () => {
      await addRule(modelProps.model)
      modelProps.cancel()
      await setPagination()
      // console.log(modelProps.model)
    }
    
    return {
      routes,
      ...toRefs(state),
      page_card_props,
      modelProps,
      setPagination,
      handleTableChange,
      onSelectChange,
      statusFilter,
      statusTypeFilter,
      timeFilter,
      handleEdit,
      handleSub,
    };
  },
})
</script>

<style>
.vite-page-header-card {
  margin-bottom: 24px;
}
.vite-page-header-card .ant-card-body {
  padding-bottom: 0;
}
.vite-page-table-card .ant-card-head {
  border-bottom: 0px solid #f0f0f0;
}
</style>

