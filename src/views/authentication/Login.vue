<template lang="">
  <Toast
    ref="toast"
    :type="toast.type"
    :title="toast.title"
    :text="toast.message"
  />

  <Loader v-if="isBusy" />

  <div class="authentication">
    <div class="authentication_thumb">
      <img src="@/assets/images/authentication-thumb.png" />
    </div>

    <div class="authentication__view">
      <form @submit.prevent="handleLogin" class="form form--vertical">
        <img
          src="@/assets/images/icons/pjzen-authentication.svg"
          class="authentication__view__logo"
        />

        <h1 class="authentication__view__title">Faça seu login</h1>

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

          <div
            class="input-field input-field--password"
            :class="{
              'input-field--error': form.password.isValid === false,
            }"
          >
            <label for="login--password">Senha</label>
            <input
              id="login--password"
              :type="passwordFieldType"
              placeholder="Sua senha"
              v-model="form.password.value"
              @blur="
                visit('password');
                validateInputs();
              "
              class="input--darkened"
              autocomplete="current-password"
            />
            <span
              v-if="form.password.isValid === false"
              class="helper-text helper-text--error"
              >{{ form.password.errorMessage }}</span
            >

            <a
              @click.prevent="togglePasswordView"
              class="input-field__password-button"
            >
              <img
                src="@/assets/images/icons/eye-password.svg"
                v-if="passwordFieldType === 'password'"
              />
              <img
                src="@/assets/images/icons/eye-password-slash.svg"
                v-if="passwordFieldType === 'text'"
              />
            </a>
          </div>

          <div class="input-field input-field--forgot-password">
            <router-link
              :to="{ name: 'recovery-password' }"
              class="button-forgot-password"
            >
              Esqueci minha senha
            </router-link>
          </div>

          <button
            @submit.prevent
            type="submit"
            class="button button--primary width-full"
            :disabled="!isFormAvailable"
          >
            Entrar
          </button>

          <p class="register-text">
            É de uma empresa de contabilidade?
            <router-link :to="{ name: 'create-accountancy-form' }"
              >Faça seu cadastro</router-link
            >
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
import loginModel from "@/data/models/login-model.js";

/**
 * Services
 * */
import loginService from "@/services/authentication/login-service.js";

/**
 * Components
 * */
import Toast from "@/components/Toast.vue";
import Loader from "@/components/Loader.vue";

export default {
  name: "app-login",

  mixins: [formMixin, loginModel],

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
    };
  },

  mounted() {
    const isExpiredSession = this.$route.query.expiredSession;

    if (isExpiredSession) {
      this.showWarningToast("Realize o login novamente.", "Sessão expirada!");
    }
  },

  methods: {
    togglePasswordView() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },

    validateInputs() {
      this.validateField({
        reference: this.form.email,
        validateFunction: this.validateEmail,
        errorMessage: this.messages.invalidEmail,
      });

      this.validateField({
        reference: this.form.password,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });
    },

    isFormValid() {
      if (this.form.email.isValid && this.form.password.isValid) {
        return true;
      }
      return false;
    },

    showErrorToast(message) {
      this.toast = {
        type: "error",
        message: message,
        title: "Falha ao recuperar senha",
      };
      this.$refs.toast.show();
    },

    showWarningToast(message, title) {
      this.toast = {
        type: "warning",
        message: message,
        title: title,
      };
      this.$refs.toast.show();
    },

    async handleLogin() {
      this.isBusy = true;

      if (this.isFormValid()) {
        try {
          await loginService({
            email: this.form.email.value,
            password: this.form.password.value,
          });

          this.$router.push({ name: "dashboard" });

          this.isBusy = false;
        } catch (error) {
          this.isBusy = false;
          this.showErrorToast(error.toString());
        }
      }
    },
  },
};
</script>
