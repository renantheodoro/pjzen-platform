<template>
  <Toast
    ref="toast"
    :type="toast.type"
    :title="toast.title"
    :text="toast.message"
  />

  <SidebarClientFilter ref="sidebarClientFilter" @applyFilter="applyFilter" />

  <Loader v-if="isBusy" />

  <div class="view view--client-list">
    <div class="container">
      <div class="view--client-list__header card">
        <div class="profile-image">
          <img src="@/assets/images/profile-image.png" />
        </div>

        <router-link
          :to="{ name: 'create-company' }"
          class="button button--primary"
        >
          Adicionar cliente
          <img src="@/assets/images/icons/plus.svg" class="button__icon" />
        </router-link>

        <!-- <button class="button button--transparent">
          Importar clientes
          <img src="@/assets/images/icons/download.svg" class="button__icon" />
        </button> -->
      </div>

      <TableClient
        title="Lista de clientes"
        :content="tableContent"
        @onOpenProfile="openClient"
        @onEditProfile="editClient"
        @onFilterClick="openSidebarFilterClient"
      />
    </div>
  </div>
</template>
<script>
/**
 * Services
 * */
import getClientCompanyListService from "@/services/internal/company/get-client-company-list-service.js";

/**
 * Components
 * */
import TableClient from "@/components/TableClient.vue";
import Toast from "@/components/Toast.vue";
import Loader from "@/components/Loader.vue";
import SidebarClientFilter from "@/components/SidebarClientFilter.vue";

export default {
  name: "app-client-list",

  components: {
    TableClient,
    Toast,
    Loader,
    SidebarClientFilter,
  },

  data() {
    return {
      isBusy: false,

      toast: {
        type: null,
        message: null,
        title: null,
      },

      tableContent: {
        head: [
          "Razão social",
          // "Licença utilizada",
          "Status",
          "Última exportação",
          "Vencimento",
        ],

        body: [],
      },

      clientFullDataList: [],
    };
  },

  methods: {
    applyFilter(filter) {
      let filteredClientList = this.clientFullDataList;

      if (filter.searchForActive && !filter.searchForInactive) {
        // Filtrar apenas os clientes ativos
        filteredClientList = filteredClientList.filter(
          (item) => item.isActive === true
        );
      } else if (!filter.searchForActive && filter.searchForInactive) {
        // Filtrar apenas os clientes inativos
        filteredClientList = filteredClientList.filter(
          (item) => item.isActive === false
        );
      }

      // Se ambos os filtros estiverem ativados, não é necessário filtrar,
      // pois queremos mostrar tanto os clientes ativos quanto os inativos

      this.tableContent.body = [];
      this.buildTableBodyContent(filteredClientList);

      this.$refs.sidebarClientFilter.close();
    },

    openSidebarFilterClient() {
      this.$refs.sidebarClientFilter.show();
    },

    showSuccessToast(message) {
      this.toast = {
        type: "success",
        message: message,
        title: "Cliente cadastrado com sucesso!",
      };

      this.$refs.toast.show();
    },

    showErrorToast(message, title = "Falha ao cadastrar cliente") {
      this.toast = {
        type: "error",
        message: message,
        title: title,
      };

      this.$refs.toast.show();
    },

    buildBodyItem(client) {
      const name = client.businessName;
      // const planType = "-";
      const status = client.isActive ? "active" : "inactive";
      const statusContent = client.isActive ? "Ativo" : "Inativo";
      const lastExport = client.nfLastExport ?? "-";
      const dueDate = client.certificateNearestDueDate ?? "-";

      return [
        {
          type: "name",
          content: name,
        },
        // {
        //   type: "text",
        //   content: planType,
        // },
        {
          type: "status",
          status: status,
          content: statusContent,
        },
        {
          type: "text",
          content: lastExport,
        },
        {
          type: "text",
          content: dueDate,
        },
      ];
    },

    buildTableBodyContent(list) {
      for (let index = 0; index < list.length; index++) {
        const listItem = list[index];

        if (listItem) {
          this.tableContent.body.push(this.buildBodyItem(listItem));
        }
      }
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

        this.showErrorToast(errorMessage, "Falha ao buscar certificados");
      }
    },

    openClient(index) {
      this.$router.push({
        name: "client",
        params: { id: this.clientFullDataList[index].cpfCnpj },
      });
    },

    editClient(index) {
      this.$router.push({
        name: "company-data",
        params: { id: this.clientFullDataList[index].cpfCnpj },
      });
    },
  },

  created() {
    this.getClientCompanyList();
  },
};
</script>
