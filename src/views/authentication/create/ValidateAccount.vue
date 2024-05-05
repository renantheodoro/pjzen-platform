<template lang="">
  <Toast
    ref="toastError"
    type="error"
    title="Código incorreto"
    :text="serviceErrorMessage"
  />

  <Loader v-if="isBusy" />

  <form
    @submit.prevent="handleValidateAccount"
    class="form form--vertical form--validate-account"
  >
    <router-link :to="{ name: 'create-accountancy-form' }"
      ><img
        src="@/assets/images/icons/pjzen-authentication.svg"
        class="authentication__view__logo"
    /></router-link>

    <h2 class="authentication__view__title">Valide sua conta</h2>

    <p>
      <span v-if="hasSentEmail"
        >Digite aqui o código que você recebeu no email {{ maskedEmail }}</span
      >
    </p>

    <div class="input-digits" :class="{ error: hasError }">
      <div class="input-digits__item">
        <input
          @input="focusNext(1)"
          @paste="handlePaste(1, $event)"
          ref="input-1"
          type="text"
          maxlength="1"
          v-model="validationCodeForm.field1"
        />
      </div>
      <div class="input-digits__item">
        <input
          @input="focusNext(2)"
          @paste="handlePaste(2, $event)"
          ref="input-2"
          type="text"
          maxlength="1"
          v-model="validationCodeForm.field2"
        />
      </div>
      <div class="input-digits__item">
        <input
          @input="focusNext(3)"
          @paste="handlePaste(3, $event)"
          ref="input-3"
          type="text"
          maxlength="1"
          v-model="validationCodeForm.field3"
        />
      </div>
      <div class="input-digits__item">
        <input
          @input="focusNext(4)"
          @paste="handlePaste(4, $event)"
          ref="input-4"
          type="text"
          maxlength="1"
          v-model="validationCodeForm.field4"
        />
      </div>
      <div class="input-digits__item">
        <input
          @input="focusNext(5)"
          @paste="handlePaste(5, $event)"
          ref="input-5"
          type="text"
          maxlength="1"
          v-model="validationCodeForm.field5"
        />
      </div>
    </div>

    <legend v-if="!hasSentEmail && !isTimerActive">
      <a @click.prevent="sendValidationCode"
        >Clique para enviar o código de validação para seu e-mail</a
      >
    </legend>

    <legend v-if="hasSentEmail && isTimerActive">
      Enviar novamente em {{ timerText }}
    </legend>

    <button
      @submit.prevent
      type="submit"
      ref="buttonValidate"
      class="button button--primary"
      :disabled="!isFieldsValid"
    >
      Validar conta
    </button>
  </form>
</template>
<script>
/**
 * Components
 * */
import Toast from "@/components/Toast.vue";
import Loader from "@/components/Loader.vue";

/**
 * Helpers
 * */
import { getAccountancyDataFromLocalStorage } from "@/helpers/local-storage";

/**
 * Services
 * */
import sendValidationCodeService from "@/services/authentication/send-validation-code-service";
import validateAccountService from "@/services/authentication/validate-account-service";

export default {
  name: "app-validate-account",

  components: { Toast, Loader },

  data() {
    return {
      isBusy: false,

      hasSentEmail: false,

      isTimerActive: false,
      timer: 50,
      timerInterval: null,

      hasError: false,

      serviceErrorMessage: null,

      validationCodeForm: {
        field1: null,
        field2: null,
        field3: null,
        field4: null,
        field5: null,
      },

      accountancyData: null,
    };
  },

  created() {
    const data = getAccountancyDataFromLocalStorage();
    if (data) {
      this.accountancyData = data;
    }
  },

  computed: {
    validationCode() {
      return `${this.validationCodeForm.field1}${this.validationCodeForm.field2}${this.validationCodeForm.field3}${this.validationCodeForm.field4}${this.validationCodeForm.field5}`;
    },

    maskedEmail() {
      if (typeof this.accountancyData.email !== "string") {
        // Retorna o email original se não for uma string
        return this.accountancyData.email;
      }

      if (this.accountancyData.email.length < 4) {
        // Retorna o email original se tiver menos de 4 caracteres
        return this.accountancyData.email;
      }

      const parts = this.accountancyData.email.split("@");
      const username = parts[0];
      const domain = parts[1];

      const maskedUsername =
        username.charAt(0) + "*".repeat(Math.min(username.length - 1, 8));
      const maskedDomain =
        "*".repeat(Math.min(domain.length - 4, 4)) + domain.slice(-4);

      return `${maskedUsername}@${maskedDomain}`;
    },

    timerText() {
      const minutes = Math.floor(this.timer / 60);
      const seconds = this.timer % 60;
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    },

    isFieldsValid() {
      if (
        this.validationCodeForm.field1 != null &&
        this.validationCodeForm.field1.length === 1 &&
        this.validationCodeForm.field2 != null &&
        this.validationCodeForm.field2.length === 1 &&
        this.validationCodeForm.field3 != null &&
        this.validationCodeForm.field3.length === 1 &&
        this.validationCodeForm.field4 != null &&
        this.validationCodeForm.field4.length === 1 &&
        this.validationCodeForm.field5 != null &&
        this.validationCodeForm.field5.length === 1
      ) {
        return true;
      }
      return false;
    },
  },

  methods: {
    startTimer() {
      this.isTimerActive = true;

      this.timerInterval = setInterval(() => {
        if (this.timer > 0) {
          this.timer -= 1;
        } else {
          this.stopTimer();
        }
      }, 1000);
    },

    stopTimer() {
      clearInterval(this.timerInterval);
      this.isTimerActive = false;
      this.timer = 50;
    },

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

    handlePaste(index, event) {
      // Obtém o texto colado
      const text = event.clipboardData.getData("text/plain");
      // Divide o texto em caracteres
      const chars = text.split("");

      this.validationCodeForm.field1 = chars[0];
      this.validationCodeForm.field2 = chars[1];
      this.validationCodeForm.field3 = chars[2];
      this.validationCodeForm.field4 = chars[3];
      this.validationCodeForm.field5 = chars[4];

      event.preventDefault();
      // Move o foco para o próximo campo
      this.focusNext(index + chars.length - 1);
    },

    showError() {
      this.$refs.toastError.show();
      this.hasError = true;
    },

    success() {
      this.hasError = false;
      this.$router.push({ name: "validate-success" });
    },

    async sendValidationCode() {
      this.isBusy = true;

      try {
        await sendValidationCodeService({
          documentId: this.accountancyData.uid,
          email: this.accountancyData.email,
        });
        this.startTimer();
        this.hasSentEmail = true;
      } catch (error) {
        this.serviceErrorMessage = error
          ? error
          : "Não foi possível criar conta. Tente novamente mais tarde.";
        this.showError();
        this.stopTimer();
        this.hasSentEmail = false;
      } finally {
        this.isBusy = false;
      }
    },

    async handleValidateAccount() {
      this.isBusy = true;

      if (this.isFieldsValid) {
        try {
          await validateAccountService({
            documentId: this.accountancyData.uid,
            validationCode: parseInt(this.validationCode),
          });

          this.success();
        } catch (error) {
          this.serviceErrorMessage = error
            ? error
            : "Não foi possível criar conta. Tente novamente mais tarde.";
          this.showError();
        } finally {
          this.isBusy = false;
        }
      } else {
        this.isBusy = false;
        this.serviceErrorMessage =
          "Preencha todos os campos antes de validar o código";
        this.showError();
      }
    },
  },
};
</script>
<style lang=""></style>
