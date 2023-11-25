<template>
  <div v-if="showAlert" class="alert alert--orange">
    <div class="alert__icon">
      <img src="@/assets/images/icons/file-exclamation.svg" />
    </div>

    <div>
      <span class="alert__title">{{ title }}</span>
      <span class="alert__text"><slot></slot> </span>
    </div>

    <a @click.prevent="close" class="alert__close">
      <img src="@/assets/images/icons/times.svg" />
    </a>
  </div>
</template>
<script>
export default {
  name: "app-alert",

  props: {
    title: String,
    show: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      showAlert: this.show ?? false,
    };
  },

  methods: {
    close() {
      this.showAlert = false;
    },
  },
};
</script>
<style lang=""></style>
