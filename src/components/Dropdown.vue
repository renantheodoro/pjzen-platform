<template>
  <div
    class="dropdown"
    :class="[{ active: isActive }, classList]"
    ref="dropdown"
  >
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
    classList: {
      type: String,
      required: false,
      default: "",
    },
  },

  data() {
    return {
      isActive: false,
    };
  },

  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },

  methods: {
    toggleDropdown() {
      this.isActive = !this.isActive;
    },

    handleClickOutside(event) {
      if (!this.$refs.dropdown.contains(event.target)) {
        this.isActive = false;
      }
    },
  },
};
</script>

<style lang=""></style>
