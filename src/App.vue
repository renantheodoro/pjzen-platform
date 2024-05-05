<template>
  <Sidebar v-if="$route.meta.authGuard" />
  <router-view :key="$route.fullPath"></router-view>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";

export default {
  name: "App",
  components: {
    Sidebar,
  },
};
</script>
