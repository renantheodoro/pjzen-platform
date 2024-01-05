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
        @submit.prevent="handleRegisterNewPassword"
        class="form form--vertical"
      >
        <img
          src="@/assets/images/icons/pjzen-authentication.svg"
          class="authentication__view__logo"
        />

        <h1 class="authentication__view__title">Cadastre uma nova senha</h1>

        <div class="form__section">
          <div
            class="input-field"
            :class="{
              'input-field--error': form.password.isValid === false,
            }"
          >
            <label for="register-accountancy--password">Crie sua senha</label>
            <input
              id="register-accountancy--password"
              type="password"
              placeholder="Sua senha"
              v-model="form.password.value"
              @blur="
                visit('password');
                validateInputs();
              "
              class="input--darkened"
            />
            <span
              v-if="form.password.isValid === false"
              class="helper-text helper-text--error"
              >{{ form.password.errorMessage }}</span
            >
          </div>

          <div
            class="input-field"
            :class="{
              'input-field--error': form.confirmPassword.isValid === false,
            }"
          >
            <label for="register-accountancy--confirmPassword"
              >Confirme sua senha</label
            >
            <input
              id="register-accountancy--confirmPassword"
              type="password"
              placeholder="Repita sua senha"
              v-model="form.confirmPassword.value"
              @blur="
                visit('confirmPassword');
                validateInputs();
              "
              class="input--darkened"
            />
            <span
              v-if="form.confirmPassword.isValid === false"
              class="helper-text helper-text--error"
              >{{ form.confirmPassword.errorMessage }}</span
            >
          </div>

          <button
            @submit.prevent
            type="submit"
            class="button button--primary width-full"
            :disabled="!isFormAvailable"
          >
            Cadastrar
          </button>
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
import registerPasswordModel from "@/data/models/register-new-password-model.js";

/**
 * Services
 * */
import registerNewPasswordService from "@/services/register-new-password-service";

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
  name: "app-register-new-password",

  mixins: [formMixin, registerPasswordModel],

  components: { Toast, Loader },

  computed: {
    isFormAvailable() {
      return this.isFormValid();
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

      email: null,
      resetPasswordCode: null,
    };
  },

  mounted() {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const resetPasswordCode = params.get("resetPasswordCode");

    this.email = email;
    this.resetPasswordCode = resetPasswordCode;
  },

  methods: {
    validateInputs() {
      this.validatePasswords(this.form.password, this.form.confirmPassword);
    },

    isFormValid() {
      if (this.form.password.isValid && this.form.confirmPassword.isValid) {
        return true;
      }
      return false;
    },

    showSuccessToast(message) {
      this.toast = {
        type: "success",
        message: message,
        title: "Nova senha cadastrada!",
      };

      this.$refs.toast.show();
    },

    showErrorToast(message) {
      this.toast = {
        type: "error",
        message: message,
        title: "Falha ao cadastrar nova senha",
      };

      this.$refs.toast.show();
    },

    async handleRegisterNewPassword() {
      this.isBusy = true;

      if (this.isFormValid()) {
        try {
          const recoveryPasswordResponse = await registerNewPasswordService({
            email: this.email,
            resetPasswordCode: this.resetPasswordCode,
            newPassword: this.form.password.value,
          });

          if (recoveryPasswordResponse) {
            this.showSuccessToast(recoveryPasswordResponse);
          }

          this.isBusy = false;
          this.$router.push({ name: "recovery-password-success" });
        } catch (error) {
          this.isBusy = false;

          this.showErrorToast(error);
        }
      }
    },
  },
};
</script>
