<template lang="">
  <div class="loader-overlay">
    <div class="loader">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>

    <div v-if="text && text != ''" class="loader-text">{{ text }}</div>
  </div>
</template>
<script>
export default {
  name: "app-loader",

  props: {
    text: {
      type: String,
      default: "",
      required: false,
    },
  },
};
</script>
<style lang=""></style>
