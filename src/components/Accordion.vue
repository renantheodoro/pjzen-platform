<template>
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
    toggleAccordion() {
      const currentAccordion = this.$refs[this.ref];
      this.closeAllAccordions(currentAccordion);
      currentAccordion.classList.toggle("active");
    },

    closeAllAccordions(excludeAccordion) {
      Object.values(this.$refs).forEach((accordion) => {
        if (accordion !== excludeAccordion) {
          accordion.classList.remove("active");
        }
      });
    },

    openFirstAccordion() {
      if (this.id === "1") {
        const currentAccordion = this.$refs[this.ref];

        currentAccordion.classList.toggle("active");
        this.closeAllAccordions(currentAccordion);
      }
    },
  },

  mounted() {
    this.openFirstAccordion();
  },
};
</script>

<style scoped>
/* Adicione estilos conforme necessário */
</style>
