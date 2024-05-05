<template lang="">
  <div class="view view--configuration">
    <div class="container">
      <div class="view--configuration__header card">
        <h1>Configurações</h1>
        <div class="breadcrumb">
          <router-link :to="{ name: 'initial' }"> Home </router-link>
          <span
            ><img src="@/assets/images/icons/angle-right-black.svg" alt=""
          /></span>
          <router-link :to="{ name: 'configuration' }">
            Configurações
          </router-link>
        </div>
      </div>

      <div class="view--configuration__content card">
        <div class="view--configuration__content__card-links">
          <router-link :to="{ name: 'profiles' }">
            <img src="@/assets/images/icons/user-blue.svg" alt="" />
            <span>Gerenciar Colaboradores </span>
          </router-link>

          <!-- <router-link to="">
            <img src="@/assets/images/icons/user-blue.svg" alt="" />
            <span>Gerenciar Colaboradores </span>
          </router-link> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "app-configuration",
};
</script>
<style lang=""></style>
