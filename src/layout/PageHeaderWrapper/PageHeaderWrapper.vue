<template>
	<div class="page-header-wrapper">
		<a-page-header :title="title" :breadcrumb="{ routes }" class="page-header">
			<p v-if="content">{{content}}</p>
			<template #extra>
				<slot name="extra"></slot>
			</template>
			<template #footer>
				<a-tabs v-if="tabList && tabList.length > 0" v-model:activeKey="activeKey" :defaultActiveKey="tabActiveKey" :tabBarStyle="{margin: '0'}" @change="tabsChange">
					<a-tab-pane v-for="tab in tabList" :key="tab.key" :tab="tab.tab" />
				</a-tabs>
			</template>
			<div class="page-header-wrapper-content">
				<div class="content">
					<slot name="content" ></slot>
				</div>
				<div class="extraContent">
					<slot name="extraContent"></slot>
				</div>
			</div>
		</a-page-header>

		<div class="vite-content-children">
			<slot></slot>
		</div>
		
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { useRoute } from 'vue-router';

type ITabItem = {
	key: string;
	tab: string
}

export default defineComponent({
	name: "PageHeaderWrapper",
	props: {
		title: {
			type: String as PropType<string>,
		},
		content: {
			type: String as PropType<string>,
		},
		tabList: {
			type: Array as PropType<ITabItem[]>
		},
		tabActiveKey: {
			type: String as PropType<string>,
		},
	},
	setup(props, ctx) {
		const activeKey = ref<string>(props.tabActiveKey || '')
		const routes = useRoute().matched.map(r => ({path: r.path, breadcrumbName: r.name}))
		const title = props.title || useRoute().name

		const tabsChange = (e: string) => {
			ctx.emit('tabChange', e)
		}

		return {
			activeKey,
      routes,
			title,
			tabsChange,
    };
	},
})
</script>


<style lang="less" scoped>
.page-header-wrapper {
	margin: -24px -24px 0;
	background: #f0f2f5;
	.page-header {
		background: #fff;
	}
	.vite-content-children {
		margin: 24px 24px 0;
	}
	.page-header-wrapper-content {
		display: flex;
		.content {
			flex: 7;
		}
		.extraContent {
			flex: 1;
		}
	}
}
</style>
