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
          <!-- <Internal v-if="clientId" :clientId="clientId"> -->
          <h2 class="view--company-data__title">Dados da empresa</h2>

          <form class="form">
            <div class="form__accordions">
              <Accordion id="1" header="Informações cadastrais">
                <div class="form__section">
                  <div class="form__row">
                    <div class="input-field width-auto">
                      <label for="">Tipo de Pessoa</label>

                      <ChooseUnity
                        option1="cnpjPerson"
                        text1="Jurídica"
                        option2="cpfPerson"
                        text2="Física"
                        @onSelectOption="chooseEntity"
                      />
                    </div>

                    <div
                      class="input-field"
                      :class="{
                        'input-field--error': form.cnpj.isValid === false,
                      }"
                    >
                      <label for="create-client--cnpj">CNPJ</label>
                      <input
                        id="create-client--cnpj"
                        type="text"
                        placeholder=""
                        v-model="form.cnpj.value"
                        v-mask="masks.cnpj"
                        @blur="
                          visit('cnpj');
                          validateInputs();
                        "
                        class="input--darkened"
                      />
                      <span
                        v-if="form.cnpj.isValid === false"
                        class="helper-text helper-text--error"
                        >{{ form.cnpj.errorMessage }}</span
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
                        class="input--darkened"
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
                        'input-field--error': form.tradeName.isValid === false,
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
                        class="input--darkened"
                      />
                      <span
                        v-if="form.tradeName.isValid === false"
                        class="helper-text helper-text--error"
                        >{{ form.tradeName.errorMessage }}</span
                      >
                    </div>
                  </div>

                  <div class="form__row">
                    <div
                      class="input-field"
                      :class="{
                        'input-field--error': form.cnae.isValid === false,
                      }"
                    >
                      <label for="create-client--cnae">CNAE Primário</label>
                      <label
                        for="create-client--cnae"
                        class="input-field__select-area"
                      >
                        <select
                          id="create-client--cnae"
                          v-model="form.cnae.value"
                          @blur="
                            visit('cnae');
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
                        v-if="form.cnae.isValid === false"
                        class="helper-text helper-text--error"
                        >{{ form.cnae.errorMessage }}</span
                      >
                    </div>
                  </div>

                  <div class="form__row">
                    <div class="input-field input-field--datepicker flex-1">
                      <label for="">Data de fundação</label>
                      <DatePicker :darkened="true" @pickedChanged="pickDate" />
                    </div>

                    <div
                      class="input-field"
                      :class="{
                        'input-field--error': form.taxRegime.isValid === false,
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
                        class="input--darkened"
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
                          @keyup="searchAddress"
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
                        class="input--darkened"
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
                        class="input--darkened"
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
                        'input-field--error': form.complement.isValid === false,
                      }"
                    >
                      <label for="create-client--complement">Complemento</label>
                      <input
                        id="create-client--complement"
                        type="text"
                        v-model="form.complement.value"
                        @blur="
                          visit('complement');
                          validateInputs();
                        "
                        class="input--darkened"
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
                        class="input--darkened"
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
                        class="input--darkened"
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
                        class="input--darkened"
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
                        'input-field--error':
                          form.comercialPhone.isValid === false,
                      }"
                    >
                      <label for="create-client--comercialPhone"
                        >Telefone Comercial</label
                      >
                      <input
                        id="create-client--comercialPhone"
                        type="text"
                        placeholder="Seu número"
                        v-model="form.comercialPhone.value"
                        v-mask="masks.phone"
                        @blur="
                          visit('comercialPhone');
                          validateInputs();
                        "
                      />
                      <span
                        v-if="form.comercialPhone.isValid === false"
                        class="helper-text helper-text--error"
                        >{{ form.comercialPhone.errorMessage }}</span
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
                <!-- TODO: o que o botão cancelar faz? -->
                <button class="button button--outline">Cancelar</button>
                <button
                  class="button button--primary"
                  @click.prevent="handleCreateClientCompany"
                >
                  <!-- :disabled="!isFormAvailable" -->
                  Salvar
                </button>
              </div>
            </div>
          </form>
          <!-- </Internal> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * Mixins
 * */
import formMixin from "@/data/mixins/form-mixin.js";
import createClientCompanyModel from "@/data/models/create-client-company-model.js";

/**
 * Services
 * */
import createClientCompanyService from "@/services/company/create-client-company-service.js";

/**
 * Components
 * */
// import Internal from "@/components/Internal.vue";
import Accordion from "@/components/Accordion.vue";
import ChooseUnity from "@/components/ChooseUnity.vue";
import DatePicker from "@/components/DatePicker.vue";
import Toast from "@/components/Toast.vue";
import Loader from "@/components/Loader.vue";

export default {
  name: "app-create-client-company",

  mixins: [formMixin, createClientCompanyModel],

  components: {
    // Internal,
    Accordion,
    ChooseUnity,
    DatePicker,
    Toast,
    Loader,
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
    };
  },

  mounted() {
    this.clientId = this.$route.params.id;

    if (this.clientId) {
      // TODO: abrir modo de edição
    } else {
      // TODO: abrir modo de cadastro
    }
  },

  methods: {
    showSuccessToast(message) {
      this.toast = {
        type: "success",
        message: message,
        title: "Cliente cadastrado com sucesso!",
      };

      this.$refs.toast.show();
    },

    showErrorToast(message) {
      this.toast = {
        type: "error",
        message: message,
        title: "Falha ao cadastrar cliente",
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

    async searchAddress() {
      if (this.isBusy === false && this.form.zipcode.value.length === 9) {
        await this.validateZipcode(this.form.zipcode.value);
        this.$refs.number.focus();
      }
    },

    validateInputs() {
      this.validateField({
        reference: this.form.cnpj,
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
        reference: this.form.comercialPhone,
        validateFunction: this.validatePhone,
        errorMessage: this.messages.invalidPhone,
      });
    },

    isFormValid() {
      if (
        this.form.cnpj.isValid &&
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
        this.form.comercialPhone.isValid
      ) {
        return true;
      }

      return false;
    },

    async handleCreateClientCompany() {
      if (this.isFormValid()) {
        this.isBusy = true;
        try {
          const createClienteCompanyResponse = await createClientCompanyService(
            {
              entityType: this.form.entityType.value,
              cnpj: this.form.cnpj.value,
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
              },
              email: this.form.email.value,
              comercialPhone: this.form.comercialPhone.value,
            }
          );

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
<style lang=""></style>
