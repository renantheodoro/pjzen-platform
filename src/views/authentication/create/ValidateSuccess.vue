<template lang="">
  <div class="validate-success">
    <router-link :to="{ name: 'create-accountancy-form' }"
      ><img
        src="@/assets/images/icons/pjzen-authentication.svg"
        class="authentication__view__logo"
    /></router-link>

    <div class="validate-success__content">
      <img src="@/assets/images/validate-success.svg" alt="" />

      <h1 class="no-mgn-t">Sucesso!</h1>
      <p>
        Sua conta foi validada e está pronta para utilizar! <br />
        Faça seu login!
      </p>

      <router-link :to="{ name: 'login' }" class="button button--primary">
        Fazer login
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: "app-validate-success",
};
</script>

<style lang="scss">

</style>
