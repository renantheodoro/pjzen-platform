<template>
  <div class="dropdown" :class="[{ active: isActive }, classList]">
    <img
      src="@/assets/images/icons/ellipsis-vertical.svg"
      @click="toggleDropdown"
    />
    <ul class="dropdown__list">
      <slot></slot>
    </ul>
  </div>
</template>
<script>
export default {
  name: "app-dropdown",

  props: {
    classList: String,
  },

  data() {
    return {
      isActive: false,
    };
  },

  mounted() {
    const self = this;
    document.addEventListener("click", function (event) {
      const clicked = event.target;
      const parent = clicked.parentElement;
      if (!parent.classList.contains("dropdown")) {
        self.isActive = false;
      }
    });
  },

  methods: {
    toggleDropdown() {
      this.isActive = !this.isActive;
    },
  },
};
</script>
<style lang=""></style>
