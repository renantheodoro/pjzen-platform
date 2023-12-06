<template lang="">
  <form class="form form--vertical">
    <img
      src="@/assets/images/icons/pjzen-authentication.svg"
      class="authentication__view__logo"
    />

    <h2 class="authentication__view__title">Faça seu cadastro</h2>

    <div class="form__section">
      <div class="form__row">
        <div class="input-field">
          <label for="">Nome</label>
          <input type="text" class="input--darkened" />
        </div>
        <div class="input-field">
          <label for="">Sobrenome</label>
          <input type="text" class="input--darkened" />
        </div>
      </div>

      <div class="form__row">
        <div class="input-field">
          <label for="">E-mail profissional</label>
          <input type="text" class="input--darkened" />
        </div>
        <div class="input-field">
          <label for="">Celular</label>
          <input type="text" class="input--darkened" />
        </div>
      </div>

      <div class="form__row">
        <div class="input-field">
          <label for="">Empresa</label>
          <input type="text" class="input--darkened" />
        </div>
        <div class="input-field">
          <label for="">CNPJ</label>
          <input type="text" class="input--darkened" />
        </div>
      </div>

      <div class="form__row">
        <div class="input-field">
          <label for="">Número de clientes</label>
          <input type="text" class="input--darkened" />
        </div>

        <div class="input-field">
          <label for="taker-option">Serviço prestado</label>
          <label for="taker-option" class="input-field__select-area">
            <select
              class="input-field__select-area__select input--darkened"
              name=""
              id="taker-option"
              ref=""
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

          <span v-if="false" class="helper-text helper-text--error">
            Error
          </span>
        </div>
      </div>

      <div class="form__row">
        <div class="input-field">
          <label for="">Crie sua senha</label>
          <input type="password" class="input--darkened" />
        </div>
        <div class="input-field">
          <label for="">Confirme sua senha</label>
          <input type="password" class="input--darkened" />
        </div>
      </div>

      <router-link
        to="./validar-conta"
        class="button button--primary width-full"
      >
        Criar conta
      </router-link>

      <p class="register-text">
        Já tem conta?
        <router-link :to="{ name: 'login' }">Faça login aqui</router-link>
      </p>
    </div>
  </form>
</template>
<script>
export default {
  name: "app-register-form",
};
</script>
