<template>
  <div class="container">
    <div class="view__row">
      <ViewSidebar ref="sidebar" v-if="clientId" :clientId="clientId" />

      <div class="view__column view__column--content">
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
/**
 * Components
 * */
import ViewSidebar from "@/components/ViewSidebar.vue";

export default {
  name: "app-internal",

  props: {
    clientId: {
      type: String,
      required: true,
    },
  },

  components: {
    ViewSidebar,
  },

  methods: {
    updateClient() {
      this.$refs.sidebar.handleGetClient();
    },
  },
};
</script>
<style lang=""></style>
