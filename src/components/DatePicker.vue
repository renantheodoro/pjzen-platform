<template lang="">
  <div class="datepicker-holder width-full" :class="{ 'input--darkened': darkened }">
    <Datepicker
      v-model="picked"
      inputFormat="dd/MM/yyyy"
      :locale="ptBRLocale"
    />
  </div>
</template>
<script>
import Datepicker from "vue3-datepicker";
import { ref } from "vue";
const picked = ref(new Date());
import ptBR from "date-fns/locale/pt-BR";

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
      picked: picked,
      ptBRLocale: ptBR,
    };
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
