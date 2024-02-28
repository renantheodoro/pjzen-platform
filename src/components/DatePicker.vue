<template>
  <div
    class="datepicker-holder width-full"
    :class="{ 'input--darkened': darkened }"
  >
    <Datepicker
      ref="datepickerRef"
      v-model="picked"
      inputFormat="dd/MM/yyyy"
      :locale="ptBRLocale"
    />
  </div>
</template>

<script>
import Datepicker from "vue3-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import { ref } from "vue";

export default {
  name: "app-date-picker",

  props: {
    darkened: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      picked: ref(new Date()),
      ptBRLocale: ptBR,
    };
  },

  watch: {
    picked(newValue) {
      this.$emit("pickedChanged", newValue);
      this.removeFocusFromInput();
    },
  },

  methods: {
    removeFocusFromInput() {
      const datepickerElement = this.$refs.datepickerRef.$el;

      const inputInsideDatepicker = datepickerElement.querySelector(
        ".v3dp__datepicker input"
      );

      if (inputInsideDatepicker) {
        inputInsideDatepicker.blur();
      }
    },
  },

  created() {
    this.$emit("pickedChanged", this.picked);
  },

  mounted() {
    const elements = document.querySelectorAll(
      '[class^="v3dp__subheading__weekday"]'
    );

    elements.forEach((element) => {
      const originalText = element.textContent;
      const firstThreeLetters = originalText.slice(0, 3);
      element.textContent = firstThreeLetters;
    });
  },

  components: { Datepicker },
};
</script>

<style lang=""></style>
