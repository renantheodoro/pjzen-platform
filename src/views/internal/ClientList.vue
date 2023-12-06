<template>
  <div class="view view--client-list">
    <div class="container">
      <div class="view--client-list__header card">
        <div class="profile-image">
          <img src="@/assets/images/profile-image.png" />
        </div>

        <button class="button button--primary">
          Adicionar cliente
          <img src="@/assets/images/icons/plus.svg" class="button__icon" />
        </button>

        <button class="button button--transparent">
          Importar clientes
          <img src="@/assets/images/icons/download.svg" class="button__icon" />
        </button>
      </div>

      <Table
        title="Lista de clientes"
        tableType="CLIENT"
        :content="tableContent"
      />
    </div>
  </div>
</template>
<script>
import Table from "@/components/Table.vue";

export default {
  name: "app-client-list",

  data() {
    return {
      tableContent: {
        head: [
          "Nome",
          "Licença utilizada",
          "Status",
          "Última exportação",
          "Vencimento",
        ],

        body: [
          [
            {
              type: "checkbox",
              content: "Carla Brico da Rocha Guimarães Serviços Médicos",
            },
            {
              type: "text",
              content: "Pacote Contador",
            },
            {
              type: "status",
              status: "inactive",
              content: "Desativado",
            },
            {
              type: "text",
              content: "17/06/2023",
            },
            {
              type: "text",
              content: "31/06/2023",
            },
          ],
          [
            {
              type: "checkbox",
              content: "Carla Brico da Rocha Guimarães Serviços Médicos",
            },
            {
              type: "text",
              content: "Pacote Contador",
            },
            {
              type: "status",
              status: "active",
              content: "Ativo",
            },
            {
              type: "text",
              content: "17/06/2023",
            },
            {
              type: "text",
              content: "31/06/2023",
            },
          ],
        ],
      },
    };
  },

  components: {
    Table,
  },
};
</script>
