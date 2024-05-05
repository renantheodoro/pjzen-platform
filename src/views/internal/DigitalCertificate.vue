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
        <h2
          v-if="canRegisterNewCertificate"
          class="view--register-digital-certificate__title"
        >
          Configuração do certificado digital
        </h2>

        <p
          v-if="canRegisterNewCertificate"
          class="view--register-digital-certificate__subtitle"
        >
          O certificado digital é essencial para utilizar em suas rotinas
          fiscais
        </p>

        <form class="form">
          <div v-if="canRegisterNewCertificate" class="form__section">
            <h3>Selecione o tipo de certificado da empresa selecionada</h3>

            <div class="form__row">
              <div class="input-field">
                <ChooseUnity
                  initialOption="certificate-a1"
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
                <label for="create-accountancy--password-1"
                  >Senha do Certificado Digital</label
                >
                <input
                  id="create-accountancy--password-1"
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
                    src="@/assets/images/icons/eye-password-slash.svg"
                    v-if="passwordFieldType1 === 'password'"
                  />
                  <img
                    src="@/assets/images/icons/eye-password.svg"
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
                    src="@/assets/images/icons/eye-password-slash.svg"
                    v-if="passwordFieldType2 === 'password'"
                  />
                  <img
                    src="@/assets/images/icons/eye-password.svg"
                    v-if="passwordFieldType2 === 'text'"
                  />
                </a>
              </div>
            </div>
          </div>

          <div v-if="canRegisterNewCertificate" class="form__footer">
            <div class="form__footer__buttons">
              <router-link
                class="button button--outline"
                :to="{ name: 'client', params: { id: clientId } }"
              >
                Cancelar</router-link
              >

              <button
                @click.prevent="handleSaveCertificate"
                class="button button--primary"
                :disabled="!isFormAvailable"
              >
                Salvar
              </button>
            </div>
          </div>

          <div class="form__section form_section--bottom">
            <h3>Certificados da empresa</h3>

            <TableCertificates
              :content="tableContent"
              :removeHeader="true"
              :removeSelectAll="true"
              :removePagination="true"
              @onDeleteCertificate="startDeleteCertificate"
            />
          </div>
        </form>
      </div>
    </Internal>

    <Modal ref="modal" :textCenter="true" :modalForm="true">
      <div class="profile-image profile-image--center profile-image--bigger">
        <img src="@/assets/images/profile-image-2.png" />
      </div>

      <h3 class="modal__title">Excluir certificado</h3>

      <p class="modal__text">
        Digite sua senha de acesso para confirmar as alterações cadastrais
        realizadas
      </p>

      <form @submit.prevent class="form form--vertical">
        <div class="form__section">
          <div
            class="input-field input-field--password"
            :class="{
              'input-field--error': authForm.password.isValid === false,
            }"
          >
            <label for="login--password">Senha</label>
            <input
              id="login--password"
              :type="passwordAuthFieldType"
              placeholder="Sua senha"
              v-model="authForm.password.value"
              @blur="
                visitAuth('password');
                validateAuthInputs();
              "
              class="input--darkened"
              autocomplete="current-password"
            />
            <span
              v-if="authForm.password.isValid === false"
              class="helper-text helper-text--error"
              >{{ authForm.password.errorMessage }}</span
            >

            <a
              @click.prevent="togglePasswordAuthView"
              class="input-field__password-button"
            >
              <img
                src="@/assets/images/icons/eye-password-slash.svg"
                v-if="passwordAuthFieldType === 'password'"
              />
              <img
                src="@/assets/images/icons/eye-password.svg"
                v-if="passwordAuthFieldType === 'text'"
              />
            </a>
          </div>
        </div>
      </form>

      <div class="modal__footer">
        <div class="modal__footer__buttons">
          <button class="button button--outline" @click="closeModal">
            Cancelar
          </button>
          <button
            :disabled="!isAuthFormAvailable"
            class="button button--primary"
            @click="confirmUserAccess"
          >
            Confirmar
          </button>
        </div>
      </div>
    </Modal>
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
import saveDigitalCertificateService from "@/services/internal/certificate/save-digital-certificate-service.js";
import getDigitalCertificateService from "@/services/internal/certificate/get-digital-certificate-list-service.js";
import formatDateToString from "@/helpers/format-date-to-string.js";
import deleteCertificateService from "@/services/internal/certificate/delete-digital-certificate-service.js";
import reauthenticateUser from "@/services/common/reauthenticate-user-service.js";
import { getAccountancyDataFromLocalStorage } from "@/helpers/local-storage";

/**
 * Components
 * */
import Internal from "@/components/Internal.vue";
import ChooseUnity from "@/components/ChooseUnity.vue";
import DragAndDrop from "@/components/DragAndDrop.vue";
import Toast from "@/components/Toast.vue";
import TableCertificates from "@/components/TableCertificates.vue";
import Loader from "@/components/Loader.vue";
import Modal from "@/components/Modal.vue";

import { addDays, isBefore } from "date-fns";

export default {
  name: "digital-certificate",

  mixins: [formMixin, saveDigitalCertificateModel],

  components: {
    Internal,
    ChooseUnity,
    DragAndDrop,
    TableCertificates,
    Toast,
    Loader,
    Modal,
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

      digitalCertificateFullDataList: [],

      passwordAuthFieldType: "password",

      authForm: {
        password: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
      },

      certificateId: null,

      tableContent: {
        head: ["Arquivo", "Válido até", "Situação"],
        body: [],
      },

      canRegisterNewCertificate: true,
    };
  },

  computed: {
    isFormAvailable() {
      return this.isFormValid();
    },

    isAuthFormAvailable() {
      return this.isAuthFormValid();
    },
  },

  mounted() {
    if (!this.$route.params.id) {
      this.$router.go(-1);
      return;
    }

    this.clientId = this.$route.params.id;

    this.getCertificatesList();
  },

  methods: {
    chooseCertificateType(option) {
      this.form.type.value = option;
      if (this.form.type.value) {
        this.form.type.isVisited = true;
      }
    },

    chooseFile(file) {
      this.form.file.value = file;
      if (this.form.file.value) {
        this.form.file.isVisited = true;
      }
      this.validateInputs();
    },

    togglePasswordView(index) {
      if (index === 1) {
        this.passwordFieldType1 =
          this.passwordFieldType1 === "password" ? "text" : "password";
      }

      if (index === 2) {
        this.passwordFieldType2 =
          this.passwordFieldType2 === "password" ? "text" : "password";
      }
    },

    togglePasswordAuthView() {
      this.passwordAuthFieldType =
        this.passwordAuthFieldType === "password" ? "text" : "password";
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

      this.validateSimplePasswords(
        this.form.password,
        this.form.confirmPassword
      );
    },

    visitAuth(field) {
      this.authForm[field].isVisited = true;
    },

    validateAuthInputs() {
      this.validateField({
        reference: this.authForm.password,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });
    },

    isAuthFormValid() {
      if (this.authForm.password.isValid) {
        return true;
      }
      return false;
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

    isExpiringCertificate(vencimento) {
      const currentDate = new Date();
      const futureDate = addDays(currentDate, 15);

      // Verificar se a data de vencimento está dentro dos próximos 15 dias
      if (isBefore(vencimento, futureDate)) {
        return true;
      }
      return false;
    },

    getCertificateState(certificate) {
      if (
        this.isExpiringCertificate(
          certificate.plugNotasCertificateData.vencimento
        )
      ) {
        return {
          statusColor: "pending",
          statusText: "Vencendo",
        };
      }

      if (!certificate.plugNotasCertificateData) {
        return {
          statusColor: "pending",
          statusText: "Pendente",
        };
      }

      if (!certificate.isActive) {
        return {
          statusColor: "inactive",
          statusText: "Inativo",
        };
      }
      return {
        statusColor: "imported",
        statusText: "Importado",
      };
    },

    getActiveCertificates() {
      const activeCertificates = [];

      for (const certificate of this.digitalCertificateFullDataList) {
        if (certificate.isActive) {
          activeCertificates.push(certificate);
        }
      }

      return activeCertificates;
    },

    buildBodyItem(item) {
      const name = item.plugNotasCertificateData.nome;
      const date =
        formatDateToString(item.plugNotasCertificateData.vencimento) ?? "--";

      const status = this.getCertificateState(item).statusColor;
      const statusContent = this.getCertificateState(item).statusText;

      return [
        {
          type: "name",
          content: name,
        },
        {
          type: "text",
          content: date,
        },
        {
          type: "status",
          status: status,
          content: statusContent,
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

    showDeleteModal() {
      this.$refs.modal.open();
    },

    closeModal() {
      this.$refs.modal.close();
    },

    startDeleteCertificate(index) {
      const currentCertificate = this.digitalCertificateFullDataList[index];

      if (currentCertificate) {
        this.certificateId = currentCertificate.id;
        this.showDeleteModal();
      }
    },

    async handleDeleteService() {
      this.isBusy = true;

      try {
        const deleteCertificateResponse = await deleteCertificateService(
          this.certificateId
        );

        if (deleteCertificateResponse) {
          this.showSuccessToast(
            "O certificado foi excluído com sucesso!",
            "Certificado excluído com sucesso!"
          );
        }

        this.isBusy = false;
        this.closeModal();
        this.getCertificatesList();
      } catch (error) {
        this.isBusy = false;

        const errorMessage = error
          ? error
          : "Não foi possível excluir o certificado. Tente novamente mais tarde.";

        this.showErrorToast("Falha ao excluir certificado", errorMessage);
      }
    },

    async confirmUserAccess() {
      this.isBusy = true;

      const accountancyEmail = getAccountancyDataFromLocalStorage()?.email;

      if (!accountancyEmail) {
        this.showErrorToast(
          "Ocorreu um erro ao buscar dados da contabilidade. Tente novamente mais tarde ou entre em contato com o surporte.",
          "Erro ao buscar dados da contabilidade"
        );
      }

      if (
        await reauthenticateUser(accountancyEmail, this.authForm.password.value)
      ) {
        await this.handleDeleteService();
      } else {
        this.showErrorToast(
          "Erro ao autenticar o usuário. Verifique suas credenciais e tente novamente.",
          "Erro ao autenticar usuário"
        );
      }

      this.isBusy = false;
    },

    async getCertificatesList() {
      this.isBusy = true;

      try {
        this.digitalCertificateFullDataList =
          await getDigitalCertificateService({
            companyUid: this.clientId,
          });

        this.buildTableBodyContent(this.digitalCertificateFullDataList);

        this.canRegisterNewCertificate =
          this.getActiveCertificates()?.length <= 0;

        this.isBusy = false;
      } catch (error) {
        this.isBusy = false;
        const errorMessage = error
          ? error
          : "Não foi possível resgatar os certificados. Tente novamente mais tarde.";

        this.showErrorToast(errorMessage, "Falha ao buscar certificados");
      }
    },

    async handleSaveCertificate() {
      this.isBusy = true;

      if (this.isFormValid()) {
        try {
          await saveDigitalCertificateService({
            companyUid: this.clientId,
            file: this.form.file.value,
            type: this.form.type.value,
            password: this.form.password.value,
          });

          this.showSuccessToast(
            "O certificado digital foi salvo com sucesso!",
            "Certificado salvo"
          );

          this.getCertificatesList();

          this.isBusy = false;
        } catch (error) {
          let errorMessage;

          if (error != null && typeof error === "string") {
            errorMessage = error;
          } else {
            errorMessage =
              "Não foi possível salvar o certificado. Tente novamente mais tarde.";
          }

          this.showErrorToast(errorMessage, "Falha ao salvar certificado");

          this.isBusy = false;
        }
      }
    },
  },
};
</script>
<style lang=""></style>
