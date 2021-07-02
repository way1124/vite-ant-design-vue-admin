<template>
	<div class="page-header-wrapper">
		<a-page-header :title="title" :breadcrumb="{ routes }" class="page-header">
			{{content}}
		</a-page-header>

		<div class="vite-content-children">
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useRoute } from 'vue-router';

export default defineComponent({
	name: "PageHeaderWrapper",
	props: {
		content: {
			type: String as PropType<string>,
			required: true,
		}
	},
	setup() {
		const routes = useRoute().matched.map(r => ({path: r.path, breadcrumbName: r.name}))
		const title = useRoute().name
		return {
      routes,
			title,
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
}
</style>
