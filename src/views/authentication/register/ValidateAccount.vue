<template lang="">
  <Toast
    ref="toastError"
    type="error"
    title="Código incorreto"
    text="O código inserido está incorreto. tente novamente"
  />

  <form class="form form--vertical form--validate-account">
    <img
      src="@/assets/images/icons/pjzen-authentication.svg"
      class="authentication__view__logo"
    />

    <h2 class="authentication__view__title">Valida sua conta</h2>

    <p>Digite aqui código que você recebeu no email paul************.com</p>

    <div class="input-digits" :class="{ error: hasError }">
      <div class="input-digits__item">
        <input @input="focusNext(1)" ref="input-1" type="text" maxlength="1" />
      </div>
      <div class="input-digits__item">
        <input @input="focusNext(2)" ref="input-2" type="text" maxlength="1" />
      </div>
      <div class="input-digits__item">
        <input @input="focusNext(3)" ref="input-3" type="text" maxlength="1" />
      </div>
      <div class="input-digits__item">
        <input @input="focusNext(4)" ref="input-4" type="text" maxlength="1" />
      </div>
      <div class="input-digits__item">
        <input @input="focusNext(5)" ref="input-5" type="text" maxlength="1" />
      </div>
    </div>

    <legend>Enviar novamente em 00:50</legend>

    <button
      @click.prevent="success"
      ref="buttonValidate"
      class="button button--primary"
    >
      Validar Conta
    </button>

    <br />

    <button @click.prevent="showError" class="button button--secondary">
      TESTE O ERRO
    </button>
  </form>
</template>
<script>
import Toast from "@/components/Toast.vue";
export default {
  name: "app-validate-account",

  data() {
    return {
      hasError: false,
    };
  },

  methods: {
    focusNext(index) {
      this.hasError = false;

      if (index >= 1 && index < 5) {
        const nextIndex = index + 1;
        this.$refs["input-" + nextIndex].focus();
      }

      if (index == 5) {
        this.$refs.buttonValidate.focus();
      }
    },

    showError() {
      this.$refs.toastError.show();
      this.hasError = true;
    },

    success() {
      this.hasError = false;
      this.$router.push({ name: "validate-success" });
    },
  },

  components: { Toast },
};
</script>
<style lang=""></style>
