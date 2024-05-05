<template lang="">
  <div class="view view--company-data">
    <Toast
      ref="toast"
      :type="toast.type"
      :title="toast.title"
      :text="toast.message"
    />

    <Loader v-if="isBusy" />

    <div class="container">
      <div class="view__row">
        <div class="view__column view__column--content">
          <Internal ref="internal" v-if="clientId" :clientId="clientId">
            <form class="form">
              <div class="form__accordions">
                <Accordion id="1" header="Informações cadastrais">
                  <div class="form__section">
                    <div class="form__row">
                      <div
                        v-if="companyDataLoaded"
                        class="input-field width-auto input-field--switch"
                      >
                        <label for="">Está ativo?</label>
                        <ToggleSwitch
                          @onToggle="companyDataLoaded.isActive = $event"
                          :isChecked="companyDataLoaded.isActive"
                        />
                      </div>

                      <!-- <div class="input-field width-auto">
                        <label for="">Tipo de Pessoa</label>

                        <ChooseUnity
                          initialOption="cnpjPerson"
                          option1="cnpjPerson"
                          text1="Jurídica"
                          option2="cpfPerson"
                          text2="Física"
                          @onSelectOption="chooseEntity"
                        />
                      </div> -->

                      <div
                        class="input-field"
                        :class="{
                          'input-field--error': form.cpfCnpj.isValid === false,
                        }"
                      >
                        <label for="create-client--cnpj">{{
                          form.entityType.value === "cnpjPerson"
                            ? "CNPJ"
                            : "CPF"
                        }}</label>
                        <label class="label-wrapper">
                          <input
                            id="create-accountancy--cnpj"
                            type="text"
                            placeholder="__.___.___/___-__"
                            v-model="form.cpfCnpj.value"
                            v-mask="
                              form.entityType.value === 'cnpjPerson'
                                ? masks.cnpj
                                : masks.cpf
                            "
                            @keyup.enter="
                              form.entityType.value === 'cnpjPerson'
                                ? searchCNPJData
                                : null
                            "
                            @blur="
                              visit('cpfCnpj');
                              validateInputs();
                            "
                            class="input--darkened"
                            disabled
                          />
                          <!-- <img
                            src="@/assets/images/icons/search.svg"
                            class="input-field__icon"
                            @click="searchCNPJData"
                          /> -->
                        </label>
                        <span
                          v-if="form.cpfCnpj.isValid === false"
                          class="helper-text helper-text--error"
                          >{{ form.cpfCnpj.errorMessage }}</span
                        >
                      </div>
                    </div>

                    <div class="form__row">
                      <div
                        class="input-field flex-3"
                        :class="{
                          'input-field--error':
                            form.businessName.isValid === false,
                        }"
                      >
                        <label for="create-client--businessName"
                          >Razão Social</label
                        >
                        <input
                          id="create-client--businessName"
                          type="text"
                          placeholder="Seu nome"
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

                      <div
                        class="input-field flex-3"
                        :class="{
                          'input-field--error':
                            form.tradeName.isValid === false,
                        }"
                      >
                        <label for="create-client--tradeName"
                          >Nome Fantasia</label
                        >
                        <input
                          id="create-client--tradeName"
                          type="text"
                          placeholder="Seu nome"
                          v-model="form.tradeName.value"
                          @blur="
                            visit('tradeName');
                            validateInputs();
                          "
                        />
                        <span
                          v-if="form.tradeName.isValid === false"
                          class="helper-text helper-text--error"
                          >{{ form.tradeName.errorMessage }}</span
                        >
                      </div>
                    </div>

                    <div class="form__row">
                      <Autocomplete
                        :currentData="form.cnae.value"
                        label="CNAE primário"
                        placeholder="Selecione"
                        :itemList="cnaeListOptions"
                        :hasError="form.cnae.isValid === false"
                        :errorMessage="form.cnae.errorMessage"
                        @updateValue="form.cnae.value = $event"
                        @selectItem="form.cnae.value = $event"
                        @blur="
                          visit('cnae');
                          validateInputs();
                        "
                      ></Autocomplete>
                    </div>

                    <div class="form__row">
                      <div
                        class="input-field flex-3"
                        :class="{
                          'input-field--error':
                            form.foundationDate.isValid === false,
                        }"
                      >
                        <label for="create-client--datepicker"
                          >Data de fundação</label
                        >
                        <input
                          id="create-client--datepicker"
                          type="text"
                          placeholder="Seu nome"
                          v-model="form.foundationDate.value"
                          @blur="
                            visit('foundationDate');
                            validateInputs();
                          "
                        />
                        <span
                          v-if="form.foundationDate.isValid === false"
                          class="helper-text helper-text--error"
                          >{{ form.foundationDate.errorMessage }}</span
                        >
                      </div>

                      <!-- <div class="input-field input-field--datepicker flex-1">
                        <label for=""></label>
                        <DatePicker
                          :isDisabled="true"
                          :initialValue="form.foundationDate.value"
                          :darkened="true"
                          @pickedChanged="pickDate"
                        />
                      </div> -->

                      <div
                        class="input-field"
                        :class="{
                          'input-field--error':
                            form.taxRegime.isValid === false,
                        }"
                      >
                        <label for="create-client--taxRegime"
                          >Regime de tributação</label
                        >
                        <label
                          for="create-client--taxRegime"
                          class="input-field__select-area"
                        >
                          <select
                            id="create-client--taxRegime"
                            v-model="form.taxRegime.value"
                            @blur="
                              visit('taxRegime');
                              validateInputs();
                            "
                            class="input-field__select-area__select"
                          >
                            <option value="-1" selected>Selecione</option>
                            <option value="1">Simples Nacional</option>
                            <option value="2">Fixo</option>
                            <option value="3">Depósito em Juízo</option>
                            <option value="4">
                              Exigibilidade suspensa por decisão judicial
                            </option>
                            <option value="5">
                              Exigibilidade suspensa por procedimento
                              administrativo
                            </option>
                            <option value="6">Isenção parcial</option>
                          </select>
                          <img
                            src="@/assets/images/icons/angle-down.svg"
                            class="input-field__select-area__icon"
                          />
                        </label>

                        <span
                          v-if="form.taxRegime.isValid === false"
                          class="helper-text helper-text--error"
                          >{{ form.taxRegime.errorMessage }}</span
                        >
                      </div>
                    </div>

                    <div class="form__row">
                      <div
                        class="input-field"
                        :class="{
                          'input-field--error':
                            form.companyOffering.isValid === false,
                        }"
                      >
                        <label for="create-client--companyOffering"
                          >A empresa oferece</label
                        >
                        <label
                          for="create-client--companyOffering"
                          class="input-field__select-area"
                        >
                          <select
                            id="create-client--companyOffering"
                            v-model="form.companyOffering.value"
                            @blur="
                              visit('companyOffering');
                              validateInputs();
                            "
                            class="input-field__select-area__select"
                          >
                            <option value="-1" selected>Selecione</option>
                            <option value="Teste company offering">
                              Teste company offering
                            </option>
                            <option value="Teste 1">Teste 1</option>
                            <option value="Teste 2">Teste 2</option>
                            <option value="Teste 3">Teste 3</option>
                            <option value="Teste 4">Teste 4</option>
                          </select>
                          <img
                            src="@/assets/images/icons/angle-down.svg"
                            class="input-field__select-area__icon"
                          />
                        </label>

                        <span
                          v-if="form.companyOffering.isValid === false"
                          class="helper-text helper-text--error"
                          >{{ form.companyOffering.errorMessage }}</span
                        >
                      </div>

                      <div
                        class="input-field flex-3"
                        :class="{
                          'input-field--error':
                            form.municipalRegistration.isValid === false,
                        }"
                      >
                        <label for="create-client--municipalRegistration"
                          >Inscrição Municipal</label
                        >
                        <input
                          id="create-client--municipalRegistration"
                          type="text"
                          placeholder="-"
                          v-model="form.municipalRegistration.value"
                          @blur="
                            visit('municipalRegistration');
                            validateInputs();
                          "
                        />
                        <span
                          v-if="form.municipalRegistration.isValid === false"
                          class="helper-text helper-text--error"
                          >{{ form.municipalRegistration.errorMessage }}</span
                        >
                      </div>
                    </div>
                  </div>
                </Accordion>

                <Accordion id="2" header="Endereços e contatos">
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
                            @keyup.enter="searchAddress"
                            v-mask="masks.zipCode"
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
                    </div>

                    <div class="form__row">
                      <div
                        class="input-field"
                        :class="{
                          'input-field--error': form.street.isValid === false,
                        }"
                      >
                        <label for="create-client--street">Endereço</label>
                        <input
                          id="create-client--street"
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
                          'input-field--error':
                            form.complement.isValid === false,
                        }"
                      >
                        <label for="create-client--complement"
                          >Complemento</label
                        >
                        <input
                          id="create-client--complement"
                          type="text"
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
                          placeholder="Seu sobrenome"
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
                    </div>

                    <div class="form__row">
                      <div
                        class="input-field"
                        :class="{
                          'input-field--error':
                            form.neighborhood.isValid === false,
                        }"
                      >
                        <label for="create-client--neighborhood">Bairro</label>
                        <input
                          id="create-client--neighborhood"
                          type="text"
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

                      <!-- <div
                      class="input-field"
                      :class="{
                        'input-field--error':
                          form.neighborhood.isValid === false,
                      }"
                    >
                      <label for="create-client--neighborhood">Bairro</label>
                      <label
                        for="create-client--neighborhood"
                        class="input-field__select-area"
                      >
                        <select
                          id="create-client--neighborhood"
                          v-model="form.neighborhood.value"
                          @blur="
                            visit('neighborhood');
                            validateInputs();
                          "
                          class="input-field__select-area__select input--darkened"
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
                        v-if="form.neighborhood.isValid === false"
                        class="helper-text helper-text--error"
                        >{{ form.neighborhood.errorMessage }}</span
                      >
                    </div> -->
                    </div>

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
                </Accordion>
              </div>

              <div class="form__footer">
                <div class="form__footer__buttons">
                  <router-link
                    class="button button--outline"
                    :to="{ name: 'client', params: { id: clientId } }"
                    >Cancelar</router-link
                  >

                  <button
                    class="button button--primary"
                    @click.prevent="showConfirmModal"
                    :disabled="!isFormAvailable"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </form>
          </Internal>
        </div>
      </div>
    </div>
  </div>

  <Modal ref="modal" :textCenter="true" :modalForm="true">
    <div class="profile-image profile-image--center profile-image--bigger">
      <img src="@/assets/images/profile-image-2.png" />
    </div>

    <h3 class="modal__title">Confirme as alterações</h3>

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
            :type="passwordFieldType"
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
            @click.prevent="togglePasswordView"
            class="input-field__password-button"
          >
            <img
              src="@/assets/images/icons/eye-password-slash.svg"
              v-if="passwordFieldType === 'password'"
            />
            <img
              src="@/assets/images/icons/eye-password.svg"
              v-if="passwordFieldType === 'text'"
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
</template>
<script>
/**
 * Mixins
 * */
import formMixin from "@/data/mixins/form-mixin.js";
import companyModel from "@/data/models/company-model.js";

/**
 * Services
 * */
import getClientCompanyService from "@/services/internal/company/get-client-by-id-service.js";
import updateClientCompanyService from "@/services/internal/company/update-client-company-service.js";
import searchCNPJInfo from "@/services/common/search-cnpj-info-service.js";
import cnaeList from "@/data/cnae-list.json";
import reauthenticateUser from "@/services/common/reauthenticate-user-service.js";
import { getAccountancyDataFromLocalStorage } from "@/helpers/local-storage";

/**
 * Components
 * */
import Internal from "@/components/Internal.vue";
import Accordion from "@/components/Accordion.vue";
// import ChooseUnity from "@/components/ChooseUnity.vue";
// import DatePicker from "@/components/DatePicker.vue";
import Toast from "@/components/Toast.vue";
import Loader from "@/components/Loader.vue";
import Autocomplete from "@/components/Autocomplete.vue";
import ToggleSwitch from "@/components/ToggleSwitch.vue";
import Modal from "@/components/Modal.vue";

export default {
  name: "app-company-data",

  mixins: [formMixin, companyModel],

  components: {
    Internal,
    Accordion,
    // ChooseUnity,
    // DatePicker,
    Toast,
    Loader,
    Autocomplete,
    ToggleSwitch,
    Modal,
  },

  data() {
    return {
      isBusy: false,

      clientId: null,

      companyDataLoaded: null,

      toast: {
        type: null,
        message: null,
        title: null,
      },

      cnaeList: cnaeList,

      passwordFieldType: "password",

      authForm: {
        password: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
      },
    };
  },

  computed: {
    isFormAvailable() {
      return this.isFormValid();
    },

    isAuthFormAvailable() {
      return this.isAuthFormValid();
    },

    cnaeListOptions() {
      return cnaeList.map((item) => `${item.code} | ${item.description}`);
    },
  },

  methods: {
    togglePasswordView() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },

    async searchCNPJData() {
      if (!this.form.cpfCnpj.isValid) return;

      this.isBusy = true;

      const response = await searchCNPJInfo(this.form.cpfCnpj.value);

      if (response.data.error) {
        this.isBusy = false;
        this.showErrorToast(
          response.data.error ??
            "Não foram encontrados dados para o CNPJ informado",
          "CNPJ não encontrado"
        );
        return;
      }

      if (response.data) {
        const cnpjData = response.data;

        const cnpjDataInfo = {
          cpfCnpj: this.form.cpfCnpj.value,
          businessName: cnpjData["RAZAO SOCIAL"],
          tradeName: cnpjData["NOME FANTASIA"],
          foundationDate: cnpjData["DATA ABERTURA"],
          cnae: `${cnpjData["CNAE PRINCIPAL CODIGO"]} | ${cnpjData["CNAE PRINCIPAL DESCRICAO"]}`,
          address: {
            zipcode: cnpjData["CEP"],
            street: `${cnpjData["TIPO LOGRADOURO"]} ${cnpjData["LOGRADOURO"]}`,
            number: cnpjData["NUMERO"],
            city: cnpjData["MUNICIPIO"],
            uf: cnpjData["UF"],
            neighborhood: cnpjData["BAIRRO"],
            complement: cnpjData["COMPLEMENTO"],
          },
          phone: `${cnpjData["DDD"]} ${cnpjData["TELEFONE"]}`,
          email: cnpjData["EMAIL"],
        };

        this.autoCompleteForm(cnpjDataInfo);
      }

      this.isBusy = false;
    },

    showSuccessToast(message) {
      this.toast = {
        type: "success",
        message: message,
        title: "Cliente atualizado com sucesso!",
      };

      this.$refs.toast.show();
    },

    showErrorToast(message, title = "Falha ao cadastrar cliente") {
      this.toast = {
        type: "error",
        message: message,
        title,
      };

      this.$refs.toast.show();
    },

    chooseEntity(option) {
      this.form.entityType.value = option;
      if (this.form.entityType.value) {
        this.form.entityType.isVisited = true;
      }
    },

    pickDate(date) {
      this.form.foundationDate.value = this.formatDate(date);
      if (this.form.foundationDate.value) {
        this.form.foundationDate.isVisited = true;
      }
    },

    showConfirmModal() {
      this.$refs.modal.open();
    },

    closeModal() {
      this.$refs.modal.close();
    },

    async searchAddress() {
      if (this.isBusy === false && this.form.zipcode.value.length === 9) {
        await this.validateZipcode(this.form.zipcode.value);
        this.$refs.number.focus();
      }
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
        reference: this.form.tradeName,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.cnae,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.foundationDate,
        validateFunction: this.validateDate,
        errorMessage: this.messages.invalidDateMessage,
      });

      this.validateField({
        reference: this.form.taxRegime,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.companyOffering,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.municipalRegistration,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.zipcode,
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
        validateFunction: this.validateNumberOnly,
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
        reference: this.form.uf,
        validateFunction: this.validateUF,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.email,
        validateFunction: this.validateEmail,
        errorMessage: this.messages.invalidEmail,
      });

      this.validateField({
        reference: this.form.phone,
        validateFunction: this.validatePhone,
        errorMessage: this.messages.invalidPhone,
      });
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
        this.form.cpfCnpj.isValid &&
        this.form.businessName.isValid &&
        this.form.tradeName.isValid &&
        this.form.cnae.isValid &&
        this.form.taxRegime.isValid &&
        this.form.companyOffering.isValid &&
        this.form.municipalRegistration.isValid &&
        this.form.zipcode.isValid &&
        this.form.street.isValid &&
        this.form.number.isValid &&
        this.form.city.isValid &&
        this.form.neighborhood.isValid &&
        this.form.email.isValid &&
        this.form.phone.isValid
      ) {
        return true;
      }

      return false;
    },

    autoCompleteForm(currentCompanyData) {
      const formUpdated = {};

      for (const key in currentCompanyData) {
        const fieldData = currentCompanyData[key];
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

    async getCompanyData() {
      this.isBusy = true;

      try {
        const response = await getClientCompanyService(this.clientId);

        this.companyDataLoaded = response?.data;

        const companyData = {
          entityType: this.companyDataLoaded?.entityType ?? "cnpjPerson",
          isActive: this.companyDataLoaded?.isActive ?? true,
          cpfCnpj: this.companyDataLoaded?.cpfCnpj ?? null,
          businessName: this.companyDataLoaded?.businessName ?? null,
          tradeName: this.companyDataLoaded?.tradeName ?? null,
          cnae: this.companyDataLoaded?.cnae ?? null,
          foundationDate: this.companyDataLoaded?.foundationDate ?? null,
          taxRegime: this.companyDataLoaded?.taxRegime ?? "-1",
          companyOffering: this.companyDataLoaded?.companyOffering ?? null,
          municipalRegistration:
            this.companyDataLoaded?.municipalRegistration ?? null,
          zipcode: this.companyDataLoaded?.address?.zipcode ?? null,
          street: this.companyDataLoaded?.address?.street ?? null,
          number: this.companyDataLoaded?.address?.number ?? null,
          complement: this.companyDataLoaded?.address?.complement ?? null,
          city: this.companyDataLoaded?.address?.city ?? null,
          uf: this.companyDataLoaded?.address?.uf ?? null,
          neighborhood: this.companyDataLoaded?.address?.neighborhood ?? null,
          email: this.companyDataLoaded?.email ?? null,
          phone: this.companyDataLoaded?.phone ?? null,
        };

        this.autoCompleteForm(companyData);

        this.isBusy = false;
      } catch (error) {
        this.isBusy = false;
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
        await this.handleUpdateClientCompany();
      } else {
        this.showErrorToast(
          "Erro ao autenticar o usuário. Verifique suas credenciais e tente novamente.",
          "Erro ao autenticar usuário"
        );
      }

      this.isBusy = false;
    },

    async handleUpdateClientCompany() {
      if (this.isFormValid()) {
        this.isBusy = true;

        try {
          const updateResponse = await updateClientCompanyService({
            companyUid: this.clientId,
            isActive: this.companyDataLoaded.isActive,
            // entityType: this.form.entityType.value,
            cpfCnpj: this.form.cpfCnpj.value,
            businessName: this.form.businessName.value,
            tradeName: this.form.tradeName.value,
            cnae: this.form.cnae.value,
            foundationDate: this.form.foundationDate.value,
            taxRegime: this.form.taxRegime.value,
            companyOffering: this.form.companyOffering.value,
            municipalRegistration: this.form.municipalRegistration.value,
            address: {
              zipcode: this.form.zipcode.value,
              street: this.form.street.value,
              number: this.form.number.value,
              complement: this.form.complement.value,
              city: this.form.city.value,
              neighborhood: this.form.neighborhood.value,
              uf: this.form.uf.value,
            },
            email: this.form.email.value,
            phone: this.form.phone.value,
          });

          if (updateResponse) {
            this.showSuccessToast("O cliente foi atualizado com sucesso.");

            this.$refs.internal.updateClient();
          }
        } catch (error) {
          let errorMessage;

          if (error != null && typeof error === "string") {
            errorMessage = error;
          } else {
            errorMessage =
              "Não foi possível criar cliente. Tente novamente mais tarde.";
          }

          this.showErrorToast(errorMessage);
        } finally {
          this.closeModal();
          this.isBusy = false;
        }
      }
    },
  },

  mounted() {
    const clientId = this.$route.params.id;
    this.clientId = clientId;

    if (!clientId) {
      this.$router.go(-1);
    }

    this.getCompanyData();
  },
};
</script>
