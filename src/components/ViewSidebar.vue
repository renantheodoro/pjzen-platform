<template lang="">
  <div class="view__column view__column--sidebar">
    <router-link
      :to="{ name: 'tax-invoice-issuance' }"
      class="button button--primary button--text-left"
    >
      <img
        src="@/assets/images/icons/plus.svg"
        class="button__icon button__icon--left-side"
      />
      Emitir Nota Fiscal
    </router-link>

    <div class="client-details card">
      <div class="profile-image profile-image--center profile-image--big">
        <img src="@/assets/images/profile-image.png" />
      </div>

      <h2 class="client-details__name">
        {{ currentClient.tradeName.toUpperCase() }}
      </h2>

      <legend class="client-details__suport-id">ID de Suporte: ---</legend>

      <div class="client-details__plan">
        <div class="client-details__plan__column">
          <h3>PLANO</h3>
          <!-- <p><strong>Pacote Contador</strong></p> -->
          <p><strong>---</strong></p>
        </div>
        <div class="client-details__plan__column">
          <h3>VENCIMENTO</h3>
          <p><strong>---</strong></p>
        </div>
      </div>

      <div class="status status--active">---</div>

      <a
        class="client-details__main-button button button--outline button--text-left"
      >
        <img
          src="@/assets/images/icons/outiline-plus.svg"
          class="button__icon button__icon--left-side"
        />
        Cadastrar novo tomador
      </a>

      <div class="divider"></div>

      <div class="client-details__links">
        <div class="client-details__links__block">
          <h3>PERFIL</h3>
          <nav>
            <!-- <router-link to=""> Dados Pessoais </router-link> -->
            <!-- <router-link to=""> Plano </router-link> -->
            <router-link to=""> Serviços </router-link>
          </nav>
        </div>
        <div class="client-details__links__block">
          <h3>CONTA</h3>
          <nav>
            <router-link to=""> Dados da empresa </router-link>
            <router-link
              :to="{
                name: 'digital-certificate',
                params: { id: currentClient.cnpj }, // TODO: atualizar para uid
              }"
            >
              Certificado digital
            </router-link>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "app-view-sidebar",

  props: {
    currentClient: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style lang=""></style>
