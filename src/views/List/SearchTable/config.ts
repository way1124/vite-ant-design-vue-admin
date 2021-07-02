import moment from 'moment';
import { IFormState } from '@/components/PageHeader';
import { IColumns } from './data';

const filters: { key: string; text: string; value: string}[] = [
  { key: '关闭', text: '关闭', value: '0' },
  { key: '运行中', text: '运行中', value: '1' },
  { key: '已上线', text: '已上线', value: '2' },
  { key: '异常', text: '异常', value: '3' },
]

export const statusFilter = (type: number) => {
  return statusMap[type].text
}
export const statusTypeFilter = (type: number) => {
  return statusMap[type].status
}
export const timeFilter = (time: string) => {
  return moment(time).format("YYYY-MM-DD HH:MM:ss")
}

export const config: IFormState[] = [
  {
    label: '规则名称',
    value: 'name',
    element: 'input'
  },
  {
    label: '描述',
    value: 'desc',
    element: 'input',
  },
  {
    label: '调用次数',
    value: 'callNo',
    element: 'input',
  },
  {
    label: '使用状态',
    value: 'status',
    element: 'select',
    options: filters,
  },
  {
    label: '调度时间',
    value: 'updatedAt',
    element: 'date-picker'
  },
  {
    label: 'month',
    value: 'month',
    element: 'month-picker',
    hide: true
  },
  {
    label: 'range',
    value: 'range',
    element: 'range-picker',
    props: ['startTime', 'endTime'],
    hide: true
  },
]

export const statusMap: {[key: number]: {status: string; text: string}} = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}

export const columns: IColumns[] = [
  {
    title: '规则名称',
    dataIndex: 'name',
    slots: { customRender: 'name' },
  },
  {
    title: '描述',
    dataIndex: 'desc',
  },
  {
    title: '服务调用次数',
    dataIndex: 'callNo',
    sorter: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    filters,
    slots: { customRender: 'status' },
  },
  {
    title: '上次调度时间',
    dataIndex: 'updatedAt',
    slots: { customRender: 'updatedAt' },
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    slots: { customRender: 'action' }
  }
];

