<template lang="">
  <Toast
    ref="toast"
    :type="toast.type"
    :title="toast.title"
    :text="toast.message"
  />

  <Loader v-if="isBusy" />

  <div class="authentication authentication--recovery-password">
    <div class="authentication_thumb">
      <img src="@/assets/images/authentication-thumb.png" />
    </div>

    <div class="authentication__view">
      <form
        @submit.prevent="handleRecoveryPassword"
        class="form form--vertical"
      >
        <img
          src="@/assets/images/icons/pjzen-authentication.svg"
          class="authentication__view__logo"
        />

        <h1 class="authentication__view__title">
          Esqueceu sua senha? Fique tranquilo!
        </h1>

        <p class="register-text">
          Preencha as informações abaixo para receber as instrução e criar uma
          nova senha
        </p>

        <div class="form__section">
          <div
            class="input-field"
            :class="{
              'input-field--error': form.email.isValid === false,
            }"
          >
            <label for="login--email">E-mail</label>
            <input
              id="login--email"
              type="text"
              placeholder="Seu e-mail"
              v-model="form.email.value"
              @blur="
                visit('email');
                validateInputs();
              "
              class="input--darkened"
              autocomplete="username"
            />
            <span
              v-if="form.email.isValid === false"
              class="helper-text helper-text--error"
              >{{ form.email.errorMessage }}</span
            >
          </div>

          <button
            @submit.prevent
            type="submit"
            class="button button--primary width-full"
            :disabled="isTimerActive || !isFormAvailable"
          >
            Recuperar senha
          </button>

          <p v-if="isTimerActive" class="register-text">
            Enviar novamente em {{ timerText }}
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
/**
 * Mixins
 * */
import formMixin from "@/data/mixins/form-mixin.js";
import recoveryModel from "@/data/models/recovery-password-model.js";

/**
 * Services
 * */
import recoveryPasswordEmailService from "@/services/send-recovery-password-email-service";

/**
 * Helpers
 * */
// import { addLoginDataToLocalStorage } from "@/helpers/local-storage";

/**
 * Components
 * */
import Toast from "@/components/Toast.vue";
import Loader from "@/components/Loader.vue";

export default {
  name: "app-recovery-password",

  mixins: [formMixin, recoveryModel],

  components: { Toast, Loader },

  computed: {
    isFormAvailable() {
      return this.isFormValid();
    },

    timerText() {
      const minutes = Math.floor(this.timer / 60);
      const seconds = this.timer % 60;
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    },
  },

  data() {
    return {
      isBusy: false,

      passwordFieldType: "password",

      toast: {
        type: null,
        message: null,
        title: null,
      },

      serviceErrorMessage: null,
      serviceSuccessMessage: null,

      isTimerActive: false,
      timer: 50,
      timerInterval: null,
    };
  },

  methods: {
    startTimer() {
      this.isTimerActive = true;

      this.timerInterval = setInterval(() => {
        if (this.timer > 0) {
          this.timer -= 1;
        } else {
          clearInterval(this.timerInterval);
          this.isTimerActive = false;
          this.timer = 50;
          this.isFormValid();
        }
      }, 1000);
    },

    validateInputs() {
      this.validateField({
        reference: this.form.email,
        validateFunction: this.validateEmail,
        errorMessage: this.messages.invalidEmail,
      });
    },

    isFormValid() {
      if (this.form.email.isValid && !this.isTimerActive) {
        return true;
      }
      return false;
    },

    showSuccessToast(message) {
      this.toast = {
        type: "success",
        message: message,
        title: "E-mail de verificação enviado!",
      };

      this.$refs.toast.show();
    },

    showErrorToast(message) {
      this.toast = {
        type: "error",
        message: message,
        title: "Falha ao recuperar senha",
      };

      this.$refs.toast.show();
    },

    async handleRecoveryPassword() {
      this.isBusy = true;

      if (this.isFormValid()) {
        try {
          const recoveryPasswordResponse = await recoveryPasswordEmailService({
            email: this.form.email.value,
          });

          if (recoveryPasswordResponse) {
            this.showSuccessToast(recoveryPasswordResponse);
          }

          this.isBusy = false;
        } catch (error) {
          this.isBusy = false;

          this.showErrorToast(error);
        } finally {
          this.startTimer();
        }
      }
    },
  },
};
</script>
