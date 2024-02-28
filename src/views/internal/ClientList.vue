<template>
  <Toast
    ref="toast"
    :type="toast.type"
    :title="toast.title"
    :text="toast.message"
  />

  <Loader v-if="isBusy" />

  <div class="view view--client-list">
    <div class="container">
      <div class="view--client-list__header card">
        <div class="profile-image">
          <img src="@/assets/images/profile-image.png" />
        </div>

        <router-link
          :to="{ name: 'company-data' }"
          class="button button--primary"
        >
          Adicionar cliente
          <img src="@/assets/images/icons/plus.svg" class="button__icon" />
        </router-link>

        <button class="button button--transparent">
          Importar clientes
          <img src="@/assets/images/icons/download.svg" class="button__icon" />
        </button>
      </div>

      <Table
        title="Lista de clientes"
        tableType="CLIENT"
        :content="tableContent"
        @onOpenProfile="openClient"
      />
    </div>
  </div>
</template>
<script>
/**
 * Services
 * */
import getClientCompanyListService from "@/services/company/get-client-company-list-service.js";

/**
 * Components
 * */
import Table from "@/components/Table.vue";
import Toast from "@/components/Toast.vue";
import Loader from "@/components/Loader.vue";

export default {
  name: "app-client-list",

  components: {
    Table,
    Toast,
    Loader,
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
          "Nome",
          "Licença utilizada",
          "Status",
          "Última exportação",
          "Vencimento",
        ],

        body: [
          // [
          //   {
          //     type: "checkbox",
          //     content: "Carla Brico da Rocha Guimarães Serviços Médicos",
          //   },
          //   {
          //     type: "text",
          //     content: "Pacote Contador",
          //   },
          //   {
          //     type: "status",
          //     status: "inactive",
          //     content: "Desativado",
          //   },
          //   {
          //     type: "text",
          //     content: "17/06/2023",
          //   },
          //   {
          //     type: "text",
          //     content: "31/06/2023",
          //   },
          // ],
          // [
          //   {
          //     type: "checkbox",
          //     content: "Carla Brico da Rocha Guimarães Serviços Médicos",
          //   },
          //   {
          //     type: "text",
          //     content: "Pacote Contador",
          //   },
          //   {
          //     type: "status",
          //     status: "active",
          //     content: "Ativo",
          //   },
          //   {
          //     type: "text",
          //     content: "17/06/2023",
          //   },
          //   {
          //     type: "text",
          //     content: "31/06/2023",
          //   },
          // ],
        ],
      },

      clientFullDataList: [],
    };
  },

  methods: {
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
      const name = client.tradeName;
      const planType = "-";
      const status = "-";
      const statusContent = "-";
      const lastExport = "-";
      const dueDate = "-";

      return [
        {
          type: "checkbox",
          content: name,
        },
        {
          type: "text",
          content: planType,
        },
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
        const clientList = await getClientCompanyListService();
        this.buildTableBodyContent(clientList);

        this.isBusy = false;
      } catch (error) {
        this.isBusy = false;
        const errorMessage = error
          ? error
          : "Não foi possível resgatar os clientes. Entre em contato ou tente novamente mais tarde.";

        this.showErrorToast(errorMessage, "Falha ao buscar certificados");
      }
    },

    openClient(index) {
      this.$router.push({
        name: "create-service",
        query: { clientId: this.clientFullDataList[index].cnpj },
      });
    },
  },

  created() {
    this.getClientCompanyList();
  },
};
</script>
