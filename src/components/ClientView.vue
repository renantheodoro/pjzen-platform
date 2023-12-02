<template>
  <div class="view view--client-view">
    <Toast
      ref="toast"
      type="warning"
      title="NF em processamento"
      text="Você será notificado quando a NF estiver disponivel."
    />

    <Internal>
      <Alert title="Certificado Digital expirando" :show="true">
        Restam <strong>15 dias</strong> para o certificado Digital de
        <strong>CARLA BRITO DA ROCHA GUIMARÃES SERVICOS MEDICOS</strong>
        expirar. Verifique prazo e faça upoad de um novo documetno
      </Alert>

      <Table
        title="Notas fiscais emitidas"
        tableType="TAKER"
        :content="tableContent"
      />
    </Internal>
  </div>
</template>
<script>
import Table from "@/components/Table.vue";
import Toast from "@/components/Toast.vue";
import Alert from "@/components/Alert.vue";
import Internal from "./Internal.vue";

export default {
  name: "app-client-view",

  data() {
    return {
      tableContent: {
        head: ["Tomador", "Valor", "Data", "Status"],

        body: [
          [
            {
              type: "checkbox",
              content: "Cristiane de Souza Pacheco",
            },
            {
              type: "text",
              content: "R$ 150,00",
            },
            {
              type: "text",
              content: "Junho/2023",
            },
            {
              type: "status",
              status: "active",
              content: "Importada automaticamente",
            },
          ],
          [
            {
              type: "checkbox",
              content: "Cristiane de Souza Pacheco",
            },
            {
              type: "text",
              content: "R$ 150,00",
            },
            {
              type: "text",
              content: "Junho/2023",
            },
            {
              type: "status",
              status: "waiting",
              content: "Aguardando retorno",
            },
          ],
          [
            {
              type: "checkbox",
              content: "Cristiane de Souza Pacheco",
            },
            {
              type: "text",
              content: "R$ 150,00",
            },
            {
              type: "text",
              content: "Junho/2023",
            },
            {
              type: "status",
              status: "active",
              content: "Importada automaticamente",
            },
          ],
          [
            {
              type: "checkbox",
              content: "Cristiane de Souza Pacheco",
            },
            {
              type: "text",
              content: "R$ 150,00",
            },
            {
              type: "text",
              content: "Junho/2023",
            },
            {
              type: "status",
              status: "active",
              content: "Importada automaticamente",
            },
          ],
          [
            {
              type: "checkbox",
              content: "Cristiane de Souza Pacheco",
            },
            {
              type: "text",
              content: "R$ 150,00",
            },
            {
              type: "text",
              content: "Junho/2023",
            },
            {
              type: "status",
              status: "active",
              content: "Importada automaticamente",
            },
          ],
        ],
      },
    };
  },

  methods: {
    show() {
      this.$refs.toast.show();
    },
  },

  mounted() {
    this.show();
  },

  components: {
    Table,
    Toast,
    Alert,
    Internal,
  },
};
</script>
<style lang=""></style>
