<template>
  <Sidebar />
  <router-view></router-view>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';

export default {
  name: 'App',
  components: {
    Sidebar
  }
}
</script>