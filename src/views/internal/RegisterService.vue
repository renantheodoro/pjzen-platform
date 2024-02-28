<template>
  <Toast
    ref="toast"
    :type="toast.type"
    :title="toast.title"
    :text="toast.message"
  />

  <Loader v-if="isBusy" />
  <div class="view view--register-service">
    <Internal v-if="clientId" :clientId="clientId">
      <div class="card no-pad">
        <ul class="tabs">
          <li
            @click="
              tabSection = 1;
              resetEditMode;
            "
            :class="{ active: tabSection === 1 }"
          >
            <img src="@/assets/images/icons/list.svg" class="tabs__icon" />
            <img
              src="@/assets/images/icons/list-active.svg"
              class="tabs__icon tabs__icon--active"
            />
            Lista de serviços
          </li>

          <li
            @click="
              tabSection = 2;
              resetEditMode;
            "
            :class="{ active: tabSection === 2 }"
          >
            <img src="@/assets/images/icons/user-plus.svg" class="tabs__icon" />
            <img
              src="@/assets/images/icons/user-plus-active.svg"
              class="tabs__icon tabs__icon--active"
            />
            Lista de tomadores de serviço
          </li>
        </ul>

        <div class="tab-section">
          <div v-if="tabSection === 1" class="tab-section">
            <Table
              v-if="!isRegisteringService"
              @onButtonAction="showServiceEditMode"
              tableType="SERVICE"
              :content="serviceTableContent"
              :removePagination="true"
              :removeFilter="true"
              buttonActionText="Novo Serviço"
              searchText="Busque pelo nome ou pelo número do serviço"
            />

            <form v-if="isRegisteringService" class="form">
              <h2>DADOS DO SERVIÇO</h2>

              <h3 class="form__subtitle">Informações fiscais</h3>

              <div class="form__section">
                <div class="form__row">
                  <div
                    class="input-field flex-3"
                    :class="{
                      'input-field--error': form.serviceName.isValid === false,
                    }"
                  >
                    <label for="create-client--serviceName"
                      >Nome do serviço</label
                    >
                    <label class="label-wrapper">
                      <input
                        id="create-client--serviceName"
                        type="text"
                        placeholder=""
                        v-model="form.serviceName.value"
                        @blur="
                          visit('serviceName');
                          validateInputs();
                        "
                        @keyup.enter="searchList"
                      />
                      <img
                        src="@/assets/images/icons/search.svg"
                        class="input-field__icon"
                        @click="searchList"
                      />
                    </label>
                    <span
                      v-if="form.serviceName.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.serviceName.errorMessage }}</span
                    >
                  </div>

                  <div
                    class="input-field flex-1 max-width-50"
                    :class="{
                      'input-field--error': form.internalCode.isValid === false,
                    }"
                  >
                    <label for="create-client--internalCode"
                      >Código interno</label
                    >
                    <input
                      id="create-client--internalCode"
                      type="text"
                      placeholder=""
                      v-model="form.internalCode.value"
                      @blur="
                        visit('internalCode');
                        validateInputs();
                      "
                    />
                    <span
                      v-if="form.internalCode.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.internalCode.errorMessage }}</span
                    >
                  </div>

                  <div
                    class="input-field"
                    :class="{
                      'input-field--error': form.type.isValid === false,
                    }"
                  >
                    <label for="create-client--type">Tipo</label>
                    <label
                      for="create-client--type"
                      class="input-field__select-area"
                    >
                      <select
                        id="create-client--type"
                        v-model="form.type.value"
                        @blur="
                          visit('type');
                          validateInputs();
                        "
                        class="input-field__select-area__select"
                      >
                        <option value="-1" selected>Selecione</option>
                        <option>Teste 1</option>
                        <option>Teste 2</option>
                        <option>Teste 3</option>
                        <option>Teste 4</option>
                      </select>
                      <img
                        src="@/assets/images/icons/angle-down.svg"
                        class="input-field__select-area__icon"
                      />
                    </label>

                    <span
                      v-if="form.type.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.type.errorMessage }}</span
                    >
                  </div>
                </div>

                <div class="form__row">
                  <div
                    class="input-field flex-1 max-width-50"
                    :class="{
                      'input-field--error': form.sellingValue.isValid === false,
                    }"
                  >
                    <label for="create-client--sellingValue"
                      >Valor da venda</label
                    >
                    <input
                      id="create-client--sellingValue"
                      type="text"
                      v-model="form.sellingValue.value"
                      @blur="
                        visit('sellingValue');
                        validateInputs();
                      "
                    />
                    <span
                      v-if="form.sellingValue.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.sellingValue.errorMessage }}</span
                    >
                  </div>

                  <div
                    class="input-field flex-1 max-width-50"
                    :class="{
                      'input-field--error': form.coastValue.isValid === false,
                    }"
                  >
                    <label for="create-client--coastValue"
                      >Valor do custo</label
                    >
                    <input
                      id="create-client--coastValue"
                      type="text"
                      v-model="form.coastValue.value"
                      @blur="
                        visit('coastValue');
                        validateInputs();
                      "
                    />
                    <span
                      v-if="form.coastValue.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.coastValue.errorMessage }}</span
                    >
                  </div>
                </div>
              </div>

              <h3 class="form__subtitle">DADOS FISCAIS</h3>

              <div class="form__section">
                <div class="form__row">
                  <Autocomplete
                    label="CNAE do serviço"
                    placeholder="Selecione"
                    :itemList="cnaeServiceOptions"
                    :hasError="form.cnae.isValid === false"
                    :errorMessage="form.cnae.errorMessage"
                    @onSelect="selectCNAE"
                    @blur="
                      visit('cnae');
                      validateInputs();
                    "
                  ></Autocomplete>
                </div>

                <div class="form__row">
                  <div
                    class="input-field flex-1 max-width-50"
                    :class="{
                      'input-field--error':
                        form.municipalServiceCode.isValid === false,
                    }"
                  >
                    <label for="create-client--municipalServiceCode"
                      >Código de serviço municipal</label
                    >
                    <input
                      id="create-client--municipalServiceCode"
                      type="text"
                      v-model="form.municipalServiceCode.value"
                      @blur="
                        visit('municipalServiceCode');
                        validateInputs();
                      "
                    />
                    <span
                      v-if="form.municipalServiceCode.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.municipalServiceCode.errorMessage }}</span
                    >
                  </div>

                  <div
                    class="input-field flex-1 max-width-50"
                    :class="{
                      'input-field--error':
                        form.complementaryLawCode.isValid === false,
                    }"
                  >
                    <label for="create-client--complementaryLawCode"
                      >Código de lei complementar</label
                    >
                    <input
                      id="create-client--complementaryLawCode"
                      type="text"
                      class="input--darkened"
                      v-model="form.complementaryLawCode.value"
                      @blur="
                        visit('complementaryLawCode');
                        validateInputs();
                      "
                    />
                    <span
                      v-if="form.complementaryLawCode.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.complementaryLawCode.errorMessage }}</span
                    >
                  </div>
                </div>

                <div class="form__row">
                  <div
                    class="input-field max-width-50"
                    :class="{
                      'input-field--error':
                        form.operationNature.isValid === false,
                    }"
                  >
                    <label for="create-client--operationNature"
                      >Natureza da operação</label
                    >
                    <label
                      for="create-client--operationNature"
                      class="input-field__select-area"
                    >
                      <select
                        id="create-client--operationNature"
                        v-model="form.operationNature.value"
                        @blur="
                          visit('operationNature');
                          validateInputs();
                        "
                        class="input-field__select-area__select"
                      >
                        <option value="-1" selected>Selecione</option>
                        <option>Teste 1</option>
                        <option>Teste 2</option>
                        <option>Teste 3</option>
                        <option>Teste 4</option>
                      </select>
                      <img
                        src="@/assets/images/icons/angle-down.svg"
                        class="input-field__select-area__icon"
                      />
                    </label>

                    <span
                      v-if="form.operationNature.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.operationNature.errorMessage }}</span
                    >
                  </div>
                </div>
              </div>

              <div class="form__footer">
                <div class="form__footer__buttons">
                  <button
                    @click.prevent="resetEditMode"
                    class="button button--outline"
                  >
                    Cancelar
                  </button>
                  <button
                    @click.prevent="handleCreateClientService"
                    class="button button--primary"
                    :disabled="!isFormAvailable"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div v-if="tabSection === 2" class="tab-section">
            <Table
              v-if="!isRegisteringTaker"
              @onButtonAction="showTakerEditMode"
              tableType="SERVICE"
              :content="takerTableContent"
              :removePagination="true"
              :removeFilter="true"
              buttonActionText="Novo Tomador"
              searchText="Busque pelo nome ou pelo CNPJ do tomador"
            />

            <form v-if="isRegisteringTaker" class="form">
              <h2>DADOS DO TOMADOR</h2>

              <h3 class="form__subtitle">Informações fiscais</h3>

              <div class="form__section">
                <div class="form__row">
                  <div class="input-field flex-3">
                    <label for="">Nome do serviço</label>
                    <label class="label-wrapper">
                      <input
                        type="text"
                        id="input-client-list-search"
                        placeholder="Digite aqui"
                        @keyup.enter="searchList"
                      />
                      <img
                        src="@/assets/images/icons/search.svg"
                        class="input-field__icon"
                        @click="searchList"
                      />
                    </label>
                  </div>

                  <div class="input-field flex-1 max-width-50">
                    <label for="">Código interno</label>
                    <input type="text" placeholder="Digite aqui" />
                  </div>

                  <div class="input-field">
                    <label for="taker-option">Tipo</label>
                    <label for="taker-option" class="input-field__select-area">
                      <select
                        class="input-field__select-area__select"
                        name=""
                        id="taker-option"
                        ref=""
                      >
                        <option value="-1" selected>Selecione</option>
                        <option>Teste 1</option>
                        <option>Teste 2</option>
                        <option>Teste 3</option>
                        <option>Teste 4</option>
                      </select>
                      <img
                        src="@/assets/images/icons/angle-down.svg"
                        class="input-field__select-area__icon"
                      />
                    </label>

                    <span v-if="false" class="helper-text helper-text--error">
                      Error
                    </span>
                  </div>
                </div>

                <div class="form__row">
                  <div class="input-field flex-1 max-width-50">
                    <label for="">Valor da venda</label>
                    <input type="text" placeholder="Digite aqui" />
                  </div>

                  <div class="input-field flex-1 max-width-50">
                    <label for="">Valor do custo</label>
                    <input type="text" placeholder="Digite aqui" />
                  </div>
                </div>
              </div>

              <h3 class="form__subtitle">DADOS FISCAIS</h3>

              <div class="form__section">
                <div class="form__row">
                  <div class="input-field">
                    <label for="taker-option">CNAE do serviço</label>
                    <label for="taker-option" class="input-field__select-area">
                      <select
                        class="input-field__select-area__select"
                        name=""
                        id="taker-option"
                        ref=""
                      >
                        <option value="-1" selected>Selecione</option>
                        <option>Teste 1</option>
                        <option>Teste 2</option>
                        <option>Teste 3</option>
                        <option>Teste 4</option>
                      </select>
                      <img
                        src="@/assets/images/icons/angle-down.svg"
                        class="input-field__select-area__icon"
                      />
                    </label>

                    <span v-if="false" class="helper-text helper-text--error">
                      Error
                    </span>
                  </div>
                </div>

                <div class="form__row">
                  <div class="input-field flex-1 max-width-50">
                    <label for="">Valor da venda</label>
                    <input type="text" placeholder="Digite aqui" />
                  </div>

                  <div class="input-field flex-1 max-width-50">
                    <label for="">Valor do custo</label>
                    <input type="text" placeholder="Digite aqui" />
                  </div>
                </div>

                <div class="form__row">
                  <div class="input-field flex-1 max-width-50">
                    <label for="">Código de serviço municipal</label>
                    <input type="text" placeholder="Digite aqui" />
                  </div>

                  <div class="input-field flex-1 max-width-50">
                    <label for="">Código de lei complementar</label>
                    <input type="text" placeholder="Digite aqui" disabled />
                  </div>
                </div>

                <div class="form__row">
                  <div class="input-field max-width-50">
                    <label for="taker-option">Natureza da operação</label>
                    <label for="taker-option" class="input-field__select-area">
                      <select
                        class="input-field__select-area__select"
                        name=""
                        id="taker-option"
                        ref=""
                      >
                        <option value="-1" selected>Selecione</option>
                        <option>Teste 1</option>
                        <option>Teste 2</option>
                        <option>Teste 3</option>
                        <option>Teste 4</option>
                      </select>
                      <img
                        src="@/assets/images/icons/angle-down.svg"
                        class="input-field__select-area__icon"
                      />
                    </label>

                    <span v-if="false" class="helper-text helper-text--error">
                      Error
                    </span>
                  </div>
                </div>
              </div>

              <div class="form__footer">
                <div class="form__footer__buttons">
                  <button class="button button--outline">Cancelar</button>
                  <button
                    @click.prevent="handleCreateClientService"
                    :disabled="!isFormAvailable"
                    class="button button--primary"
                  >
                    SALVAR
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Internal>
  </div>
</template>
<script>
/**
 * Mixins
 * */
import formMixin from "@/data/mixins/form-mixin.js";
import createServiceClientModel from "@/data/models/create-client-service-model.js";

/**
 * Services
 * */
import createClientService from "@/services/company/create-service-client-service.js";

/**
 * Components
 * */
import Internal from "@/components/Internal.vue";
import Table from "@/components/Table.vue";
import Toast from "@/components/Toast.vue";
import Autocomplete from "@/components/Autocomplete.vue";

export default {
  name: "app-register-service",

  mixins: [formMixin, createServiceClientModel],

  components: {
    Internal,
    Table,
    Toast,
    Autocomplete,
  },

  computed: {
    isFormAvailable() {
      return this.isFormValid();
    },
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

      tabSection: 1,

      isRegisteringService: false,
      isRegisteringTaker: false,

      cnaeServiceOptions: [
        "1032-5/99 | Fabricação de conservas de legumes e outros vegetais, exceto palmito",
        "9529-1/99 | Reparação de livros, equipamentos esportivos, instrumentos musicais, brinquedos, artigos de tecido, afinação de pianos, com exceção de obras de arte, câmeras fotográficas, jóias, bicicletas, calçados, equipamentos eletrônicos de uso pessoal",
        "1359-6/00 Fitas e tecidos elásticos, artefatos de passamanaria, como galões, vieses, entre outros",
      ],

      cnaeSelected: null,

      serviceTableContent: {
        head: [
          "Nome do serviço",
          "Código",
          "Tipo",
          "Status",
          "Valor do custo",
          "Valor da venda",
        ],

        body: [
          [
            {
              type: "checkbox",
              content: "Médicos e biomédicos",
            },
            {
              type: "text",
              content: "",
            },
            {
              type: "text",
              content: "",
            },
            {
              type: "status",
              status: "active",
              content: "Ativo",
            },
            {
              type: "text",
              content: "",
            },
            {
              type: "text",
              content: "",
            },
          ],
          [
            {
              type: "checkbox",
              content: "Médicos e biomédicos",
            },
            {
              type: "text",
              content: "",
            },
            {
              type: "text",
              content: "",
            },
            {
              type: "status",
              status: "inactive",
              content: "Desativado",
            },
            {
              type: "text",
              content: "",
            },
            {
              type: "text",
              content: "",
            },
          ],
        ],
      },

      takerTableContent: {
        head: ["Tomador", "Última edição em", "Status"],

        body: [
          [
            {
              type: "checkbox",
              content: "Sensorama Design LTDA",
            },
            {
              type: "text",
              content: "12.06.2023",
            },
            {
              type: "status",
              status: "active",
              content: "Ativo",
            },
          ],
          [
            {
              type: "checkbox",
              content: "Samplifica Servicos de Marketing",
            },
            {
              type: "text",
              content: "12.06.2023",
            },
            {
              type: "status",
              status: "active",
              content: "Ativo",
            },
          ],
          [
            {
              type: "checkbox",
              content: "O.L Equipamentos para Evento...",
            },
            {
              type: "text",
              content: "12.06.2023",
            },
            {
              type: "status",
              status: "active",
              content: "Ativo",
            },
          ],
        ],
      },
    };
  },

  mounted() {
    if (!this.$route.params.id) {
      this.$router.go(-1);
      return;
    }

    this.clientId = this.$route.params.id;
  },

  methods: {
    selectCNAE(data) {
      this.form.cnae.value = data;
      if (this.form.cnae.value) {
        this.form.cnae.isVisited = true;
      }
    },

    showSuccessToast(message) {
      this.toast = {
        type: "success",
        message: message,
        title: "Serviço cadastrado com sucesso!",
      };

      this.$refs.toast.show();
    },

    showErrorToast(message) {
      this.toast = {
        type: "error",
        message: message,
        title: "Falha ao cadastrar serviço",
      };

      this.$refs.toast.show();
    },

    showServiceEditMode() {
      this.resetEditMode();
      this.isRegisteringService = true;
    },

    showTakerEditMode() {
      this.resetEditMode();
      this.isRegisteringTaker = true;
    },

    resetEditMode() {
      this.isRegisteringService = false;
      this.isRegisteringTaker = false;
    },

    validateInputs() {
      this.validateField({
        reference: this.form.serviceName,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.internalCode,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.type,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.sellingValue,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.cnae,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.coastValue,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.municipalServiceCode,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.complementaryLawCode,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.operationNature,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });
    },

    isFormValid() {
      if (
        this.form.serviceName.isValid &&
        this.form.internalCode.isValid &&
        this.form.type.isValid &&
        this.form.sellingValue.isValid &&
        this.form.coastValue.isValid &&
        this.form.municipalServiceCode.isValid &&
        this.form.complementaryLawCode.isValid &&
        this.form.operationNature.isValid
      ) {
        return true;
      }

      return false;
    },

    async handleCreateClientService() {
      if (this.isFormValid()) {
        this.isBusy = true;
        try {
          const createClienteCompanyResponse = await createClientService({
            clientUid: this.clientId,
            serviceName: this.form.serviceName.value,
            internalCode: this.form.internalCode.value,
            type: this.form.type.value,
            sellingValue: this.form.sellingValue.value,
            cnae: this.form.cnae.value,
            coastValue: this.form.coastValue.value,
            municipalServiceCode: this.form.municipalServiceCode.value,
            complementaryLawCode: this.form.complementaryLawCode.value,
            operationNature: this.form.operationNature.value,
          });

          if (createClienteCompanyResponse) {
            this.showSuccessToast("O cliente foi cadastrado com sucesso.");
          }

          this.isBusy = false;
        } catch (error) {
          this.isBusy = false;

          const errorMessage = error
            ? error
            : "Não foi possível criar cliente. Entre em contato ou tente novamente mais tarde.";

          this.showErrorToast(errorMessage);
        }
      }
    },
  },
};
</script>
