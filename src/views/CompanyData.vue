<template lang="">
  <div class="view view--company-data">
    <Toast
      ref="toast"
      type="success"
      title="Sucesso!"
      text="Os dados foram salvos com sucesso"
    />

    <Internal>
      <h2 class="view--company-data__title">Dados da empresa</h2>

      <form class="form">
        <div class="form__accordions">
          <Accordion id="1" header="Informações cadastrais">
            <div class="form__section">
              <div class="form__row">
                <div class="input-field width-auto">
                  <label for="">Desconto</label>

                  <ChooseUnity
                    option1="Jurídica"
                    option2="Física"
                    @onSelectOption="onChooseUnity"
                  />
                </div>

                <div class="input-field flex-3">
                  <label>CNPJ</label>
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
              </div>

              <div class="form__row">
                <div class="input-field flex-3">
                  <label for="">Razão Social</label>

                  <input type="text" placeholder="-" class="input--darkened" />
                </div>

                <div class="input-field flex-1">
                  <label>Nome Fantasia</label>
                  <input type="text" placeholder="-" class="input--darkened" />
                </div>
              </div>

              <div class="form__row">
                <div class="input-field">
                  <label for="taker-option">CNAE Primário</label>
                  <label for="taker-option" class="input-field__select-area">
                    <select
                      class="input-field__select-area__select input--darkened"
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
                <div class="input-field input-field--datepicker flex-1">
                  <label for="">Data de fundação</label>
                  <DatePicker :darkened="true" />
                </div>

                <div class="input-field flex-1">
                  <label for="taker-option">Regime de tributação</label>
                  <label for="taker-option" class="input-field__select-area">
                    <select
                      class="input-field__select-area__select input--darkened"
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
                <div class="input-field flex-1">
                  <label for="taker-option">A empresa oferece</label>
                  <label for="taker-option" class="input-field__select-area">
                    <select
                      class="input-field__select-area__select input--darkened"
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

                <div class="input-field flex-1">
                  <label>Inscrição Municipal</label>
                  <input type="text" placeholder="-" class="input--darkened" />
                </div>
              </div>
            </div>
          </Accordion>

          <Accordion id="2" header="Endereços e contatos">
            <div class="form__section">
              <div class="form__row">
                <div class="input-field flex-3">
                  <label>CEP</label>
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
              </div>

              <div class="form__row">
                <div class="input-field flex-1">
                  <label>Endereço</label>
                  <input type="text" placeholder="-" class="input--darkened" />
                </div>

                <div class="input-field flex-1">
                  <label>Número</label>
                  <input type="text" placeholder="-" class="input--darkened" />
                </div>
              </div>

              <div class="form__row">
                <div class="input-field flex-1">
                  <label>Complemento</label>
                  <input type="text" placeholder="-" class="input--darkened" />
                </div>

                <div class="input-field flex-1">
                  <label>Cidade</label>
                  <input type="text" placeholder="-" class="input--darkened" />
                </div>
              </div>

              <div class="form__row">
                <div class="input-field flex-3">
                  <label for="taker-option">Bairro</label>
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
                <div class="input-field flex-1">
                  <label>Telefone Comercial</label>
                  <input type="text" placeholder="-" />
                </div>

                <div class="input-field flex-1">
                  <label>Email</label>
                  <input type="text" placeholder="-" />
                </div>
              </div>
            </div>
          </Accordion>
        </div>

        <div class="form__footer">
          <div class="form__footer__buttons">
            <button class="button button--outline">Cancelar</button>
            <button class="button button--primary" @click.prevent="showToast">
              Salvar
            </button>
          </div>
        </div>
      </form>
    </Internal>
  </div>
</template>
<script>
import Internal from "@/components/Internal.vue";
import Accordion from "@/components/Accordion.vue";
import ChooseUnity from "@/components/ChooseUnity.vue";
import DatePicker from "@/components/DatePicker.vue";
import Toast from "@/components/Toast.vue";

export default {
  name: "app-company-data",

  data() {
    return {};
  },

  methods: {
    showToast() {
      this.$refs.toast.showToast();
    },
  },

  components: {
    Internal,
    Accordion,
    ChooseUnity,
    DatePicker,
    Toast,
  },
};
</script>
<style lang=""></style>
