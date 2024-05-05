<template lang="">
  <div class="choose-unity">
    <div
      @click="select(option1)"
      class="choose-unity__item"
      :class="{ selected: optionSelected === option1 }"
    >
      {{ text1 }}
    </div>
    <div
      @click="select(option2)"
      class="choose-unity__item"
      :class="{ selected: optionSelected === option2 }"
    >
      {{ text2 }}
    </div>
  </div>
</template>
<script>
export default {
  name: "app-choose-unity",

  props: {
    option1: String,
    text1: String,
    option2: String,
    text2: String,
    initialOption: String,
  },

  data() {
    return {
      optionSelected: this.initialOption,
    };
  },

  methods: {
    select(option) {
      this.optionSelected = option;
      this.$emit("onSelectOption", option);
    },
  },

  mounted() {
    this.$emit("onSelectOption", this.optionSelected);
  },
};
</script>
<style lang=""></style>
