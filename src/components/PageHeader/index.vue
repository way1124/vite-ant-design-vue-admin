<template>
  <!-- <div>Analysis.vue</div> -->
  <a-form :model="formState" ref="formRef" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-row :gutter="[24, 8]" >
      <a-col :span="span" class="page_header_col" v-for="(item) in dataCol" :key="item.value">
        <a-form-item :label="item.label" :name="item.value">
          <a-input v-if="item.element === 'input'" v-model:value="formState[item.value]" :placeholder="item.label" />
          <a-select v-if="item.element === 'select'" v-model:value="formState[item.value]" :placeholder="item.label">
            <a-select-option v-for="o in item.options" :key="o.value" :value="o.value">{{o.key}}</a-select-option>
          </a-select>

          <a-date-picker v-if="item.element === 'date-picker'" v-model:value="formState[item.value]" style="width: 100%" :allowClear="false" />
          <a-month-picker v-if="item.element === 'month-picker'" v-model:value="formState[item.value]" style="width: 100%" :allowClear="false" />
          <a-range-picker v-if="item.element === 'range-picker'" v-model:value="formState[item.value]" style="width: 100%" :allowClear="false" />
        </a-form-item>
      </a-col>
      
      <a-col :span="pageHeaderCol" class="page_header_col">
        <a-space :style="`${(advanced || pageHeaderCol == 24) ? 'margin-bottom: 24px;' : ''}`">
          <a-button type="primary" :loading="loading" @click="onSubmit">查询</a-button>
          <a-button @click="resetForm">重置</a-button>
          <a @click="advanced = !advanced">
            {{!advanced ? '展开' : '收起'}}
            <DownOutlined v-if="!advanced" />
            <UpOutlined v-else />
          </a>
        </a-space>
      </a-col>
    </a-row>
  </a-form>
  
</template>
<script lang="ts">
import moment from 'moment';
import { defineComponent, reactive, toRaw, UnwrapRef, ref, PropType, watch, Ref } from 'vue';
import { FormState, IFormState } from './interface';
import useWindowResize from "@/hooks/use_window_resize";

const dateTypes: string[] = ['date-picker', 'month-picker', 'range-picker']

const propsConfig = (config: IFormState[]) => {
  const form_state: FormState = {}
  const times = new Map<string, IFormState>()
  const data = config.filter(r => {
    if (!r.hide) {
      form_state[r.value] = null
      if (dateTypes.includes(r.element)) times.set(r.value, r);
    }
    return !r.hide
  })
  return { data, form_state, times }
}

const picker2time = (item: FormState, times: Map<string, IFormState>) => {
  for (let iterator in item) {
    const element = times.get(iterator) && times.get(iterator)?.element
    if (element === 'date-picker' && item[iterator]) {
      item[iterator] = moment(item[iterator]).format("YYYY-MM-DD");
    }
    if (element === 'month-picker' && item[iterator]) {
      item[iterator] = moment(item[iterator]).format("YYYY-MM");
    }
    if (element === 'range-picker' && item[iterator]) {
      const props = times.get(iterator)?.props
      item[props[0]] = item[iterator].length === 2 ? moment(item[iterator][0]).format("YYYY-MM-DD") : null;
      item[props[1]] = item[iterator].length === 2 ? moment(item[iterator][1]).format("YYYY-MM-DD") : null;
      delete item[iterator]
    }
  }

  return item
}


export default defineComponent({
  name: 'AppPageHeader',
  props: {
    config: {
      type: Array as PropType<IFormState[]>,
      required: true,
    },
    loading: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
  },
  setup(props, ctx) {
    const { width } = useWindowResize();
    const formRef = ref();
    const dataCol: Ref<IFormState[]> = ref<IFormState[]>([])

    const pageHeaderCol: Ref<number> = ref<number>(8)
    const span: Ref<number> = ref<number>(8)

    const { data, form_state, times } = propsConfig(props.config)

    const formState: UnwrapRef<FormState> = reactive(form_state);

    const advanced = ref(false)
    const onSubmit = () => {
      const item: FormState = picker2time(JSON.parse(JSON.stringify(toRaw(formState))), times)
      ctx.emit('onSubmit', 1, 10, item)
    };

    const resetForm = () => {
      formRef.value.resetFields();
    };
    const loading: Ref<boolean> = ref<boolean>(props.loading)
    
    watch([width, props, advanced], ([widthVal, propsVal, advancedVal]) => {
      loading.value = propsVal.loading
      
      if (widthVal >= 1600) {
        span.value = 6
        dataCol.value = data.slice(0, 3)
      }
      if (widthVal < 1600 && widthVal >= 1200) {
        span.value = 8
        dataCol.value = data.slice(0, 2)
      }
      if (widthVal < 1200 && widthVal >= 800) {
        span.value = 12
        dataCol.value = data.slice(0, 1)
      }
      if (widthVal < 800) {
        span.value = 24
        dataCol.value = data.slice(0, 1)
      }

      dataCol.value = advancedVal ? data : data.slice(0, (24/span.value - 1) || 1)

      const reg: RegExp = new RegExp('^[0-9]*[1-9][0-9]*$')
      const len = dataCol.value.length*span.value/24
      if (reg.test(len.toString())) {
        pageHeaderCol.value = 24
      } else {
        pageHeaderCol.value = span.value
      }
    })

    return {
      formRef,
      formState,
      onSubmit,
      resetForm,
      advanced,
      dataCol,
      span,
      pageHeaderCol,
      loading,
      data,
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
  },
})
</script>

<style scoped>
.page_header_col {
  padding-left: 12px;
  padding-right: 12px;
}
</style>

