<template lang="">
  <Toast
    ref="toastError"
    type="error"
    title="Falha ao criar conta"
    :text="serviceErrorMessage"
  />
  <Loader v-if="isBusy" />

  <form class="form form--vertical">
    <router-link :to="{ name: 'create-accountancy-form' }"
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
          <label for="create-accountancy--firstName">Nome</label>
          <input
            id="create-accountancy--firstName"
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
          <label for="create-accountancy--lastName">Sobrenome</label>
          <input
            id="create-accountancy--lastName"
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
          <label for="create-accountancy--email">E-mail profissional</label>
          <input
            id="create-accountancy--email"
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
          <label for="create-accountancy--phone">Celular</label>
          <input
            id="create-accountancy--phone"
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
          <label for="create-accountancy--company">Empresa</label>
          <input
            id="create-accountancy--company"
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
          <label for="create-accountancy--cnpj">CNPJ</label>
          <input
            id="create-accountancy--cnpj"
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
          <label for="create-accountancy--clientsNumber"
            >Número de clientes</label
          >
          <input
            id="create-accountancy--clientsNumber"
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
          <label for="create-accountancy--serviceType">Serviço prestado</label>
          <label
            for="create-accountancy--serviceType"
            class="input-field__select-area"
          >
            <select
              id="create-accountancy--serviceType"
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
          class="input-field input-field--password"
          :class="{
            'input-field--error': form.password.isValid === false,
          }"
        >
          <label for="create-accountancy--password">Crie sua senha</label>
          <input
            id="create-accountancy--password"
            :type="passwordFieldType1"
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

          <a
            @click.prevent="togglePasswordView(1)"
            class="input-field__password-button compensate–right"
          >
            <img
              src="@/assets/images/icons/eye-password-slash.svg"
              v-if="passwordFieldType1 === 'password'"
            />
            <img
              src="@/assets/images/icons/eye-password.svg"
              v-if="passwordFieldType1 === 'text'"
            />
          </a>
        </div>

        <div
          class="input-field input-field--password"
          :class="{
            'input-field--error': form.confirmPassword.isValid === false,
          }"
        >
          <label for="create-accountancy--confirmPassword"
            >Confirme sua senha</label
          >
          <input
            id="create-accountancy--confirmPassword"
            :type="passwordFieldType2"
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

          <a
            @click.prevent="togglePasswordView(2)"
            class="input-field__password-button"
          >
            <img
              src="@/assets/images/icons/eye-password-slash.svg"
              v-if="passwordFieldType2 === 'password'"
            />
            <img
              src="@/assets/images/icons/eye-password.svg"
              v-if="passwordFieldType2 === 'text'"
            />
          </a>
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
import registerAccountancyModel from "@/data/models/create-accountancy-model.js";

/**
 * Services
 * */
import createAccountancyService from "@/services/authentication/create-accountancy-service.js";

/**
 * Components
 * */
import Toast from "@/components/Toast.vue";
import Loader from "@/components/Loader.vue";

export default {
  name: "app-create-form",

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

      passwordFieldType1: "password",
      passwordFieldType2: "password",
    };
  },

  methods: {
    togglePasswordView(index) {
      this[`passwordFieldType${index}`] =
        this[`passwordFieldType${index}`] === "password" ? "text" : "password";
    },
    
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
          await createAccountancyService({
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

          this.isBusy = false;

          this.$router.push({ name: "validate-account" });
        } catch (error) {
          this.isBusy = false;
          this.serviceErrorMessage = error
            ? error
            : "Não foi possível criar conta. Tente novamente mais tarde.";
          this.$refs.toastError.show();
        }
      }
    },
  },
};
</script>
