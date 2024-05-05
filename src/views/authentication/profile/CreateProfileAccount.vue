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
        @submit.prevent="handleCreateProfileAccount"
        class="form form--vertical"
      >
        <img
          src="@/assets/images/icons/pjzen-authentication.svg"
          class="authentication__view__logo"
        />

        <h1 class="authentication__view__title">
          Cadastre uma conta de colaborador
        </h1>

        <div class="form__section">
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
            />
            <span
              v-if="form.lastName.isValid === false"
              class="helper-text helper-text--error"
              >{{ form.lastName.errorMessage }}</span
            >
          </div>

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
              disabled
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
              autocomplete="current-password"
            />
            <span
              v-if="form.password.isValid === false"
              class="helper-text helper-text--error"
              >{{ form.password.errorMessage }}</span
            >

            <a
              @click.prevent="togglePasswordView(1)"
              class="input-field__password-button"
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
import profileAccountModel from "@/data/models/profile-account-model.js";

/**
 * Services
 * */
import createProfileAccountService from "@/services/authentication/create-profile-account-service.js";

/**
 * Components
 * */
import Toast from "@/components/Toast.vue";
import Loader from "@/components/Loader.vue";

export default {
  name: "app-create-profile-account",

  mixins: [formMixin, profileAccountModel],

  components: { Toast, Loader },

  computed: {
    isFormAvailable() {
      return this.isFormValid();
    },
  },

  data() {
    return {
      isBusy: false,

      passwordFieldType1: "password",
      passwordFieldType2: "password",

      toast: {
        type: null,
        message: null,
        title: null,
      },

      serviceErrorMessage: null,
      serviceSuccessMessage: null,

      accountancyUid: null,
      profileUid: null,
    };
  },

  mounted() {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const accountancyUid = params.get("accountancyUid");
    const profileUid = params.get("profileUid");

    if (
      !email ||
      email === "" ||
      !accountancyUid ||
      accountancyUid === "" ||
      !profileUid === "profileUid"
    ) {
      this.$router.go(-1);
    }

    this.form.email.value = email;
    this.accountancyUid = accountancyUid;
    this.profileUid = profileUid;

  },

  methods: {
    togglePasswordView(index) {
      this[`passwordFieldType${index}`] =
        this[`passwordFieldType${index}`] === "password" ? "text" : "password";
    },

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
        title: "Conta criada com sucesso!",
      };

      this.$refs.toast.show();
    },

    showErrorToast(message) {
      this.toast = {
        type: "error",
        message: message,
        title: "Falha ao cadastrar conta",
      };

      this.$refs.toast.show();
    },

    async handleCreateProfileAccount() {
      this.isBusy = true;

      if (this.isFormValid()) {
        try {
          const createProfileAccountResponse =
            await createProfileAccountService({
              firstName: this.form.firstName.value,
              lastName: this.form.lastName.value,
              email: this.form.email.value,
              password: this.form.password.value,
              accountancyUid: this.accountancyUid,
              profileUid: this.profileUid,
            });

          if (createProfileAccountResponse) {
            this.showSuccessToast(createProfileAccountResponse);
          }

          this.isBusy = false;

          this.$router.push({ name: "profile-account-success" });
        } catch (error) {
          this.isBusy = false;

          let errorMessage;

          if (error != null && typeof error === "string") {
            errorMessage = error;
          } else {
            errorMessage =
              "Não foi possível criar conta. Tente novamente mais tarde.";
          }

          this.showErrorToast(errorMessage);
        }
      }
    },
  },
};
</script>
