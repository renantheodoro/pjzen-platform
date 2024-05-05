<template lang="">
  <Loader v-if="isBusy" />

  <SidebarClientSearch
    ref="sidebarFilter"
    v-if="clientFullDataList.length"
    :currentClientList="clientFullDataList"
  />

  <div v-if="currentClient" class="view__column view__column--sidebar">
    <router-link
      v-if="$route.name !== 'nf-invoice'"
      :to="{ name: 'nf-invoice' }"
      class="button button--primary button--text-left"
    >
      <img
        src="@/assets/images/icons/plus.svg"
        class="button__icon button__icon--left-side"
      />
      Emitir Nota Fiscal
    </router-link>

    <div class="client-details card">
      <!-- <div class="profile-image profile-image--center profile-image--big">
        <img src="@/assets/images/profile-image.png" />
      </div> -->

      <a
        @click.prevent="openSidebarFilter"
        class="client-details__main-button button button--icon button--text-left"
      >
        Selecionar cliente
        <img
          src="@/assets/images/icons/angle-down-blue.svg"
          class="button__icon button__icon--left-side"
        />
      </a>

      <h2 class="client-details__name">
        {{ currentClient.businessName.toUpperCase() }}
      </h2>

      <!-- <legend class="client-details__suport-id">ID de Suporte: ---</legend> -->

      <!-- <div class="client-details__plan">
        <div class="client-details__plan__column">
          <h3>PLANO</h3>
           <p><strong>Pacote Contador</strong></p> 
          <p><strong>---</strong></p>
        </div>
        <div class="client-details__plan__column">
          <h3>VENCIMENTO</h3>
          <p><strong>---</strong></p>
        </div>
      </div> -->

      <div
        :class="`status status--${
          currentClient.isActive ? 'active' : 'inactive'
        }`"
      >
        {{ currentClient.isActive ? "Ativo" : "Inativo" }}
      </div>

      <router-link
        :to="{ name: 'taker', params: { id: this.clientId } }"
        class="client-details__main-button button button--outline button--text-left"
      >
        <img
          src="@/assets/images/icons/outiline-plus.svg"
          class="button__icon button__icon--left-side"
        />
        Cadastrar novo tomador
      </router-link>

      <router-link
        :to="{ name: 'service', params: { id: this.clientId } }"
        class="client-details__main-button button button--link button--text-left"
      >
        <img
          src="@/assets/images/icons/outiline-plus.svg"
          class="button__icon button__icon--left-side"
        />
        Cadastrar novo serviço
      </router-link>

      <div class="divider"></div>

      <div class="client-details__links">
        <!-- <div class="client-details__links__block">
          <h3>PERFIL</h3>
          <nav>
            <router-link to=""> Dados Pessoais </router-link>
            <router-link to=""> Plano </router-link>
            <router-link to=""> Serviços </router-link>
          </nav>
        </div> -->
        <div class="client-details__links__block">
          <h3>CONTA</h3>
          <nav>
            <router-link
              :to="{ name: 'company-data', params: { id: clientId } }"
              active-class="active"
            >
              Dados da empresa
            </router-link>
            <router-link
              :to="{
                name: 'digital-certificate',
                params: { id: clientId },
              }"
              active-class="active"
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
/**
 * Components
 * */
import Loader from "@/components/Loader.vue";
import SidebarClientSearch from "@/components/SidebarClientSearch.vue";

/**
 * Services
 * */
import getClientCompanyService from "@/services/internal/company/get-client-by-id-service.js";
import getClientCompanyListService from "@/services/internal/company/get-client-company-list-service.js";

export default {
  name: "app-view-sidebar",

  components: {
    Loader,
    SidebarClientSearch,
  },

  data() {
    return {
      isBusy: false,
      currentClient: null,
      clientFullDataList: [],
    };
  },

  props: {
    clientId: {
      type: String,
      required: true,
    },
  },

  async created() {
    await this.getClientCompanyList();
    await this.handleGetClient();
  },

  methods: {
    openSidebarFilter() {
      this.$refs.sidebarFilter.show();
    },

    async getClientCompanyList() {
      this.isBusy = true;

      try {
        const clientsResponse = await getClientCompanyListService();

        if (clientsResponse.data) {
          const clientList = clientsResponse.data?.clientCompaniesData;
          this.clientFullDataList = clientList;
          this.buildTableBodyContent(clientList);
        }

        this.isBusy = false;
      } catch (error) {
        this.isBusy = false;
        const errorMessage = error
          ? error
          : "Não foi possível resgatar os clientes. Tente novamente mais tarde.";

        console.error(`${errorMessage}: ${error}`);
      }
    },

    async handleGetClient() {
      this.isBusy = true;

      try {
        const response = await getClientCompanyService(this.clientId);

        if (response?.data) {
          this.currentClient = response.data;
        }
      } catch (error) {
        this.isBusy = false;
        const errorMessage = error
          ? error
          : "Não foi possível buscar o cliente.";

        console.error(errorMessage);
      } finally {
        this.isBusy = false;
      }
    },
  },
};
</script>
