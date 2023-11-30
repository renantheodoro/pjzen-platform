<template>
  <div class="view view--dashboard">
    <div class="container">
      <h2>Links temporários</h2>
      <nav class="nav-list">
        <router-link :to="{ name: 'dashboard' }">Dashboard</router-link>
        <router-link :to="{ name: 'client-list' }">Clientes</router-link>
        <router-link :to="{ name: 'client' }">Visão do cliente</router-link>
        <router-link :to="{ name: 'tax-invoice-issuance' }"
          >Emitir Nota Fiscal</router-link
        >
        <router-link :to="{ name: 'company-data' }"
          >Dados da Empresa</router-link
        >
      </nav>
    </div>
  </div>
</template>
<script>
export default {
  name: "app-dashboard",
};
</script>
<style lang=""></style>
