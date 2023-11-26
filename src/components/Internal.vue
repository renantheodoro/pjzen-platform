<template>
  <div class="container">
    <div class="view__row">
      <ViewSidebar />

      <div class="view__column view__column--content">
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
import ViewSidebar from "@/components/ViewSidebar.vue";

export default {
  name: "app-internal",

  components: {
    ViewSidebar,
  },
};
</script>
<style lang=""></style>
