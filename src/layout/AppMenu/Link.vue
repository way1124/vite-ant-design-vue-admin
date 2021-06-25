<template>
  <!-- eslint-disable vue/require-component-is -->
  <router-link v-if="LinkProps.is === 'router-link'" :to="LinkProps.to || '/'">
    <slot />
  </router-link>
  <a v-else target="_blank" rel="noopener" :href="LinkProps.href">
    <slot />
  </a>
  <!-- <component v-bind="linkProps(to)">
    <slot />
  </component> -->
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { isExternal } from '@/utils/validate'

const linkProps = (url: string) => {
  if (isExternal(url)) {
    return {
      is: 'a',
      href: url,
      target: '_blank',
      rel: 'noopener'
    }
  }
  return {
    is: 'router-link',
    to: url
  }
}

export default defineComponent({
  name: "AppLink",
  props: {
    to: {
      type: String as PropType<string>,
      required: true
    }
  },
  setup(props) {
    return {
      LinkProps: linkProps(props.to),
    }
  }
})
</script>
