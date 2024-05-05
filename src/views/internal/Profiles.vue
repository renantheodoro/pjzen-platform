<template lang="">
  <Loader v-if="isBusy" />

  <Toast
    ref="toast"
    :type="toast.type"
    :title="toast.title"
    :text="toast.message"
  />

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
          <span
            ><img src="@/assets/images/icons/angle-right-black.svg" alt=""
          /></span>
          <router-link :to="{ name: 'profiles' }"> Perfis </router-link>
        </div>
      </div>

      <div class="view--configuration__content card">
        <div class="view--configuration__content__profiles">
          <a
            @click.prevent="showAddProfileModal"
            class="button button--primary button--text-left"
          >
            <img
              src="@/assets/images/icons/plus.svg"
              class="button__icon button__icon--left-side"
            />
            Adicionar colaborador
          </a>

          <TableProfiles
            :content="tableContent"
            @onEditCollaborator="showEditProfileModal"
            @onDeleteCollaborator="showModalDelete"
          />
        </div>
      </div>
    </div>
  </div>

  <Modal ref="modal" :textCenter="true" :modalPopup="true">
    <div class="modal__popup">
      <div class="modal__popup__header">
        <h3>{{ isEditingProfile ? "Editar" : "Atualizar" }} colaborador</h3>

        <a @click.prevent="closeModal">
          <img src="@/assets/images/icons/times-blue.svg" alt="" />
        </a>
      </div>

      <div class="modal__popup__content">
        <form class="form">
          <div class="form__section">
            <div class="form__row">
              <div
                class="input-field"
                :class="{
                  'input-field--error': form.email.isValid === false,
                }"
              >
                <label for="create-client--email">Email</label>
                <input
                  id="create-client--email"
                  type="text"
                  placeholder="Digite o e-mail"
                  v-model="form.email.value"
                  @blur="
                    visit('email');
                    validateInputs();
                  "
                  :disabled="isEditingProfile"
                />
                <span
                  v-if="form.email.isValid === false"
                  class="helper-text helper-text--error"
                  >{{ form.email.errorMessage }}</span
                >
              </div>
            </div>

            <div class="form__row">
              <div
                class="input-field"
                :class="{
                  'input-field--error': form.permission.isValid === false,
                }"
              >
                <label for="create-client--permission">Permissão</label>
                <label
                  for="create-client--permission"
                  class="input-field__select-area"
                >
                  <select
                    id="create-client--permission"
                    v-model="form.permission.value"
                    @blur="
                      visit('permission');
                      validateInputs();
                    "
                    @change="selectUf"
                    class="input-field__select-area__select"
                  >
                    <option value="-1" selected>Selecione</option>
                    <option value="collaborator">Colaborador</option>
                    <option value="editor">Editor</option>
                  </select>
                  <img
                    src="@/assets/images/icons/angle-down.svg"
                    class="input-field__select-area__icon"
                  />
                </label>

                <span
                  v-if="form.permission.isValid === false"
                  class="helper-text helper-text--error"
                  >{{ form.permission.errorMessage }}</span
                >
              </div>
            </div>
          </div>
        </form>

        <div class="modal__popup__footer">
          <button
            class="button button--primary"
            @click="handleAction"
            :disabled="!isFormAvailable"
          >
            {{ isEditingProfile ? "Atualizar" : "Enviar" }}
          </button>
        </div>
      </div>
    </div>
  </Modal>

  <Modal ref="modalDelete" :textCenter="true">
    <div class="profile-image profile-image--center profile-image--bigger">
      <img src="@/assets/images/profile-image-2.png" />
    </div>

    <h3 class="modal__title">Deseja confirmar a exclusão do perfil?</h3>

    <p class="modal__text">
      Certifique-se de que realmente quer excluir o perfil antes de clicar em
      “confirmar”
    </p>

    <div class="modal__footer">
      <div class="modal__footer__buttons">
        <button class="button button--outline" @click="closeModalDelete">
          Cancelar
        </button>
        <button
          class="button button--primary"
          @click="handleDeleteCollaborator"
        >
          Confirmar
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
/**
 * Mixins
 * */
import formMixin from "@/data/mixins/form-mixin.js";
import profilesModel from "@/data/models/profiles-model.js";

/**
 * Services
 * */
import updateProfileAccount from "@/services/authentication/update-profile-service.js";
import deleteProfileAccount from "@/services/authentication/delete-profile-service.js";
import sendProfileInviteService from "@/services/authentication/send-profile-invite-service.js";
import getProfileListService from "@/services/authentication/get-profile-list-service.js";
import { getAccountancyDataFromLocalStorage } from "@/helpers/local-storage.js";
/**
 * Components
 * */

import TableProfiles from "@/components/TableProfiles.vue";
import Modal from "@/components/Modal.vue";
import Loader from "@/components/Loader.vue";
import Toast from "@/components/Toast.vue";

export default {
  name: "app-profiles",

  mixins: [formMixin, profilesModel],

  components: { TableProfiles, Modal, Loader, Toast },

  data() {
    return {
      isBusy: false,

      toast: {
        type: null,
        message: null,
        title: null,
      },

      tableContent: {
        head: ["Nome", "E-mail", "Status", "Função", "Ações"],
        body: [],
      },

      profileList: [],

      isEditingProfile: false,
      currentProfile: null,
    };
  },

  computed: {
    isFormAvailable() {
      return this.isFormValid();
    },
  },

  methods: {
    validateInputs() {
      this.validateField({
        reference: this.form.email,
        validateFunction: this.validateEmail,
        errorMessage: this.messages.invalidEmail,
      });

      this.validateField({
        reference: this.form.permission,
        validateFunction: this.validateSelect,
        errorMessage: this.messages.requiredMessage,
      });
    },

    isFormValid() {
      if (this.form.email.isValid && this.form.permission.isValid) {
        return true;
      }

      return false;
    },

    showAddProfileModal() {
      this.isEditingProfile = false;
      this.form.email.value = "";
      this.form.permission.value = "-1";
      this.$refs.modal.open();
    },

    showEditProfileModal(index) {
      this.isEditingProfile = true;
      const currentProfile = this.profileList[index];
      this.currentProfile = currentProfile;
      this.form.email.value = currentProfile.email;
      this.visit("email");
      this.form.permission.value = currentProfile.permission;
      this.visit("permission");
      this.validateInputs();
      this.$refs.modal.open();
    },

    closeModal() {
      this.isEditingProfile = false;
      this.form.email.value = "";
      this.form.permission.value = "-1";
      this.$refs.modal.close();
    },

    showModalDelete(index) {
      this.isEditingProfile = true;
      const currentProfile = this.profileList[index];
      this.currentProfile = currentProfile;

      if (this.currentProfile.isActive) {
        this.$refs.modalDelete.open();
      }
    },

    closeModalDelete() {
      this.isEditingProfile = false;
      this.$refs.modalDelete.close();
    },

    getPermissionName(permission) {
      switch (permission) {
        case "collaborator":
          return "Colaborador";

        case "editor":
          return "Editor";

        default:
          return "Desconhecido";
      }
    },

    buildBodyItem(item) {
      const name = item.firstName;
      const email = item.email;
      const office = this.getPermissionName(item.permission);
      const isActive = item.isActive;
      const status = isActive ? "active" : "inactive";
      const statusText = isActive ? "Ativo" : "Inativo";

      return [
        {
          type: "name",
          content: name,
        },
        {
          type: "text",
          content: email,
        },
        {
          type: "status",
          status: status,
          content: statusText,
        },
        {
          type: "status",
          status: "active",
          content: office,
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

    showSuccessToast(message, title = "Convite enviado com sucesso!") {
      this.toast = {
        type: "success",
        message: message,
        title: title,
      };

      this.$refs.toast.show();
    },

    showErrorToast(title, message) {
      this.toast = {
        type: "error",
        title: title,
        message: message,
      };

      this.$refs.toast.show();
    },

    async handleSendInviteEmail() {
      if (this.isFormValid()) {
        this.isBusy = true;

        try {
          const profileData = {
            email: this.form.email.value,
            permission: this.form.permission.value,
          };

          const response = await sendProfileInviteService(profileData);

          if (response) {
            this.showSuccessToast("O convite foi enviado com sucesso!");
            this.closeModal();
          }

          this.isBusy = false;
        } catch (error) {
          this.isBusy = false;

          let errorMessage;

          if (error != null && typeof error === "string") {
            errorMessage = error;
          } else {
            errorMessage =
              "Não foi possível enviar o convite. Tente novamente mais tarde.";
          }

          console.error(`${errorMessage}: ${error}`);

          this.showErrorToast("Falha ao enviar convite", errorMessage);
        }
      }
    },

    async handleEditCollaborator() {
      this.isBusy = true;

      if (this.isFormValid()) {
        try {
          await updateProfileAccount({
            profileUid: this.currentProfile.uid,
            newPermission: this.form.permission.value,
          });

          await this.getProfiles();

          this.showSuccessToast(
            "O perfil foi atualizado com sucesso!",
            "Perfil atualizado"
          );

          this.closeModalDelete();

          this.isBusy = false;
        } catch (error) {
          this.isBusy = false;

          let errorMessage;

          if (error != null && typeof error === "string") {
            errorMessage = error;
          } else {
            errorMessage =
              "Não foi possível atualizar o perfil. Tente novamente mais tarde";
          }

          console.error(`${errorMessage}: ${error}`);

          this.showErrorToast("Falha ao atualizar perfil", errorMessage);
        }
      }
    },

    handleAction() {
      if (this.isEditingProfile) {
        this.handleEditCollaborator();
      } else {
        this.handleSendInviteEmail();
      }
    },

    async handleDeleteCollaborator() {
      this.isBusy = true;

      try {
        await deleteProfileAccount(this.currentProfile.uid);

        await this.getProfiles();

        this.showSuccessToast(
          "O perfil foi excluído com sucesso!",
          "Perfil excluído"
        );

        this.closeModal();

        this.isBusy = false;
      } catch (error) {
        this.isBusy = false;

        let errorMessage;

        if (error != null && typeof error === "string") {
          errorMessage = error;
        } else {
          errorMessage =
            "Não foi possível excluir o perfil. Tente novamente mais tarde";
        }

        console.error(`${errorMessage}: ${error}`);

        this.showErrorToast("Falha ao excluir perfil", errorMessage);
      }
    },

    async getProfiles() {
      this.isBusy = true;

      const accountancyUid = getAccountancyDataFromLocalStorage()?.uid;

      try {
        const response = await getProfileListService(accountancyUid);
        this.profileList = response.data ?? [];

        this.buildTableBodyContent(response.data ?? []);

        this.isBusy = false;
      } catch (error) {
        this.isBusy = false;

        let errorMessage;

        if (error != null && typeof error === "string") {
          errorMessage = error;
        } else {
          errorMessage =
            "Não foi possível buscar os perfis. Tente novamente mais tarde";
        }

        console.error(`${errorMessage}: ${error}`);

        this.showErrorToast("Falha ao buscar perfis", errorMessage);
      }
    },
  },

  mounted() {
    this.getProfiles();
  },
};
</script>
<style lang=""></style>
