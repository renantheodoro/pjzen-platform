<template>
  <div
    class="datepicker-holder width-full"
    :class="{ 'input--darkened': darkened }"
  >
    <input
      v-if="isDisabled"
      id="datepickerRef"
      type="text"
      v-model="dateFormated"
      disabled
    />
    <Datepicker
      v-else
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
    initialValue: {
      type: String,
      required: false,
      default: null,
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      picked: this.initialValue
        ? this.stringToDate(this.initialValue)
        : ref(new Date()),
      ptBRLocale: ptBR,
    };
  },

  computed: {
    dateFormated() {
      const months = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12",
      };

      // Extrair os componentes da data
      const parts = this.picked.toString().split(" ");

      // Formatar a data como dd/mm/aaaa
      const day = parts[2];
      const month = months[parts[1]];
      const year = parts[3];

      return `${day}/${month}/${year}`;
    },
  },

  watch: {
    picked(newValue) {
      this.$emit("pickedChanged", newValue);
      this.removeFocusFromInput();
    },
  },

  methods: {
    stringToDate(ddmmyyyy) {
      // Separa o dia, mês e ano usando a função split()
      var parts = ddmmyyyy.split("/");
      // Cria um novo objeto Date com os valores extraídos
      // O mês em Date começa de 0, então subtraímos 1 do mês fornecido
      return new Date(parts[2], parts[1] - 1, parts[0]);
    },

    dateToString(date) {
      // Verifica se o input é um objeto Date
      if (!(date instanceof Date)) {
        return "Data Inválida";
      }

      // Obtém o dia, mês e ano da data
      var day = date.getDate();
      var month = date.getMonth() + 1; // Adiciona 1 ao mês, pois o mês em Date começa de 0
      var year = date.getFullYear();

      // Formata o dia e o mês para garantir que tenham dois dígitos
      day = day < 10 ? "0" + day : day;
      month = month < 10 ? "0" + month : month;

      // Retorna a data formatada
      return day + "/" + month + "/" + year;
    },
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
