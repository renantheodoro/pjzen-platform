<template>
  <Loader v-if="isBusy" />

  <div class="view view--client-view">
    <Toast
      ref="toast"
      type="warning"
      title="NF em processamento"
      text="Você será notificado quando a NF estiver disponivel."
    />

    <Toast
      ref="toast"
      :type="toast.type"
      :title="toast.title"
      :text="toast.message"
    />

    <Internal v-if="clientId" :clientId="clientId">
      <Alert
        title="Certificado Digital expirando"
        :show="expiringCertificates.length"
      >
        Restam <strong>15 dias</strong> para o certificado Digital de
        <strong>{{ currentClient.businessName }}</strong>
        expirar. Verifique prazo e faça upload de um novo documento
      </Alert>

      <TableNFs
        title="Notas fiscais emitidas"
        :content="tableContent"
        @downloadNf="handleDownloadNF"
        @consult="consult"
        @duplicate="duplicate"
        @cancel="confirmCancel"
      />
    </Internal>

    <Modal ref="modal" :textCenter="true">
      <div class="profile-image profile-image--center profile-image--bigger">
        <img src="@/assets/images/profile-image-2.png" />
      </div>

      <h3 class="modal__title">Tem certeza que deseja cancelar esta NF?</h3>
      <p class="modal__text">
        Ao cancelar a nota fiscal, você perdera os dados fiscais deste
        documento, sendo necessário emitir uma nova.
      </p>

      <div class="modal__footer">
        <div class="modal__footer__buttons">
          <button class="button button--outline" @click="closeModal">
            Não, fechar.
          </button>
          <button
            class="button button--primary"
            @click.prevent="handleCancelNF"
          >
            Sim, cancelar!
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
/**
 * Components
 * */
import Loader from "@/components/Loader.vue";
import TableNFs from "@/components/TableNFs.vue";
import Toast from "@/components/Toast.vue";
import Alert from "@/components/Alert.vue";
import Internal from "@/components/Internal.vue";
import Modal from "@/components/Modal.vue";

/**
 * Services
 * */
import searchCertificatesToExpireService from "@/services/internal/certificate/search-certificates-to-expire-service.js";
import getNfListService from "@/services/internal/nf/get-nf-list-service.js";
import downloadNfService from "@/services/internal/nf/download-nf-pdf-service.js";
import cancelNfService from "@/services/internal/nf/cancel-nf-service.js";
import getMonthYearByTimestamp from "@/helpers/get-month-year-by-timestamp.js";
// import { formatCurrency } from "@/helpers/format-currency.js";
import { getPtStatusByNfStatus } from "@/helpers/get-nf-status.js";

export default {
  name: "app-client-view",

  components: {
    TableNFs,
    Toast,
    Alert,
    Internal,
    Loader,
    Modal,
  },

  data() {
    return {
      currentClient: null,
      clientId: null,

      isBusy: false,

      toast: {
        type: null,
        message: null,
        title: null,
      },

      nfList: [],

      tableContent: {
        head: ["Tomador", "Valor", "Data", "Status"],

        body: [],
      },

      expiringCertificates: [],
    };
  },

  methods: {
    buildBodyItem(nf) {
      const name =
        nf.taker.businessName ?? nf.plugNotasNfData.tomador.razaoSocial;
      const value = nf.totalWithDiscounts ?? "---";
      const date = getMonthYearByTimestamp(nf.createdAt);
      const status = getPtStatusByNfStatus(nf.status)?.status;

      // TODO: adicionar o status correto:
      // "Importada automaticamente" | "Cancelada" | "Concluída"
      const statusContent = getPtStatusByNfStatus(nf.status)?.content;

      return [
        {
          type: "name",
          content: name, // "Cristiane de Souza Pacheco",
        },
        {
          type: "text",
          content: value, // "R$ 150,00",
        },
        {
          type: "text",
          content: date, // "Junho/2023",
        },
        {
          type: "status",
          status: status,
          content: statusContent,
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

    showSuccessToast(message) {
      this.toast = {
        type: "success",
        message: message,
        title: "Cliente cadastrado com sucesso!",
      };

      this.$refs.toast.show();
    },

    showErrorToast(message, title) {
      this.toast = {
        type: "error",
        message: message,
        title: title,
      };

      this.$refs.toast.show();
    },

    getNfByIndex(index) {
      if (this.nfList?.length) {
        return this.nfList[index];
      }
      return null;
    },

    async handleDownloadNF(index) {
      this.isBusy = true;

      const nf = this.getNfByIndex(index);

      try {
        const response = await downloadNfService(nf.id);

        if (response?.data?.plugNotasData) {
          // Converter o conteúdo em Blob
          const blob = new Blob([response?.data?.plugNotasData], {
            type: "application/pdf",
          });

          // Criar URL temporário para o Blob
          const url = URL.createObjectURL(blob);

          // Criar um link de download
          const link = document.createElement("a");
          link.href = url;
          link.download = "certificado.pdf";

          // Simular um clique no link para iniciar o download
          link.click();

          // Limpar o URL temporário após o download
          URL.revokeObjectURL(url);
        } else {
          this.showErrorToast(
            "Ocorreu um erro desconhecido ao tentar realizar o download da nota. Tente novamnete mais tarde.",
            "Erro ao realizar download"
          );
        }

        this.isBusy = false;
      } catch (error) {
        this.showErrorToast(error, "Falha ao fazer download da nota");
        this.isBusy = false;
      }
    },

    consult(index) {
      const nf = this.getNfByIndex(index);

      this.$router.push({
        name: "nf-invoice-consult",
        params: { id: this.clientId, nfId: nf.id },
      });
    },

    duplicate(index) {
      const nf = this.getNfByIndex(index);

      this.$router.push({
        name: "nf-invoice-duplicate",
        params: { id: this.clientId, nfId: nf.id },
      });
    },

    async handleCancelNF() {
      this.isBusy = true;

      const nf = this.getNfByIndex(this.currentIndexNFToCancel);

      try {
        const response = await cancelNfService(nf.id);

        if (response.data) {
          await this.getNfList();
          this.closeModal();
        }

        this.isBusy = false;
      } catch (error) {
        this.showErrorToast(error, "Falha ao cancelar a nota");
        this.isBusy = false;
      }
    },

    confirmCancel(index) {
      this.currentIndexNFToCancel = index;
      this.$refs.modal.open();
    },

    closeModal() {
      this.currentIndexNFToCancel = null;
      this.$refs.modal.close();
    },

    async searchCertificatesToExpire() {
      const expiringCertificates = await searchCertificatesToExpireService(
        this.clientId
      );

      if (expiringCertificates.data?.length) {
        this.expiringCertificates = expiringCertificates.data;
      }
    },

    async getNfList() {
      this.isBusy = true;

      try {
        const nfResponse = await getNfListService(this.clientId);
        this.nfList = [];
        this.tableContent.body = [];

        this.nfList = nfResponse.data;

        this.buildTableBodyContent(nfResponse.data);

        this.isBusy = false;
      } catch (error) {
        this.showErrorToast(error);
        this.isBusy = false;
      }
    },
  },

  async mounted() {
    const clientId = this.$route.params.id;
    this.clientId = clientId;

    if (!clientId) {
      this.$router.go(-1);
    }

    await this.getNfList();
  },
};
</script>
<style lang=""></style>
