<template>
  <Loader v-if="isBusy" />

  <Toast
    ref="toast"
    :type="toast.type"
    :title="toast.title"
    :text="toast.message"
  />

  <TableService
    v-if="!isInEditMode"
    @onButtonAction="showEditMode('create')"
    @onEditService="editService"
    @onDeleteService="startDeleteService"
    :content="tableContent"
  />

  <form v-if="isInEditMode" class="form">
    <h2>DADOS DO SERVIÇO</h2>

    <h3 class="form__subtitle">Informações fiscais</h3>

    <div class="form__section">
      <div class="form__row">
        <Autocomplete
          :currentData="form.serviceName.value"
          label="Nome do serviço"
          placeholder="Digite aqui"
          :itemList="serviceListString"
          :hasError="form.serviceName.isValid === false"
          :errorMessage="form.serviceName.errorMessage"
          @selectItem="selectCurrentService"
          @updateValue="form.serviceName.value = $event"
          @blur="
            visit('serviceName');
            validateInputs();
          "
        ></Autocomplete>

        <!-- <div
          class="input-field flex-3"
          :class="{
            'input-field--error': form.serviceName.isValid === false,
          }"
        >
          <label for="create-client--serviceName">Nome do serviço</label>
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
        </div> -->

        <div
          class="input-field flex-1 max-width-50"
          :class="{
            'input-field--error': form.internalCode.isValid === false,
          }"
        >
          <label for="create-client--internalCode">Código interno</label>
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
          <label for="create-client--type" class="input-field__select-area">
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
              <option value="Prestados">Prestados</option>
              <option value="Prestados">Tomados</option>
              <option value="Prestados">Prestados e Tomados</option>
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
          <label for="create-client--sellingValue">Valor da venda</label>
          <input
            id="create-client--sellingValue"
            type="text"
            v-model="form.sellingValue.value"
            @input="formatInputCurrency($event, 'sellingValue')"
            placeholder="R$"
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

        <!-- <div
          class="input-field flex-1 max-width-50"
          :class="{
            'input-field--error': form.coastValue.isValid === false,
          }"
        >
          <label for="create-client--coastValue">Valor do custo</label>
          <input
            id="create-client--coastValue"
            type="text"
            v-model="form.coastValue.value"
            @input="formatInputCurrency($event, 'coastValue')"
            placeholder="R$"
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
        </div> -->
      </div>
    </div>

    <h3 class="form__subtitle">DADOS FISCAIS</h3>

    <div class="form__section">
      <div class="form__row">
        <Autocomplete
          :currentData="form.cnae.value"
          label="CNAE do serviço"
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
          class="input-field flex-1 max-width-50"
          :class="{
            'input-field--error': form.municipalServiceCode.isValid === false,
          }"
        >
          <label for="create-client--municipalServiceCode"
            >Código de serviço municipal</label
          >
          <input
            id="create-client--municipalServiceCode"
            type="text"
            v-model="form.municipalServiceCode.value"
            placeholder="Digite aqui"
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
            'input-field--error': form.complementaryLawCode.isValid === false,
          }"
        >
          <label for="create-client--complementaryLawCode"
            >Código de lei complementar</label
          >
          <input
            id="create-client--complementaryLawCode"
            type="text"
            v-model="form.complementaryLawCode.value"
            placeholder="Digite aqui"
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
            'input-field--error': form.operationNature.isValid === false,
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
              <option value="1">Simples Nacional</option>
              <option value="2">Fixo</option>
              <option value="3">Depósito em Juízo</option>
              <option value="4">
                Exigibilidade suspensa por decisão judicial
              </option>
              <option value="5">
                Exigibilidade suspensa por procedimento administrativo
              </option>
              <option value="6">Isenção parcial</option>
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

    <h3 class="form__subtitle">DADOS DE IMPOSTO</h3>

    <p class="form__text">
      Informe nos campos abaixo as alíquotas devidas aos municípios onde o
      serviço está sendo prestado
    </p>

    <div class="form__section">
      <div class="form__row">
        <div
          class="input-field max-width-50"
          :class="{
            'input-field--error': form.serviceUF.isValid === false,
          }"
        >
          <label for="create-client--serviceUF"
            >UF de prestação do serviço</label
          >
          <label
            for="create-client--serviceUF"
            class="input-field__select-area"
          >
            <select
              id="create-client--serviceUF"
              v-model="form.serviceUF.value"
              @blur="
                visit('serviceUF');
                validateInputs();
              "
              @change="selectUf"
              class="input-field__select-area__select"
            >
              <option value="-1" selected>Selecione</option>
              <option value="AC">Acre (AC)</option>
              <option value="AL">Alagoas (AL)</option>
              <option value="AP">Amapá (AP)</option>
              <option value="AM">Amazonas (AM)</option>
              <option value="BA">Bahia (BA)</option>
              <option value="CE">Ceará (CE)</option>
              <option value="DF">Distrito Federal (DF)</option>
              <option value="ES">Espírito Santo (ES)</option>
              <option value="GO">Goiás (GO)</option>
              <option value="MA">Maranhão (MA)</option>
              <option value="MT">Mato Grosso (MT)</option>
              <option value="MS">Mato Grosso do Sul (MS)</option>
              <option value="MG">Minas Gerais (MG)</option>
              <option value="PA">Pará (PA)</option>
              <option value="PB">Paraíba (PB)</option>
              <option value="PR">Paraná (PR)</option>
              <option value="PE">Pernambuco (PE)</option>
              <option value="PI">Piauí (PI)</option>
              <option value="RJ">Rio de Janeiro (RJ)</option>
              <option value="RN">Rio Grande do Norte (RN)</option>
              <option value="RS">Rio Grande do Sul (RS)</option>
              <option value="RO">Rondônia (RO)</option>
              <option value="RR">Roraima (RR)</option>
              <option value="SC">Santa Catarina (SC)</option>
              <option value="SP" selected>São Paulo (SP)</option>
              <option value="SE">Sergipe (SE)</option>
              <option value="TO">Tocantins (TO)</option>
            </select>
            <img
              src="@/assets/images/icons/angle-down.svg"
              class="input-field__select-area__icon"
            />
          </label>

          <span
            v-if="form.serviceUF.isValid === false"
            class="helper-text helper-text--error"
            >{{ form.serviceUF.errorMessage }}</span
          >
        </div>

        <div
          class="input-field max-width-50"
          :class="{
            'input-field--error': form.serviceCity.isValid === false,
          }"
        >
          <Autocomplete
            :currentData="form.serviceCity.value"
            label="Município de prestação do serviço"
            placeholder="Digite aqui"
            :itemList="cityListString"
            :hasError="form.serviceCity.isValid === false"
            :errorMessage="form.serviceCity.errorMessage"
            @selectItem="selectCurrentCity"
            @updateValue="selectCurrentCity"
            :isDisabled="this.cityList.length <= 0"
            @blur="
              visit('serviceCity');
              validateInputs();
            "
          ></Autocomplete>

          <span
            v-if="form.serviceCity.isValid === false"
            class="helper-text helper-text--error"
            >{{ form.serviceCity.errorMessage }}</span
          >
        </div>
      </div>

      <div class="form__row">
        <div
          class="input-field max-width-50"
          :class="{
            'input-field--error': form.hasRetainedIss.isValid === false,
          }"
        >
          <label for="create-client--hasRetainedIss">ISS Retido?</label>
          <label
            for="create-client--hasRetainedIss"
            class="input-field__select-area"
          >
            <select
              id="create-client--hasRetainedIss"
              v-model="form.hasRetainedIss.value"
              @blur="
                visit('hasRetainedIss');
                validateInputs();
              "
              class="input-field__select-area__select"
            >
              <option value="Não" selected>Não</option>
              <option value="Sim">Sim</option>
            </select>
            <img
              src="@/assets/images/icons/angle-down.svg"
              class="input-field__select-area__icon"
            />
          </label>

          <span
            v-if="form.hasRetainedIss.isValid === false"
            class="helper-text helper-text--error"
            >{{ form.hasRetainedIss.errorMessage }}</span
          >
        </div>
        <div
          class="input-field max-width-50"
          :class="{
            'input-field--error': form.issResponsible.isValid === false,
          }"
        >
          <label for="create-client--issResponsible"
            >Responsável pelo recolhimento do ISS</label
          >
          <label
            for="create-client--issResponsible"
            class="input-field__select-area"
          >
            <select
              id="create-client--issResponsible"
              v-model="form.issResponsible.value"
              @blur="
                visit('issResponsible');
                validateInputs();
              "
              class="input-field__select-area__select"
            >
              <option value="my-client" selected>Meu cliente</option>
              <option value="taker">Tomador</option>
            </select>
            <img
              src="@/assets/images/icons/angle-down.svg"
              class="input-field__select-area__icon"
            />
          </label>

          <span
            v-if="form.issResponsible.isValid === false"
            class="helper-text helper-text--error"
            >{{ form.issResponsible.errorMessage }}</span
          >
        </div>

        <div
          class="input-field input-field--icon flex-3"
          :class="{
            'input-field--error': form.iss.isValid === false,
          }"
        >
          <label for="">ISS</label>
          <input
            id="nf--iss"
            type="text"
            v-model="form.iss.value"
            @input="formatInputToPercentage($event.target.value, 'iss')"
            @blur="
              visit('iss');
              validateInputs();
            "
          />
          <span
            v-if="form.iss.isValid === false"
            class="helper-text helper-text--error"
            >{{ form.iss.errorMessage }}</span
          >
        </div>
        <!-- <div
          class="input-field flex-3 input-field--icon"
          :class="{
            'input-field--error': form.inss.isValid === false,
          }"
        >
          <label for="">INSS</label>
          <input
            id="nf--inss"
            type="text"
            v-model="form.inss.value"
            @input="parseDecimalsToPercentage($event.target.value, 'inss')"
            @blur="
              visit('inss');
              validateInputs();
            "
          />
          <span
            v-if="form.inss.isValid === false"
            class="helper-text helper-text--error"
            >{{ form.inss.errorMessage }}</span
          >
        </div> -->
      </div>
    </div>

    <div class="form__footer">
      <div class="form__footer__buttons">
        <button @click.prevent="resetEditMode" class="button button--outline">
          Cancelar
        </button>

        <button
          v-if="isInEditMode && editMode === 'create'"
          @click.prevent="handleCreateClientService"
          class="button button--primary"
          :disabled="!isFormAvailable"
        >
          Salvar
        </button>

        <button
          v-if="isInEditMode && editMode === 'update'"
          @click.prevent="handleEditClientService"
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

    <h3 class="modal__title">Deseja confirmar a exclusão do serviço?</h3>

    <p class="modal__text">
      Certifique-se de que realmente quer excluir o serviço antes de clicar em
      “confirmar”
    </p>

    <div class="modal__footer">
      <div class="modal__footer__buttons">
        <button class="button button--outline" @click="closeModal">
          Cancelar
        </button>
        <button class="button button--primary" @click="handleDeleteService">
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
import createServiceClientModel from "@/data/models/create-client-service-model.js";

/**
 * Services
 * */
import createClientService from "@/services/internal/service/create-service-client-service.js";
import updateClientService from "@/services/internal/service/update-service-client-service.js";
import deleteClientService from "@/services/internal/service/delete-service-client-service.js";
import getServiceListService from "@/services/internal/service/get-service-list-service.js";
import {
  formatCurrency,
  parseCurrencyToFloat,
  parseFloatToCurrency,
} from "@/helpers/format-currency.js";
import cnaeList from "@/data/cnae-list.json";
import getCityListFromUf from "@/services/common/get-city-list-from-uf.js";

/**
 * Components
 * */
import Loader from "@/components/Loader.vue";
import TableService from "@/components/TableService.vue";
import Toast from "@/components/Toast.vue";
import Autocomplete from "@/components/Autocomplete.vue";
import Modal from "@/components/Modal.vue";

export default {
  name: "app-register-service",

  mixins: [formMixin, createServiceClientModel],

  components: {
    Loader,
    TableService,
    Toast,
    Modal,
    Autocomplete,
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

      isInEditMode: false,
      editMode: null, // create | update
      editCurrentServiceId: null,

      cnaeSelected: null,

      tableContent: {
        head: [
          "Nome do serviço",
          "Código",
          "Tipo",
          "Status",
          // "Valor do custo",
          "Valor da venda",
        ],

        body: [],
      },

      serviceList: [],
      cityList: [],
      currentCity: null,

      cnaeList: cnaeList,
    };
  },

  computed: {
    isFormAvailable() {
      return this.isFormValid();
    },

    serviceListString() {
      if (this.serviceList) {
        return this.serviceList.map((service) => service.serviceName);
      } else {
        return [];
      }
    },

    cityListString() {
      if (this.cityList) {
        return this.cityList.map((city) => city.nome);
      } else {
        return [];
      }
    },

    cnaeListOptions() {
      return cnaeList.map((item) => `${item.code} | ${item.description}`);
    },
  },

  methods: {
    async selectUf() {
      if (!this.form.serviceUF.value || !this.form.serviceUF.value === "")
        return;
      const cityList = await getCityListFromUf(this.form.serviceUF.value);
      this.cityList = cityList ?? [];
    },

    formatInputToPercentage(value, reference) {
      let currentValue = value;

      if (typeof value === "string") {
        currentValue = parseFloat(value.replace(/\D/g, "").replace(",", ".")); // Converte para número e remove todos os caracteres não numéricos
      }

      // Verifica se o valor é um número válido
      if (isNaN(currentValue)) {
        return;
      }

      // Multiplica o valor por 100 para converter para porcentagem
      const percentage = currentValue / 100;

      // Formata o valor para exibir duas casas decimais
      const formatted = percentage.toFixed(2).toString().replace(".", ",");

      this.form[reference].value = formatted;
    },

    parsePercentageToDecimals(value) {
      // Remove espaços em branco, substitui vírgula por ponto e converte para float
      const floatValue = parseFloat(value.replace(",", "."));

      // Converte para decimais dividindo por 100
      const decimalValue = floatValue / 100;

      return decimalValue;
    },

    parseDecimalsToPercentage(value) {
      // Converte o valor para porcentagem multiplicando por 100
      const percentage = value * 100;

      // Formata o valor para duas casas decimais com vírgula
      const formattedPercentage = percentage.toFixed(2).replace(".", ",");

      return formattedPercentage;
    },

    updateAutocompleteServiceName(value) {
      this.form.serviceName.value = value;
    },

    updateAutocompleteCnae(value) {
      this.form.cnae.value = value;
    },

    getCompleteCnaeStringByCnaeCode(cnaeCode) {
      const cnaeItem = cnaeList.find((item) => item.code === cnaeCode);
      return cnaeItem ? `${cnaeItem.code} | ${cnaeItem.description}` : null;
    },

    getCnaeObjFromCompleteString(completeString) {
      const code = completeString.split("|")[0];
      const description = completeString.split("|")[1];
      return { code: code.trim(), description: description.trim() };
    },

    formatInputCurrency(event, reference) {
      let value = event.target.value.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
      value = parseInt(value || "0", 10); // Converte para inteiro

      // Formata o valor
      const formatted = (value / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      // Atualiza o modelo com o valor formatado
      this.form[reference].value = formatted;
    },

    autoCompleteFormWithSelectedService(selectedService) {
      const formUpdated = {};

      for (const key in selectedService) {
        const fieldData = selectedService[key];
        let value = fieldData;

        // Trata campos aninhados
        if (typeof fieldData === "object" && fieldData !== null) {
          value = fieldData.value;
        }

        formUpdated[key] = {
          value: value,
          isValid: value !== null && value !== "",
          errorMessage:
            value == null || value === "" ? this.messages.requiredMessage : "",
          isVisited: true,
        };
      }

      this.updateForm(formUpdated);
    },

    getServiceData(selectedService) {
      const serviceData = {
        serviceName:
          selectedService?.serviceName ?? this.form.serviceName.value,
        internalCode:
          selectedService?.internalCode ?? this.form.internalCode.value,
        type: selectedService?.type ?? this.form.type.value,
        sellingValue: selectedService?.sellingValue
          ? parseFloatToCurrency(selectedService?.sellingValue)
          : this.form.sellingValue.value,
        cnae: `${selectedService.cnae.code} | ${selectedService.cnae.description}`,
        // coastValue: selectedService?.coastValue
        //   ? parseFloatToCurrency(selectedService?.coastValue)
        //   : this.form.coastValue.value,
        municipalServiceCode:
          selectedService?.municipalServiceCode ??
          this.form.municipalServiceCode.value,
        complementaryLawCode:
          selectedService?.complementaryLawCode ??
          this.form.complementaryLawCode.value,
        operationNature:
          selectedService?.operationNature ?? this.form.operationNature.value,
        serviceUF: selectedService?.serviceUF ?? this.form.serviceUF.value,
        serviceCityCode:
          selectedService?.serviceCityCode ?? this.form.serviceCityCode.value,
        serviceCity:
          selectedService?.serviceCity ?? this.form.serviceCity.value,
        hasRetainedIss: selectedService.iss.hasRetainedIss ? "Sim" : "Não",
        issResponsible:
          selectedService?.iss.responsible ?? this.form.issResponsible.value,
        iss: selectedService?.iss
          ? this.parseDecimalsToPercentage(selectedService?.iss?.value)
          : this.form.iss.value,
        // inss: selectedService.inss,
      };

      this.currentCity = {
        id: selectedService?.serviceCityCode?.toString(),
        nome: selectedService?.serviceCity,
      };

      return serviceData;
    },

    selectCurrentService(serviceString) {
      const index = this.serviceListString.findIndex(
        (service) => service === serviceString
      );
      if (index !== -1) {
        const selectedService = this.serviceList[index];
        this.autoCompleteFormWithSelectedService(
          this.getServiceData(selectedService)
        );
      }
    },

    selectCurrentCity(cityString) {
      const index = this.cityListString.findIndex(
        (city) => city === cityString
      );
      if (index !== -1) {
        const selectedCity = this.cityList[index];
        this.currentCity = selectedCity;
        this.form.serviceCity.value = cityString;
        this.form.serviceCity.isValid = cityString != null && cityString != "";
        this.form.serviceCity.isVisited = true;
      }
    },

    showSuccessToast(message, title = "Serviço cadastrado com sucesso!") {
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
      this.editCurrentServiceId = null;
      this.form = this.buildEmptyForm();
      this.isInEditMode = false;
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

      // this.validateField({
      //   reference: this.form.coastValue,
      //   validateFunction: this.validateNotEmpty,
      //   errorMessage: this.messages.requiredMessage,
      // });

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

      this.validateField({
        reference: this.form.serviceUF,
        validateFunction: this.validateSelect,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.hasRetainedIss,
        validateFunction: this.validateSelect,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.issResponsible,
        validateFunction: this.validateSelect,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.iss,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      // this.validateField({
      //   reference: this.form.inss,
      //   validateFunction: this.validateNotEmpty,
      //   errorMessage: this.messages.requiredMessage,
      // });
    },

    isFormValid() {
      if (
        this.form.serviceName.isValid &&
        this.form.internalCode.isValid &&
        this.form.type.isValid &&
        this.form.sellingValue.isValid &&
        // this.form.coastValue.isValid &&
        this.form.municipalServiceCode.isValid &&
        this.form.complementaryLawCode.isValid &&
        this.form.operationNature.isValid &&
        this.form.serviceUF.isValid &&
        this.form.hasRetainedIss.isValid &&
        this.form.issResponsible.isValid &&
        this.form.iss.isValid
        // this.form.inss.isValid
      ) {
        return true;
      }

      return false;
    },

    buildBodyItem(service) {
      const name = service.serviceName;
      const code = service.cnae.code;
      const type = service.type;
      const status = service.isActive ? "active" : "inactive";
      const statusContent = service.isActive ? "Ativo" : "Inativo";
      // const valueCoast = formatCurrency(service.coastValue);
      const valueSell = formatCurrency(service.sellingValue);

      return [
        {
          type: "name",
          content: name,
        },
        {
          type: "text",
          content: code,
        },
        {
          type: "text",
          content: type,
        },
        {
          type: "status",
          status: status,
          content: statusContent,
        },
        // {
        //   type: "text",
        //   content: valueCoast,
        // },
        {
          type: "text",
          content: valueSell,
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

    editService(index) {
      const selectedService = this.serviceList[index];
      if (
        selectedService.serviceName ===
        this.tableContent.body[index].find((item) => item.type === "name")
          .content
      ) {
        this.editCurrentServiceId = selectedService.id;

        this.autoCompleteFormWithSelectedService(
          this.getServiceData(selectedService)
        );
        this.showEditMode("update");
      }
    },

    startDeleteService(index) {
      if (
        this.serviceList[index].serviceName ===
        this.tableContent.body[index].find((item) => item.type === "name")
          .content
      ) {
        this.editCurrentServiceId = this.serviceList[index].id;

        this.showDeleteModal();
      }
    },

    getCityNameFromCode(code) {
      for (let i = 0; i < this.cityList.length; i++) {
        if (this.cityList[i].codigo === code) {
          return this.cityList[i].nome;
        }
      }
      return null;
    },

    async handleDeleteService() {
      this.isBusy = true;

      try {
        const deleteServiceResponse = await deleteClientService(
          this.editCurrentServiceId
        );

        if (deleteServiceResponse) {
          this.showSuccessToast(
            "O serviço foi excluído com sucesso!",
            "Serviço excluído com sucesso!"
          );
        }

        this.isBusy = false;
        this.closeModal();
        this.resetEditMode();
        this.getServiceList();
      } catch (error) {
        this.isBusy = false;

        const errorMessage = error
          ? error
          : "Não foi possível excluir o serviço. Tente novamente mais tarde.";

        console.error(`${errorMessage}: ${error}`);

        this.showErrorToast("Falha ao excluir serviço", errorMessage);
      }
    },

    async getServiceList() {
      this.isBusy = true;

      try {
        const response = await getServiceListService(this.clientId);

        if (response.data) {
          this.serviceList = [];
          this.tableContent.body = [];

          const serviceList = response.data;
          this.serviceList = response.data;
          this.buildTableBodyContent(serviceList);
        }

        this.isBusy = false;
      } catch (error) {
        const errorMessage = error
          ? error
          : "Não foi possível carregar os serviços. Tente novamente mais tarde.";

        this.showErrorToast("Falha ao buscar serviços", errorMessage);

        console.error(`${errorMessage}: ${error}`);

        this.isBusy = false;
      }
    },

    async handleCreateClientService() {
      if (this.isFormValid()) {
        this.isBusy = true;

        try {
          const serviceData = {
            companyUid: this.clientId,
            serviceName: this.form.serviceName.value,
            internalCode: this.form.internalCode.value,
            type: this.form.type.value,
            cnaeCode: this.getCnaeObjFromCompleteString(this.form.cnae.value)
              .code,
            cnaeDescription: this.getCnaeObjFromCompleteString(
              this.form.cnae.value
            ).description,
            sellingValue: parseCurrencyToFloat(this.form.sellingValue.value),
            // coastValue: parseCurrencyToFloat(this.form.coastValue.value),
            municipalServiceCode: this.form.municipalServiceCode.value,
            complementaryLawCode: this.form.complementaryLawCode.value,
            operationNature: this.form.operationNature.value,
            serviceUF: this.form.serviceUF.value,
            serviceCityCode: this.currentCity.id,
            serviceCity: this.currentCity.nome,
            iss: {
              hasRetainedIss: this.form.hasRetainedIss.value === "Sim",
              value: this.parsePercentageToDecimals(this.form.iss.value),
              responsible: this.form.issResponsible.value,
            },
            // inss: parseCurrencyToFloat(this.form.inss.value),
          };

          const clientServiceResponse = await createClientService(serviceData);

          if (clientServiceResponse) {
            this.showSuccessToast("O serviço foi cadastrado com sucesso!");
          }

          this.isBusy = false;

          this.resetEditMode();

          this.getServiceList();
        } catch (error) {
          this.isBusy = false;

          let errorMessage;

          if (error != null && typeof error === "string") {
            errorMessage = error;
          } else {
            errorMessage =
              "Não foi possível criar serviço. Tente novamente mais tarde";
          }

          console.error(`${errorMessage}: ${error}`);

          this.showErrorToast("Falha ao cadastrar serviço", errorMessage);
        }
      }
    },

    async handleEditClientService() {
      if (this.isFormValid()) {
        this.isBusy = true;

        try {
          const serviceData = {
            id: this.editCurrentServiceId,
            companyUid: this.clientId,
            serviceName: this.form.serviceName.value,
            internalCode: this.form.internalCode.value,
            type: this.form.type.value,
            cnaeCode: this.getCnaeObjFromCompleteString(this.form.cnae.value)
              .code,
            cnaeDescription: this.getCnaeObjFromCompleteString(
              this.form.cnae.value
            ).description,
            sellingValue: parseCurrencyToFloat(this.form.sellingValue.value),
            // coastValue: parseCurrencyToFloat(this.form.coastValue.value),
            municipalServiceCode: this.form.municipalServiceCode.value,
            complementaryLawCode: this.form.complementaryLawCode.value,
            operationNature: this.form.operationNature.value,
            serviceUF: this.form.serviceUF.value,
            serviceCityCode: this.currentCity.id,
            serviceCity: this.currentCity.nome,
            iss: {
              hasRetainedIss: this.form.hasRetainedIss.value === "Sim",
              value: this.parsePercentageToDecimals(this.form.iss.value),
              responsible: this.form.issResponsible.value,
            },
            // inss: this.form.inss.value,
          };

          const updateClientResponse = await updateClientService(serviceData);

          if (updateClientResponse) {
            this.showSuccessToast("O serviço foi atualizado com sucesso!");
          }

          this.isBusy = false;

          this.resetEditMode();

          this.getServiceList();
        } catch (error) {
          this.isBusy = false;

          let errorMessage;

          if (error != null && typeof error === "string") {
            errorMessage = error;
          } else {
            errorMessage =
              "Não foi possível atualizar serviço. Tente novamente mais tarde.";
          }

          console.error(`${errorMessage}: ${error}`);

          this.showErrorToast("Falha ao atualizar serviço", errorMessage);
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

    this.getServiceList();
  },
};
</script>
