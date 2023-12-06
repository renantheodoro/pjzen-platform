<template lang="">
  <div class="authentication">
    <div class="authentication_thumb">
      <img src="@/assets/images/authentication-thumb.png" />
    </div>

    <div class="authentication__view">
      <form class="form form--vertical">
        <img
          src="@/assets/images/icons/pjzen-authentication.svg"
          class="authentication__view__logo"
        />

        <h1 class="authentication__view__title">Faça seu login</h1>

        <div class="form__section">
          <div class="input-field">
            <label for="">E-mail</label>
            <input type="text" />
          </div>

          <div class="input-field input-field--password">
            <label for="">Senha</label>
            <input :type="passwordFieldType" />

            <a
              @click.prevent="togglePasswordView"
              class="input-field__password-button"
            >
              <img src="@/assets/images/icons/eye-password.svg" v-if="passwordFieldType === 'password'" />
              <img src="@/assets/images/icons/eye-password-slash.svg" v-if="passwordFieldType === 'text'" />
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

          <button class="button button--primary width-full">Entrar</button>

          <p class="register-text">
            É de uma empresa de contabilidade?
            <router-link :to="{ name: 'register-user' }"
              >Faça seu cadastro</router-link
            >
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  name: "app-login",

  data() {
    return {
      passwordFieldType: "password",
    };
  },

  methods: {
    togglePasswordView() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },
  },
};
</script>
