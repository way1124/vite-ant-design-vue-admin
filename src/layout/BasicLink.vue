<template>
  <router-view v-slot="{ Component }">
    <transition name="slide-right" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BasicLink",
  setup() {},
});
</script>