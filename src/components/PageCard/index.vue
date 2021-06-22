<template>

    <a-card :bordered="false" class="vite-page-table-card" :title="title">
      <template #extra>
        <a-space :size="16">
          <a-space :size="16">
            <a-button v-for="item in buttons" :key="item" :type="item.type" @click="item.onClick" :disabled="item.disabled">
              <template v-if="item.icon" #icon><component :is="`${item.icon}`" /></template>
              {{item.title}}
            </a-button>
          </a-space>
          <a-space :size="16" v-if="rightIcon">
            <a-tooltip placement="top">
              <template #title>
                <span>刷新</span>
              </template>
              <SyncOutlined @click="onRefresh" />
            </a-tooltip>
            <a-dropdown :trigger="['click']">
              <a-tooltip placement="top">
                <template #title>
                  <span>密度</span>
                </template>
                <ColumnHeightOutlined @click.prevent />
              </a-tooltip>
              <template #overlay>
                <a-menu v-model:selectedKeys="selectedKeys" @click="handleMenuClick">
                  <a-menu-item key="default">默认</a-menu-item>
                  <a-menu-item key="middle">中等</a-menu-item>
                  <a-menu-item key="small">紧凑</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <a-tooltip placement="top">
              <template #title>
                <span>列设置</span>
              </template>

              <a-popover v-model:visible="visible" placement="bottomRight" arrow-point-at-center trigger="click">
                <template #title>
                  <a-checkbox v-model:checked="checkAll" :indeterminate="indeterminate" @change="onCheckAllChange">列展示</a-checkbox>
                </template>
                <template #content>
                  <a-checkbox-group v-model:value="checkedList">
                    <div v-for="(item) in plainOptions" :key="item" style="margin-bottom: 10px;">
                      <a-checkbox :value="item">{{item.title}}</a-checkbox>
                    </div>
                  </a-checkbox-group>
                </template>
                <SettingOutlined />
              </a-popover>
            </a-tooltip>
          </a-space>
        </a-space>
      </template>
      <slot name="body"></slot>
    </a-card>
  
</template>
<script lang="ts">
import { defineComponent, toRefs, PropType, reactive, VNodeChild, watch } from 'vue';

interface MenuInfo {
  key: string;
  keyPath: string[];
  item: VNodeChild;
  domEvent: MouseEvent;
}

interface ICheckboxGroup {
  nativeEvent: Event;
  preventDefault: Function;
  stopPropagation: Function;
  target: {
    checked: boolean;
    defaultChecked: boolean;
    prefixCls: string;
    type: string;
  }
}

interface IColumns {
  [key: string]: any;
}

export interface IButton {
  title: string;
  type?: string;
  icon?: string,
  disabled?: boolean;
  onClick: () => void;
}

export interface IPageCardProps {
  title: string;
  columns: IColumns[];
  buttons: IButton[];
  rightIcon?: boolean;
  onMenuClick?: (item: string) => void;
  onRefresh?: () => void;
  onSetColumns?: (item: IColumns[]) => void;
}

function setColumns(data: IColumns[], val: IColumns[]) {
  const list = []
  const plainOptions = data.map(r => JSON.stringify(r))
  for (let index = 0; index < val.length; index++) {
    const element = val[index];
    const id = plainOptions.indexOf(JSON.stringify(element))
    list[id] = element
  }
  return list
}

export default defineComponent({
  name: "AppPageCard",
  props: {
    props: {
      type: Object as PropType<IPageCardProps>,
      required: true,
    }
  },
  setup(props) {
    const state = reactive({
      title: props.props.title || '',
      selectedKeys: ['default'],
      visible: false,
      indeterminate: false,
      checkAll: true,
      checkedList: props.props.columns,
      plainOptions: props.props.columns,
      rightIcon: props.props.rightIcon || true,
    });

    const handleMenuClick = (e: MenuInfo) => {
      state.selectedKeys = e.keyPath
      props.props.onMenuClick && props.props.onMenuClick(e.key)
    };

    const onCheckAllChange = (e: ICheckboxGroup) => {
      Object.assign(state, {
        checkedList: e.target.checked ? state.plainOptions : [],
        indeterminate: false,
      });
      props.props.onSetColumns && props.props.onSetColumns(e.target.checked ? state.plainOptions : [])
    };
    watch(
      () => state.checkedList,
      val => {
        state.indeterminate = !!val.length && val.length < state.plainOptions.length;
        state.checkAll = val.length === state.plainOptions.length;

        const list = setColumns(state.plainOptions, val)
        props.props.onSetColumns && props.props.onSetColumns(list)
      },
    );

    const onRefresh = () => props.props.onRefresh && props.props.onRefresh();

    return {
      ...toRefs(state),
      buttons: props.props.buttons,
      onRefresh,
      handleMenuClick,
      onCheckAllChange,
    };
  },
})
</script>

<style>
.vite-page-table-card .ant-card-head {
  border-bottom: 0px solid #f0f0f0;
}
</style>

