<template>
  <Toast
    ref="toastSuccess"
    type="success"
    title="Sucesso!"
    text="O certificado A1 foi importado com sucesso! Suas rotinas fiscais ficarão mais fáceis!"
  />

  <div class="view view--register-digital-certificate">
    <Internal>
      <div class="card">
        <h2 class="view--register-digital-certificate__title">
          Configuração do certificado digital
        </h2>
        <p class="view--register-digital-certificate__subtitle">
          O certificado digital é essencial para utilizar em suas rotinas
          fiscais
        </p>

        <form class="form">
          <div class="form__section">
            <h3>Selecione o tipo de certificado da empresa selecionada</h3>

            <div class="form__row">
              <div class="input-field">
                <ChooseUnity
                  option1="Certificado A1"
                  option2="Certificado A3"
                  @onSelectOption="console.log(event)"
                />
              </div>
            </div>

            <div class="form__row">
              <DraAndDrop></DraAndDrop>
            </div>

            <div class="form__row">
              <div class="input-field flex-1">
                <label>Senha do Certificado Digital</label>
                <input type="text" placeholder="Digite aqui" />
              </div>
              <div class="input-field flex-1">
                <label>Confirmar senha do Certificado Digital</label>
                <input type="text" placeholder="Digite aqui" />
              </div>
            </div>
          </div>

          <div class="form__section form_section--bottom">
            <h3>Certificados da empresa</h3>

            <Table
              tableType=""
              :content="tableContent"
              :removeHeader="true"
              :removeSelectAll="true"
              :removePagination="true"
            />
          </div>

          <div class="form__footer">
            <div class="form__footer__buttons">
              <button class="button button--outline">Cancelar</button>
              <button
                class="button button--primary"
                @click.prevent="showSuccessToast"
              >
                Salvar
              </button>
            </div>
          </div>
        </form>
      </div>
    </Internal>
  </div>
</template>
<script>
import Internal from "@/components/Internal.vue";
import ChooseUnity from "@/components/ChooseUnity.vue";
import DraAndDrop from "@/components/DragAndDrop.vue";
import Toast from "@/components/Toast.vue";
import Table from "@/components/Table.vue";

export default {
  name: "digital-certificate",

  data() {
    return {
      tableContent: {
        head: ["Arquivo", "Válido até", "Situação"],

        body: [
          [
            {
              type: "text",
              content: "Certificado Digital A1",
            },
            {
              type: "text",
              content: "17/06/2023",
            },
            {
              type: "status",
              status: "pending",
              content: "Pendente",
            },
          ],
          [
            {
              type: "text",
              content: "Certificado Digital A1",
            },
            {
              type: "text",
              content: "17/06/2023",
            },
            {
              type: "status",
              status: "imported",
              content: "Importado",
            },
          ],
        ],
      },
    };
  },

  methods: {
    showSuccessToast() {
      this.$refs.toastSuccess.show();
    },
  },

  components: {
    Internal,
    ChooseUnity,
    DraAndDrop,
    Table,Toast
  },
};
</script>
<style lang=""></style>
