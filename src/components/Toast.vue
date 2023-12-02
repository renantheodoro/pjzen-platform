<template>
  <!-- warning | success | error -->
  <div :class="[`toast toast--${type}`, { active: isShowing }]">
    <div class="toast__icon">
      <img
        v-if="type === 'warning'"
        src="@/assets/images/icons/check-circle-warning.svg"
      />
      <img
        v-if="type === 'success'"
        src="@/assets/images/icons/check-circle-success.svg"
      />
      <img
        v-if="type === 'error'"
        src="@/assets/images/icons/check-circle-error.svg"
      />
    </div>

    <div>
      <span class="toast__title">{{ title }}</span>
      <span class="toast__text">{{ text }}</span>
    </div>

    <a @click.prevent="close" class="toast__close">
      <img src="@/assets/images/icons/times-grey.svg" />
    </a>
  </div>
</template>
<script>
export default {
  name: "app-toast",

  props: {
    type: String, // warning | success | error
    title: String,
    text: String,
  },

  data() {
    return {
      isShowing: false,
      timeout: null,
    };
  },

  methods: {
    show() {
      const self = this;
      self.isShowing = true;

      this.timeout = setTimeout(() => {
        self.isShowing = false;
      }, 6000);
    },

    close() {
      this.isShowing = false;
      clearInterval(this.timeout);
    },
  },
};
</script>
<style lang=""></style>
