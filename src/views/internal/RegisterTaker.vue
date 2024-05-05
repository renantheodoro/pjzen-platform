<template>
  <Loader v-if="isBusy" />

  <Toast
    ref="toast"
    :type="toast.type"
    :title="toast.title"
    :text="toast.message"
  />

  <TableTaker
    v-if="!isInEditMode"
    @onButtonAction="showEditMode('create')"
    @onEditTaker="editTaker"
    @onDeleteService="startDeleteService"
    :content="tableContent"
  />

  <form v-if="isInEditMode" class="form">
    <h2>Tomador de Serviço</h2>

    <h3 class="form__subtitle">DADOS DO TOMADOR DE SERVIÇO</h3>

    <div class="form__section">
      <div class="form__row">
        <div
          class="input-field flex-1 max-width-50"
          :class="{
            'input-field--error': form.cpfCnpj.isValid === false,
          }"
        >
          <label for="create-accountancy--cnpj">CNPJ</label>

          <label class="label-wrapper">
            <input
              id="create-accountancy--cnpj"
              type="text"
              placeholder="__.___.___/___-__"
              v-model="form.cpfCnpj.value"
              v-mask="masks.cnpj"
              @keyup.enter="searchCNPJData"
              @blur="
                visit('cpfCnpj');
                validateInputs();
              "
            />
            <img
              src="@/assets/images/icons/search.svg"
              class="input-field__icon"
              @click="searchCNPJData"
            />
          </label>

          <span
            v-if="form.cpfCnpj.isValid === false"
            class="helper-text helper-text--error"
            >{{ form.cpfCnpj.errorMessage }}</span
          >
        </div>

        <div
          class="input-field flex-1 max-width-50"
          :class="{
            'input-field--error': form.businessName.isValid === false,
          }"
        >
          <label for="create-client--businessName">Razão Social</label>
          <input
            id="create-client--businessName"
            type="text"
            placeholder="Digite aqui"
            v-model="form.businessName.value"
            @blur="
              visit('businessName');
              validateInputs();
            "
          />
          <span
            v-if="form.businessName.isValid === false"
            class="helper-text helper-text--error"
            >{{ form.businessName.errorMessage }}</span
          >
        </div>
      </div>

      <div class="form__section">
        <div class="form__row">
          <div
            class="input-field flex-3"
            :class="{
              'input-field--error': form.zipcode.isValid === false,
            }"
          >
            <label>CEP</label>
            <label class="label-wrapper">
              <input
                type="text"
                id="create-client--zipcode"
                placeholder="Digite aqui"
                v-model="form.zipcode.value"
                v-mask="masks.zipCode"
                @keyup.enter="searchAddress"
                @blur="
                  visit('zipcode');
                  validateInputs();
                "
              />
              <img
                src="@/assets/images/icons/search.svg"
                class="input-field__icon"
                @click="searchAddress"
              /> </label
            ><span
              v-if="form.zipcode.isValid === false"
              class="helper-text helper-text--error"
              >{{ form.zipcode.errorMessage }}</span
            >
          </div>

          <div
            class="input-field"
            :class="{
              'input-field--error': form.street.isValid === false,
            }"
          >
            <label for="create-client--street">Endereço</label>
            <input
              id="create-client--street"
              placeholder="Digite aqui"
              type="text"
              v-model="form.street.value"
              @blur="
                visit('street');
                validateInputs();
              "
            />
            <span
              v-if="form.street.isValid === false"
              class="helper-text helper-text--error"
              >{{ form.street.errorMessage }}</span
            >
          </div>

          <div
            class="input-field"
            :class="{
              'input-field--error': form.number.isValid === false,
            }"
          >
            <label for="create-client--number">Número</label>
            <input
              id="create-client--number"
              type="text"
              placeholder="Digite aqui"
              ref="number"
              v-model="form.number.value"
              @blur="
                visit('number');
                validateInputs();
              "
            />
            <span
              v-if="form.number.isValid === false"
              class="helper-text helper-text--error"
              >{{ form.number.errorMessage }}</span
            >
          </div>
        </div>

        <div class="form__row">
          <div
            class="input-field"
            :class="{
              'input-field--error': form.city.isValid === false,
            }"
          >
            <label for="create-client--city">Cidade</label>
            <input
              id="create-client--city"
              type="text"
              placeholder="Digite aqui"
              v-model="form.city.value"
              @blur="
                visit('city');
                validateInputs();
              "
            />
            <span
              v-if="form.city.isValid === false"
              class="helper-text helper-text--error"
              >{{ form.city.errorMessage }}</span
            >
          </div>

          <div
            class="input-field"
            :class="{
              'input-field--error': form.neighborhood.isValid === false,
            }"
          >
            <label for="create-client--neighborhood">Bairro</label>
            <input
              id="create-client--neighborhood"
              type="text"
              placeholder="Digite aqui"
              v-model="form.neighborhood.value"
              @blur="
                visit('neighborhood');
                validateInputs();
              "
            />
            <span
              v-if="form.neighborhood.isValid === false"
              class="helper-text helper-text--error"
              >{{ form.neighborhood.errorMessage }}</span
            >
          </div>

          <div
            class="input-field"
            :class="{
              'input-field--error': form.uf.isValid === false,
            }"
          >
            <label for="create-client--uf">Estado</label>
            <input
              id="create-client--uf"
              type="text"
              placeholder="Digite aqui"
              v-model="form.uf.value"
              @blur="
                visit('uf');
                validateInputs();
              "
            />
            <span
              v-if="form.uf.isValid === false"
              class="helper-text helper-text--error"
              >{{ form.uf.errorMessage }}</span
            >
          </div>

          <div
            class="input-field"
            :class="{
              'input-field--error': form.complement.isValid === false,
            }"
          >
            <label for="create-client--complement">Complemento</label>
            <input
              id="create-client--complement"
              type="text"
              placeholder="Digite aqui"
              v-model="form.complement.value"
              @blur="
                visit('complement');
                validateInputs();
              "
            />
            <span
              v-if="form.complement.isValid === false"
              class="helper-text helper-text--error"
              >{{ form.complement.errorMessage }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <h3 class="form__subtitle">DADOS DE CONTATO</h3>

    <div class="form__section">
      <div class="form__row">
        <div
          class="input-field"
          :class="{
            'input-field--error': form.phone.isValid === false,
          }"
        >
          <label for="create-client--phone">Telefone</label>
          <input
            id="create-client--phone"
            type="text"
            placeholder="Seu número"
            v-model="form.phone.value"
            v-mask="masks.phone"
            @blur="
              visit('phone');
              validateInputs();
            "
          />
          <span
            v-if="form.phone.isValid === false"
            class="helper-text helper-text--error"
            >{{ form.phone.errorMessage }}</span
          >
        </div>

        <div
          class="input-field"
          :class="{
            'input-field--error': form.email.isValid === false,
          }"
        >
          <label for="create-client--email">E-mail</label>
          <input
            id="create-client--email"
            type="text"
            placeholder="Seu e-mail"
            v-model="form.email.value"
            @blur="
              visit('email');
              validateInputs();
            "
          />
          <span
            v-if="form.email.isValid === false"
            class="helper-text helper-text--error"
            >{{ form.email.errorMessage }}</span
          >
        </div>
      </div>
    </div>

    <div class="form__footer">
      <div class="form__footer__buttons">
        <button @click.prevent="resetEditMode" class="button button--outline">
          Cancelar
        </button>

        <button
          v-if="isInEditMode && editMode === 'create'"
          @click.prevent="handleCreateTakerService"
          class="button button--primary"
          :disabled="!isFormAvailable"
        >
          Salvar
        </button>

        <button
          v-if="isInEditMode && editMode === 'update'"
          @click.prevent="handleEditClientTaker"
          class="button button--primary"
          :disabled="!isFormAvailable"
        >
          Salvar
        </button>
      </div>
    </div>
  </form>

  <Modal ref="modal" :textCenter="true">
    <div class="profile-image profile-image--center profile-image--bigger">
      <img src="@/assets/images/profile-image-2.png" />
    </div>

    <h3 class="modal__title">Deseja confirmar a exclusão do tomador?</h3>

    <p class="modal__text">
      Certifique-se de que realmente quer excluir o tomador antes de clicar em
      “confirmar”
    </p>

    <div class="modal__footer">
      <div class="modal__footer__buttons">
        <button class="button button--outline" @click="closeModal">
          Cancelar
        </button>
        <button class="button button--primary" @click="handleDeleteTaker">
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
import takerServiceClientModel from "@/data/models/taker-client-service-model.js";

/**
 * Services
 * */
import createTakerService from "@/services/internal/taker/create-taker-service.js";
import updateTakerService from "@/services/internal/taker/update-taker-service.js";
import deleteTakerService from "@/services/internal/taker/delete-taker-service.js";
import getTakerListService from "@/services/internal/taker/get-taker-list-service.js";
import searchCNPJInfo from "@/services/common/search-cnpj-info-service.js";
import getDateByTimestamp from "@/helpers/get-date-by-timestamp.js";

/**
 * Components
 * */
import Loader from "@/components/Loader.vue";
import TableTaker from "@/components/TableTaker.vue";
import Toast from "@/components/Toast.vue";
import Modal from "@/components/Modal.vue";

export default {
  name: "app-register-service",

  mixins: [formMixin, takerServiceClientModel],

  components: {
    Loader,
    TableTaker,
    Toast,
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

      isInEditMode: false,
      editMode: null, // create | update
      editCurrentCpfCnpj: null,

      tableContent: {
        head: ["Tomador", "Última edição em", "Status"],

        body: [],
      },

      takerList: [],
    };
  },

  computed: {
    isFormAvailable() {
      return this.isFormValid();
    },

    takerListString() {
      if (this.takerList) {
        return this.takerList.map((taker) => taker.takerName);
      } else {
        return [];
      }
    },
  },

  methods: {
    async searchAddress() {
      const response = await this.completeZipcodeData();

      if (response.error) {
        this.showErrorToast(
          "Falha ao buscar dados do CEP",
          response.error.message
        );
      }
    },

    async searchCNPJData() {
      if (!this.form.cpfCnpj.isValid) return;

      this.isBusy = true;

      const response = await searchCNPJInfo(this.form.cpfCnpj.value);

      if (response.data.error) {
        this.isBusy = false;
        this.showErrorToast(
          "CNPJ não encontrado",
          "Não foram encontrados dados para o CNPJ informado"
        );
        return;
      }

      if (response.data) {
        const cnpjData = response.data;

        const takerFound = {
          cpfCnpj: this.form.cpfCnpj.value,
          businessName: cnpjData["RAZAO SOCIAL"],
          zipcode: cnpjData["CEP"],
          street: `${cnpjData["TIPO LOGRADOURO"]} ${cnpjData["LOGRADOURO"]}`,
          number: cnpjData["NUMERO"],
          city: cnpjData["MUNICIPIO"],
          uf: cnpjData["UF"],
          neighborhood: cnpjData["BAIRRO"],
          complement: cnpjData["COMPLEMENTO"],
          phone: `${cnpjData["DDD"]} ${cnpjData["TELEFONE"]}`,
          email: cnpjData["EMAIL"],
        };

        this.autoCompleteFormWithSelectedTaker(takerFound);
      }

      this.isBusy = false;
    },

    autoCompleteFormWithSelectedTaker(selectedTaker) {
      const formUpdated = {};

      for (const key in selectedTaker) {
        const fieldData = selectedTaker[key];
        let value = fieldData;

        // Trata campos aninhados
        if (typeof fieldData === "object" && fieldData !== null) {
          value = fieldData.value;
        }

        let isValid;

        if (key === "complement") {
          isValid = null;
        } else if (value !== null && value !== "") {
          isValid = true;
        } else {
          isValid = false;
        }

        formUpdated[key] = {
          value: value,
          isValid: isValid,
          isVisited: true,
        };
      }

      this.updateForm(formUpdated);
    },

    selectCurrentTaker(takerString) {
      const index = this.takerListString.findIndex(
        (taker) => taker === takerString
      );
      if (index !== -1) {
        const selectedTaker = this.takerList[index];

        const takerData = {
          cpfCnpj: selectedTaker?.cpfCnpj ?? null,
          businessName: selectedTaker?.businessName ?? null,
          zipcode: selectedTaker?.address?.zipcode ?? null,
          street: selectedTaker?.address?.street ?? null,
          number: selectedTaker?.address?.number ?? null,
          uf: selectedTaker?.address?.uf ?? null,
          city: selectedTaker?.address?.city ?? null,
          neighborhood: selectedTaker?.address?.neighborhood ?? null,
          complement: selectedTaker?.address?.complement ?? null,
          phone: selectedTaker?.phone ?? null,
          email: selectedTaker?.email ?? null,
        };

        this.autoCompleteFormWithSelectedTaker(takerData);
      }
    },

    showSuccessToast(message, title = "Tomador cadastrado com sucesso!") {
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

    showEditMode(mode = "create") {
      this.editMode = mode;
      this.isInEditMode = true;
    },

    resetEditMode() {
      this.editCurrentCpfCnpj = null;
      this.form = this.buildEmptyForm();
      this.isInEditMode = false;
    },

    validateInputs() {
      this.validateField({
        reference: this.form.cpfCnpj,
        validateFunction: this.validateCNPJOrCPF,
        errorMessage: this.messages.invalidCNPJMessage,
      });

      this.validateField({
        reference: this.form.businessName,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.zipcode,
        // validateFunction: this.validateZipcode,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.street,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.number,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.city,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.neighborhood,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.phone,
        validateFunction: this.validatePhone,
        errorMessage: this.messages.invalidPhone,
      });

      this.validateField({
        reference: this.form.email,
        validateFunction: this.validateEmail,
        errorMessage: this.messages.invalidEmail,
      });
    },

    isFormValid() {
      if (
        this.form.cpfCnpj.isValid &&
        this.form.businessName.isValid &&
        this.form.zipcode.isValid &&
        this.form.street.isValid &&
        this.form.number.isValid &&
        this.form.city.isValid &&
        this.form.uf.isValid &&
        this.form.neighborhood.isValid &&
        this.form.phone.isValid &&
        this.form.email.isValid
      ) {
        return true;
      }

      return false;
    },

    buildBodyItem(taker) {
      const name = taker.businessName;
      const lastEdit = getDateByTimestamp(taker.lastModifiedAt);
      const status = taker.isActive ? "active" : "inactive";
      const statusContent = taker.isActive ? "Ativo" : "Inativo";

      return [
        {
          type: "name",
          content: name,
        },
        {
          type: "text",
          content: lastEdit,
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

    showDeleteModal() {
      this.$refs.modal.open();
    },

    closeModal() {
      this.$refs.modal.close();
    },

    editTaker(index) {
      if (
        this.takerList[index].businessName ===
        this.tableContent.body[index].find((item) => item.type === "name")
          .content
      ) {
        const takerData = {
          cpfCnpj: this.takerList[index]?.cpfCnpj ?? null,
          businessName: this.takerList[index]?.businessName ?? null,
          zipcode: this.takerList[index]?.address?.zipcode ?? null,
          street: this.takerList[index]?.address?.street ?? null,
          number: this.takerList[index]?.address?.number ?? null,
          uf: this.takerList[index]?.address?.uf ?? null,
          city: this.takerList[index]?.address?.city ?? null,
          neighborhood: this.takerList[index]?.address?.neighborhood ?? null,
          complement: this.takerList[index]?.address?.complement ?? null,
          phone: this.takerList[index]?.phone ?? null,
          email: this.takerList[index]?.email ?? null,
        };

        this.autoCompleteFormWithSelectedTaker(takerData);

        this.showEditMode("update");
      }
    },

    startDeleteService(index) {
      if (
        this.takerList[index].businessName ===
        this.tableContent.body[index].find((item) => item.type === "name")
          .content
      ) {
        this.editCurrentCpfCnpj = this.takerList[index].cpfCnpj;

        this.showDeleteModal();
      }
    },

    async handleDeleteTaker() {
      this.isBusy = true;

      try {
        const deleteTakerResponse = await deleteTakerService(
          this.editCurrentCpfCnpj
        );

        if (deleteTakerResponse) {
          this.showSuccessToast(
            "O tomador foi excluído com sucesso!",
            "Tomador excluído com sucesso!"
          );
        }

        this.isBusy = false;
        this.closeModal();
        this.resetEditMode();
        this.getTakerList();
      } catch (error) {
        this.isBusy = false;

        const errorMessage = error
          ? error
          : "Não foi possível excluir o tomador. Tente novamente mais tarde.";

        this.showErrorToast("Falha ao excluir tomador", errorMessage);
      }
    },

    async getTakerList() {
      this.isBusy = true;

      try {
        const response = await getTakerListService(this.clientId);

        if (response.data) {
          this.takerList = [];
          this.tableContent.body = [];

          const takerList = response.data.clientTakers;
          this.takerList = response.data.clientTakers;
          this.buildTableBodyContent(takerList);
        }

        this.isBusy = false;
      } catch (error) {
        const errorMessage = error
          ? error
          : "Não foi possível carregar os tomadores. Tente novamente mais tarde.";

        this.showErrorToast("Falha ao buscar tomadores", errorMessage);

        this.isBusy = false;
      }
    },

    async handleCreateTakerService() {
      if (this.isFormValid()) {
        this.isBusy = true;

        try {
          const takerData = {
            companyUid: this.clientId,
            cpfCnpj: this.form.cpfCnpj.value,
            businessName: this.form.businessName.value,
            address: {
              zipcode: this.form.zipcode.value,
              street: this.form.street.value,
              number: this.form.number.value,
              city: this.form.city.value,
              uf: this.form.uf.value,
              neighborhood: this.form.neighborhood.value,
              complement: this.form.complement.value,
            },
            phone: this.form.phone.value,
            email: this.form.email.value,
          };

          const takerServiceResponse = await createTakerService(takerData);

          if (takerServiceResponse) {
            this.showSuccessToast("O tomador foi cadastrado com sucesso!");
          }

          this.isBusy = false;

          this.resetEditMode();

          this.getTakerList();
        } catch (error) {
          this.isBusy = false;

          let errorMessage;

          if (error != null && typeof error === "string") {
            errorMessage = error;
          } else {
            errorMessage =
              "Não foi possível criar tomador. Tente novamente mais tarde.";
          }

          this.showErrorToast("Falha ao cadastrar tomador", errorMessage);
        }
      }
    },

    async handleEditClientTaker() {
      if (this.isFormValid()) {
        this.isBusy = true;

        try {
          const takerData = {
            companyUid: this.clientId,
            cpfCnpj: this.form.cpfCnpj.value,
            businessName: this.form.businessName.value,
            address: {
              zipcode: this.form.zipcode.value,
              street: this.form.street.value,
              number: this.form.number.value,
              city: this.form.city.value,
              uf: this.form.uf.value,
              neighborhood: this.form.neighborhood.value,
              complement: this.form.complement.value,
            },
            phone: this.form.phone.value,
            email: this.form.email.value,
          };

          const takerServiceResponse = await updateTakerService(takerData);

          if (takerServiceResponse) {
            this.showSuccessToast("O tomador foi atualizado com sucesso!");
          }

          this.isBusy = false;

          this.resetEditMode();

          this.getTakerList();
        } catch (error) {
          this.isBusy = false;

          let errorMessage;

          if (error != null && typeof error === "string") {
            errorMessage = error;
          } else {
            errorMessage =
              "Não foi possível atualizar tomador. Tente novamente mais tarde.";
          }

          this.showErrorToast("Falha ao atualizar tomador", errorMessage);
        }
      }
    },
  },

  mounted() {
    if (!this.$route.params.id) {
      this.$router.go(-1);
      return;
    }

    this.clientId = this.$route.params.id;

    this.getTakerList();
  },
};
</script>
