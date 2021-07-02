<template>
	<div class="vite-content">
		<slot name="content"></slot>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: "AppGlobalContent",
})
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>

