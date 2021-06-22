import { ref, Ref, watch, onMounted } from "vue";
import { TableStateFilters, TableState } from 'ant-design-vue/es/table/interface';

export type Pagination = TableState['pagination'];

export interface IPagination {
  total: number;
  current: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: number;
  [key: string]: any;
}

export type PromiseResult<T> = {
  current: number;
  pageSize: string;
  success: boolean;
  total: number;
  data: T[];
}

export function usePaginationData<T>(promiseFn: (params: any) => Promise<PromiseResult<T>>) {
  let pagination: Ref<IPagination> = ref({
    total: 0,
    current: 1,
    pageSize: 10,
    page: 1,
    results: 10,
    sorter: {},
    filter: {}
  })
  const tableData: Ref<T[]> = ref([])
  const loading: Ref<boolean> = ref(false)

  watch(pagination, async () => await getPaginationData())

  const setPagination = (page: number = 1, results: number = 10, arg?: Object) => {
    const data: IPagination = {
      total: pagination.value.total,
      current: page,
      pageSize: results,
      ...arg
    }
    pagination.value = data
    return pagination
  }

  const getPaginationData = async () => {
    loading.value = true
    try {
      const { data = [], total=0 } = await promiseFn(pagination.value)
      tableData.value = data
      // console.log(tableData.value)
      pagination.value.total = total
    } catch (error) {
      tableData.value = []
      console.log(error)
    }
    loading.value = false
  }

  const handleTableChange = (pag: Pagination, filters: TableStateFilters, sorter: any) => {
    // console.log(pag, filters, {...sorter})
    const s: {
      field: string;
      order: string;
    } = {
      field: sorter.field,
      order: sorter.order
    }
    const sor: any = {}
    sor[s.field] = s.order
    setPagination(pag?.current, pag?.pageSize, { filter: filters.status, sorter: JSON.stringify(sor) })
  };

  onMounted(async () => await getPaginationData())

  return {
    pagination,
    tableData,
    loading,
    setPagination,
    handleTableChange,
  }
}