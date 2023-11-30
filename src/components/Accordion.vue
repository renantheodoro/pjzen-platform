<template lang="">
  <div :ref="ref" class="accordion card">
    <div class="accordion__header" @click="toggleAccordion">
      {{ header }}
      <img
        src="@/assets/images/icons/angle-down.svg"
        class="accordion__header__icon"
      />
    </div>

    <div class="accordion__content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "app-accordion",

  props: {
    id: {
      type: String,
      required: true,
    },
    header: { type: String, required: true },
  },

  computed: {
    ref() {
      return `accordion-${this.id}`;
    },
  },

  methods: {
    closeAllAccordions() {
      const accordions = document.getElementsByClassName("accordion");

      for (let i = 0; i < accordions.length; i++) {
        accordions[i].classList.remove("active");
      }
    },

    toggleAccordion() {
      const currentAccordion = this.$refs[this.ref];
      const openAccordion =
        !currentAccordion.classList.value.includes("active");

      this.closeAllAccordions();

      if (openAccordion) {
        currentAccordion.classList.add("active");
      }
    },
  },
};
</script>
<style lang=""></style>
