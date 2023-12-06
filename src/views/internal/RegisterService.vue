<template>
  <Toast
    ref="toastSuccess"
    type="success"
    title="Sucesso!"
    text="O novo serviço foi cadastrado com sucesso."
  />

  <div class="view view--register-service">
    <Internal>
      <div class="card no-pad">
        <ul class="tabs">
          <li
            @click="
              tabSection = 1;
              resetRegistration;
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
              resetRegistration;
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
              @onButtonAction="initRegistrationService"
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
                  <Autocomplete
                    label="CNAE do serviço"
                    placeholder="Selecione"
                    :itemList="cnaeServiceOptions"
                    @input="console.log(event)"
                    @onSelect="console.log(event)"
                  ></Autocomplete>
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
                    @click.prevent="showSuccessToast"
                    class="button button--primary"
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
              @onButtonAction="initRegistrationTaker"
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
                    @click.prevent="showSuccessToast"
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
import Internal from "@/components/Internal.vue";
import Table from "@/components/Table.vue";
import Toast from "@/components/Toast.vue";
import Autocomplete from "@/components/Autocomplete.vue";

export default {
  name: "app-register-service",

  data() {
    return {
      tabSection: 1,

      isRegisteringService: true,
      isRegisteringTaker: false,

      cnaeServiceOptions: [
        "1032-5/99 | Fabricação de conservas de legumes e outros vegetais, exceto palmito",
        "9529-1/99 | Reparação de livros, equipamentos esportivos, instrumentos musicais, brinquedos, artigos de tecido, afinação de pianos, com exceção de obras de arte, câmeras fotográficas, jóias, bicicletas, calçados, equipamentos eletrônicos de uso pessoal",
        "1359-6/00 Fitas e tecidos elásticos, artefatos de passamanaria, como galões, vieses, entre outros",
      ],

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

  methods: {
    initRegistrationService() {
      this.resetRegistration();
      this.isRegisteringService = true;
    },

    initRegistrationTaker() {
      this.resetRegistration();
      this.isRegisteringTaker = true;
    },

    resetRegistration() {
      this.isRegisteringService = false;
      this.isRegisteringTaker = false;
    },

    showSuccessToast() {
      this.resetRegistration();
      this.$refs.toastSuccess.show();
    },
  },

  components: {
    Internal,
    Table,
    Toast,
    Autocomplete,
  },
};
</script>
