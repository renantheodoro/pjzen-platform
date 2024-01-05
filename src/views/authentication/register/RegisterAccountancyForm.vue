<template lang="">
  <Toast
    ref="toastError"
    type="error"
    title="Falha ao criar conta"
    :text="serviceErrorMessage"
  />
  <Loader v-if="isBusy" />

  <form class="form form--vertical">
    <router-link :to="{ name: 'register-accountancy-form' }"
      ><img
        src="@/assets/images/icons/pjzen-authentication.svg"
        class="authentication__view__logo"
    /></router-link>

    <h2 class="authentication__view__title">Faça seu cadastro</h2>

    <div class="form__section">
      <div class="form__row">
        <div
          class="input-field"
          :class="{
            'input-field--error': form.firstName.isValid === false,
          }"
        >
          <label for="register-accountancy--firstName">Nome</label>
          <input
            id="register-accountancy--firstName"
            type="text"
            placeholder="Seu nome"
            v-model="form.firstName.value"
            @blur="
              visit('firstName');
              validateInputs();
            "
            class="input--darkened"
          />
          <span
            v-if="form.firstName.isValid === false"
            class="helper-text helper-text--error"
            >{{ form.firstName.errorMessage }}</span
          >
        </div>

        <div
          class="input-field"
          :class="{
            'input-field--error': form.lastName.isValid === false,
          }"
        >
          <label for="register-accountancy--lastName">Sobrenome</label>
          <input
            id="register-accountancy--lastName"
            type="text"
            placeholder="Seu sobrenome"
            v-model="form.lastName.value"
            @blur="
              visit('lastName');
              validateInputs();
            "
            class="input--darkened"
          />
          <span
            v-if="form.lastName.isValid === false"
            class="helper-text helper-text--error"
            >{{ form.lastName.errorMessage }}</span
          >
        </div>
      </div>

      <div class="form__row">
        <div
          class="input-field"
          :class="{
            'input-field--error': form.email.isValid === false,
          }"
        >
          <label for="register-accountancy--email">E-mail profissional</label>
          <input
            id="register-accountancy--email"
            type="text"
            placeholder="Seu e-mail"
            v-model="form.email.value"
            @blur="
              visit('email');
              validateInputs();
            "
            class="input--darkened"
          />
          <span
            v-if="form.email.isValid === false"
            class="helper-text helper-text--error"
            >{{ form.email.errorMessage }}</span
          >
        </div>
        <div
          class="input-field"
          :class="{
            'input-field--error': form.phone.isValid === false,
          }"
        >
          <label for="register-accountancy--phone">Celular</label>
          <input
            id="register-accountancy--phone"
            type="text"
            placeholder="Seu número"
            v-model="form.phone.value"
            v-mask="masks.phone"
            @blur="
              visit('phone');
              validateInputs();
            "
            class="input--darkened"
          />
          <span
            v-if="form.phone.isValid === false"
            class="helper-text helper-text--error"
            >{{ form.phone.errorMessage }}</span
          >
        </div>
      </div>

      <div class="form__row">
        <div
          class="input-field"
          :class="{
            'input-field--error': form.company.isValid === false,
          }"
        >
          <label for="register-accountancy--company">Empresa</label>
          <input
            id="register-accountancy--company"
            type="text"
            placeholder=""
            v-model="form.company.value"
            @blur="
              visit('company');
              validateInputs();
            "
            class="input--darkened"
          />
          <span
            v-if="form.company.isValid === false"
            class="helper-text helper-text--error"
            >{{ form.company.errorMessage }}</span
          >
        </div>
        <div
          class="input-field"
          :class="{
            'input-field--error': form.cnpj.isValid === false,
          }"
        >
          <label for="register-accountancy--cnpj">CNPJ</label>
          <input
            id="register-accountancy--cnpj"
            type="text"
            placeholder=""
            v-model="form.cnpj.value"
            v-mask="masks.cnpj"
            @blur="
              visit('cnpj');
              validateInputs();
            "
            class="input--darkened"
          />
          <span
            v-if="form.cnpj.isValid === false"
            class="helper-text helper-text--error"
            >{{ form.cnpj.errorMessage }}</span
          >
        </div>
      </div>

      <div class="form__row">
        <div
          class="input-field"
          :class="{
            'input-field--error': form.clientsNumber.isValid === false,
          }"
        >
          <label for="register-accountancy--clientsNumber"
            >Número de clientes</label
          >
          <input
            id="register-accountancy--clientsNumber"
            type="text"
            placeholder=""
            v-model="form.clientsNumber.value"
            v-mask="masks.clientsNumber"
            @blur="
              visit('clientsNumber');
              validateInputs();
            "
            class="input--darkened"
          />
          <span
            v-if="form.clientsNumber.isValid === false"
            class="helper-text helper-text--error"
            >{{ form.clientsNumber.errorMessage }}</span
          >
        </div>

        <div
          class="input-field"
          :class="{
            'input-field--error': form.serviceType.isValid === false,
          }"
        >
          <label for="register-accountancy--serviceType"
            >Serviço prestado</label
          >
          <label
            for="register-accountancy--serviceType"
            class="input-field__select-area"
          >
            <select
              id="register-accountancy--serviceType"
              type="text"
              v-model="form.serviceType.value"
              @blur="
                visit('serviceType');
                validateInputs();
              "
              class="input-field__select-area__select input--darkened"
            >
              <option value="-1" selected>Selecione</option>
              <option>Teste 1</option>
              <option>Teste 2</option>
              <option>Teste 3</option>
              <option>Teste 4</option>
            </select>
            <img
              src="@/assets/images/icons/angle-down.svg"
              class="input-field__select-area__icon"
            />
          </label>

          <span
            v-if="form.serviceType.isValid === false"
            class="helper-text helper-text--error"
            >{{ form.serviceType.errorMessage }}</span
          >
        </div>
      </div>

      <div class="form__row">
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
      </div>

      <button
        @click.prevent="handleRegisterAccountancy"
        class="button button--primary width-full"
        :disabled="!isFormAvailable"
      >
        Criar conta
      </button>

      <p class="register-text">
        Já tem conta?
        <router-link :to="{ name: 'login' }">Faça login aqui</router-link>
      </p>
    </div>
  </form>
</template>
<script>
/**
 * Mixins
 * */
import formMixin from "@/data/mixins/form-mixin.js";
import registerAccountancyModel from "@/data/models/register-accountancy-model.js";

/**
 * Helpers
 * */
import { addAccountancyInfoToLocalStorage } from "@/helpers/local-storage";

/**
 * Services
 * */
import registerAccountancyService from "@/services/register-accountancy-service";

/**
 * Components
 * */
import Toast from "@/components/Toast.vue";
import Loader from "@/components/Loader.vue";

export default {
  name: "app-register-form",

  mixins: [formMixin, registerAccountancyModel],

  components: { Toast, Loader },

  computed: {
    isFormAvailable() {
      return this.isFormValid();
    },
  },

  data() {
    return {
      isBusy: false,

      serviceErrorMessage: null,
    };
  },

  methods: {
    validateInputs() {
      this.validateField({
        reference: this.form.firstName,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.lastName,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.email,
        validateFunction: this.validateEmail,
        errorMessage: this.messages.invalidEmail,
      });

      this.validateField({
        reference: this.form.phone,
        validateFunction: this.validatePhone,
        errorMessage: this.messages.invalidPhone,
      });

      this.validateField({
        reference: this.form.company,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.cnpj,
        validateFunction: this.validateCNPJOrCPF,
        errorMessage: this.messages.invalidCNPJMessage,
      });

      this.validateField({
        reference: this.form.clientsNumber,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.serviceType,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.serviceType,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validatePasswords(this.form.password, this.form.confirmPassword);
    },

    isFormValid() {
      if (
        this.form.firstName.isValid &&
        this.form.lastName.isValid &&
        this.form.email.isValid &&
        this.form.phone.isValid &&
        this.form.company.isValid &&
        this.form.cnpj.isValid &&
        this.form.clientsNumber.isValid &&
        this.form.serviceType.isValid &&
        this.form.password.isValid &&
        this.form.confirmPassword.isValid
      ) {
        return true;
      }

      return false;
    },

    async handleRegisterAccountancy() {
      this.isBusy = true;

      if (this.isFormValid()) {
        try {
          const registerAccountancyServiceResponse =
            await registerAccountancyService({
              firstName: this.form.firstName.value,
              lastName: this.form.lastName.value,
              email: this.form.email.value,
              phone: this.form.phone.value,
              company: this.form.company.value,
              cnpj: this.form.cnpj.value,
              clientsNumber: this.form.clientsNumber.value,
              serviceType: this.form.serviceType.value,
              password: this.form.password.value,
              confirmPassword: this.form.confirmPassword.value,
            });

          addAccountancyInfoToLocalStorage(registerAccountancyServiceResponse);

          this.isBusy = false;

          this.$router.push({ name: "validate-account" });
        } catch (error) {
          this.isBusy = false;
          this.serviceErrorMessage = error;
          this.$refs.toastError.show();
        }
      }
    },
  },
};
</script>
