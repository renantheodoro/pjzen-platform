<template lang="">
  <div class="authentication authentication--recovery-password">
    <div class="authentication_thumb">
      <img src="@/assets/images/authentication-thumb.png" />
    </div>

    <div class="authentication__view">
      <div class="validate-success">
        <router-link :to="{ name: 'register-accountancy-form' }">
          <img
            src="@/assets/images/icons/pjzen-authentication.svg"
            class="authentication__view__logo"
          />
        </router-link>

        <div class="validate-success__content">
          <h1>Sucesso!</h1>
          <p>Sua senha foi recuperada e está pronta para ser utilizada!</p>

          <router-link :to="{ name: 'login' }" class="button button--primary">
            Fazer login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "app-recovery-password",
};
</script>
