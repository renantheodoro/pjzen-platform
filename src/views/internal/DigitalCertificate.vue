<template>
  <Toast
    ref="toast"
    :type="toast.type"
    :title="toast.title"
    :text="toast.message"
  />

  <Loader v-if="isBusy" />

  <div class="view view--register-digital-certificate">
    <Internal v-if="clientId" :clientId="clientId">
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
                  option1="certificate-a1"
                  text1="Certificado A1"
                  option2="certificate-a3"
                  text2="Certificado A3"
                  @onSelectOption="chooseCertificateType"
                />
              </div>
            </div>

            <div class="form__row">
              <DragAndDrop
                :isValid="form.file.isValid"
                :errorMessage="form.file.errorMessage"
                @onFileSelected="chooseFile"
              ></DragAndDrop>
            </div>

            <div class="form__row">
              <div
                class="input-field input-field--password"
                :class="{
                  'input-field--error': form.password.isValid === false,
                }"
              >
                <label for="create-accountancy--password"
                  >Senha do Certificado Digital</label
                >
                <input
                  id="create-accountancy--password"
                  :type="passwordFieldType1"
                  placeholder="Sua senha"
                  v-model="form.password.value"
                  @blur="
                    visit('password');
                    validateInputs();
                  "
                />
                <span
                  v-if="form.password.isValid === false"
                  class="helper-text helper-text--error"
                  >{{ form.password.errorMessage }}</span
                >

                <a
                  @click.prevent="togglePasswordView(1)"
                  class="input-field__password-button compensate–right"
                >
                  <img
                    src="@/assets/images/icons/eye-password.svg"
                    v-if="passwordFieldType1 === 'password'"
                  />
                  <img
                    src="@/assets/images/icons/eye-password-slash.svg"
                    v-if="passwordFieldType1 === 'text'"
                  />
                </a>
              </div>

              <div
                class="input-field input-field--password"
                :class="{
                  'input-field--error': form.confirmPassword.isValid === false,
                }"
              >
                <label for="create-accountancy--confirmPassword"
                  >Confirmar senha do Certificado Digital</label
                >
                <input
                  id="create-accountancy--confirmPassword"
                  :type="passwordFieldType2"
                  placeholder="Repita sua senha"
                  v-model="form.confirmPassword.value"
                  @blur="
                    visit('confirmPassword');
                    validateInputs();
                  "
                />
                <span
                  v-if="form.confirmPassword.isValid === false"
                  class="helper-text helper-text--error"
                  >{{ form.confirmPassword.errorMessage }}</span
                >

                <a
                  @click.prevent="togglePasswordView(2)"
                  class="input-field__password-button"
                >
                  <img
                    src="@/assets/images/icons/eye-password.svg"
                    v-if="passwordFieldType2 === 'password'"
                  />
                  <img
                    src="@/assets/images/icons/eye-password-slash.svg"
                    v-if="passwordFieldType2 === 'text'"
                  />
                </a>
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
              <!-- TODO: o que esse botão faz? -->
              <button class="button button--outline">Cancelar</button>

              <button
                @click.prevent="handleSaveCertificate"
                class="button button--primary"
                :disabled="!isFormAvailable"
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
/**
 * Mixins
 * */
import formMixin from "@/data/mixins/form-mixin.js";
import saveDigitalCertificateModel from "@/data/models/save-digital-certificate-model.js";

/**
 * Services
 * */
import saveDigitalCertificateService from "@/services/company/save-digital-certificate-service.js";
import getDigitalCertificateService from "@/services/company/get-digital-certificate-list-service.js";

/**
 * Components
 * */
import Internal from "@/components/Internal.vue";
import ChooseUnity from "@/components/ChooseUnity.vue";
import DragAndDrop from "@/components/DragAndDrop.vue";
import Toast from "@/components/Toast.vue";
import Table from "@/components/Table.vue";
import Loader from "@/components/Loader.vue";

export default {
  name: "digital-certificate",

  mixins: [formMixin, saveDigitalCertificateModel],

  components: {
    Internal,
    ChooseUnity,
    DragAndDrop,
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

      clientId: null,

      passwordFieldType1: "password",
      passwordFieldType2: "password",

      digitalCertificateFullDataList: null,

      tableContent: {
        head: ["Arquivo", "Válido até", "Situação"],
        body: [],
      },
    };
  },

  mounted() {
    if (!this.$route.params.id) {
      this.$router.go(-1);
      return;
    }

    this.clientId = this.$route.params.id;

    this.getCertificatesList();
  },

  computed: {
    isFormAvailable() {
      return this.isFormValid();
    },
  },

  methods: {
    chooseCertificateType(option) {
      this.form.type.value = option;
      if (this.form.type.value) {
        this.form.type.isVisited = true;
      }
    },

    chooseFile(blobUrl) {
      this.form.file.value = blobUrl;
      if (this.form.file.value) {
        this.form.file.isVisited = true;
      }
      this.validateInputs();
    },

    togglePasswordView(index) {
      this[`passwordFieldType${index}`] =
        this[`passwordFieldType${index}`] === "password" ? "text" : "password";
    },

    validateInputs() {
      if (this.form.file.value === null) {
        this.form.file.isValid = false;
        this.form.file.errorMessage =
          "Arquivo obrigatório. Verifique o campo novamente.";
      } else {
        this.form.file.isValid = true;
        this.form.file.errorMessage = "";
      }

      this.validateField({
        reference: this.form.type,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validatePasswords(this.form.password, this.form.confirmPassword);
    },

    isFormValid() {
      if (
        this.form.file.isValid &&
        this.form.type.isValid &&
        this.form.password.isValid &&
        this.form.confirmPassword.isValid
      ) {
        return true;
      }

      return false;
    },

    showSuccessToast(message, title) {
      this.toast = {
        type: "success",
        message: message,
        title: title,
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

    certificateName(type) {
      if (type === "certificate-a1") {
        return "Certificado Digital A1";
      }

      return "Certificado Digital A3";
    },

    certificateDate(timestamp) {
      const { seconds, nanoseconds } = timestamp;
      const date = new Date(seconds * 1000 + nanoseconds / 1e6);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    },

    buildBodyItem(item) {
      return [
        {
          type: "text",
          content: this.certificateName(item.type),
        },
        {
          type: "text",
          // TODO: descobrir como pegar a data de vencimento, nao de quando foi criado
          // content: this.certificateDate(item.createdAt),
          content: "---",
        },
        {
          type: "status",
          status: "pending",
          content: "--",
        },
      ];
    },

    buildTableBodyContent(list) {
      this.tableContent.body = [];
      for (let index = 0; index < list.length; index++) {
        const listItem = list[index];

        if (listItem) {
          this.tableContent.body.push(this.buildBodyItem(listItem));
        }
      }
    },

    async getCertificatesList() {
      this.isBusy = true;

      try {
        const list = await getDigitalCertificateService({
          clientUid: this.clientId,
        });
        this.buildTableBodyContent(list);
        this.digitalCertificateFullDataList = list;

        this.isBusy = false;
      } catch (error) {
        this.isBusy = false;
        const errorMessage = error
          ? error
          : "Não foi possível resgatar os certificados. Entre em contato ou tente novamente mais tarde.";

        this.showErrorToast(errorMessage, "Falha ao buscar certificados");
      }
    },

    async handleSaveCertificate() {
      this.isBusy = true;

      if (this.isFormValid()) {
        try {
          await saveDigitalCertificateService({
            clientUid: this.clientId,
            file: this.form.file.value,
            type: this.form.type.value,
            password: this.form.password.value,
          });

          this.isBusy = false;

          this.showSuccessToast(
            "O certificado digital foi salvo com sucesso!",
            "Certificado salvo"
          );

          this.getCertificatesList();
        } catch (error) {
          this.isBusy = false;
          const errorMessage = error
            ? error
            : "Não foi possível salvar o certificado. Entre em contato ou tente novamente mais tarde.";

          this.showErrorToast(errorMessage, "Falha ao salvar certificado");
        }
      }
    },
  },
};
</script>
<style lang=""></style>
