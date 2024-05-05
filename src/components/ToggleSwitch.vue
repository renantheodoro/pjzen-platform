<template lang="">
  <span v-if="isDisabled" class="switch">
    <input
      @change="onChange"
      disabled
      id="switch-disabled"
      type="checkbox"
      :checked="isChecked"
    />
    <label for="switch-disabled"></label>
  </span>

  <span v-else class="switch">
    <input
      @change="onChange"
      id="switch-rounded"
      type="checkbox"
      :checked="isChecked"
    />
    <label for="switch-rounded"></label>
  </span>
</template>
<script>
export default {
  name: "app-toggle-switch",

  props: {
    isChecked: {
      type: Boolean,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {};
  },

  methods: {
    onChange(e) {
      this.$emit("onToggle", e.target.checked);
    },
  },
};
</script>
<style lang=""></style>
