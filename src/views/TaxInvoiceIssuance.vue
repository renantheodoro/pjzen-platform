<template lang="">
  <div class="view view--tax-invoice-issuance">
    <Internal>
      <div class="card">
        <h2 class="view--tax-invoice-issuance__title">Emitir nota fiscal</h2>

        <form class="form">
          <div v-if="step === 1" class="step-1">
            <h3 class="form__subtitle">informações da venda</h3>

            <div class="form__section">
              <div class="form__row">
                <div class="input-field flex-1">
                  <label for="">Número da Venda</label>
                  <input type="text" placeholder="Digite aqui" />
                </div>

                <div class="input-field flex-3">
                  <label for="taker-option">Tomador de serviço</label>
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

                <div class="input-field input-field--datepicker flex-1">
                  <label for="">Data da venda</label>
                  <DatePicker />
                </div>

                <div class="input-field flex-1">
                  <label for="category-option">Categoria</label>
                  <label for="category-option" class="input-field__select-area">
                    <select
                      class="input-field__select-area__select"
                      name=""
                      id="category-option"
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

            <h3 class="form__subtitle">Itens da venda</h3>

            <div class="form__section">
              <div class="form__row">
                <div class="input-field flex-2">
                  <label for="taker-option">Tomador de serviço</label>
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

                <div class="input-field flex-3">
                  <label for="">Detalhes do item</label>
                  <input type="text" placeholder="Digite aqui" />
                </div>
              </div>

              <div class="form__row">
                <div class="input-field flex-3">
                  <label for="">Quantidade</label>
                  <input type="text" placeholder="Digite aqui" />
                </div>

                <div class="input-field flex-3">
                  <label for="">Valor unitário</label>
                  <input type="text" placeholder="Digite aqui" />
                </div>

                <div class="input-field flex-3">
                  <label for="">Total</label>
                  <input type="text" placeholder="Digite aqui" />
                </div>
              </div>

              <div class="form__row">
                <div class="input-field width-auto">
                  <label for="">Desconto</label>

                  <ChooseUnity
                    option1="R$"
                    option2="%"
                    @onSelectOption="onChooseUnity"
                  />
                </div>

                <div class="input-field flex-1 max-width-50">
                  <label for=""></label>
                  <input type="text" placeholder="0,00" />
                </div>
              </div>

              <div class="form__row">
                <div class="price-section">
                  <div class="price-section__column">
                    <div class="price-section__item">
                      <p><strong>Total da venda</strong></p>
                      <p>1 serviço</p>
                    </div>
                  </div>
                  <div class="price-section__column">
                    <div class="price-section__item">
                      <p>Itens da venda</p>
                      <p class="green"><strong>R$ 00,00</strong></p>
                    </div>
                    <div class="price-section__sign">+</div>
                    <div class="price-section__item">
                      <p>Valores adicionais</p>
                      <p><strong>R$ 00,00</strong></p>
                    </div>
                    <div class="price-section__sign">-</div>
                    <div class="price-section__item">
                      <p>Desconto</p>
                      <p class="red"><strong>R$ 00,00</strong></p>
                    </div>
                    <div class="price-section__sign">=</div>
                    <div class="price-section__item">
                      <p>Total</p>
                      <p><strong>R$ 00,00</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h3 class="form__subtitle">Informações fiscais</h3>

            <div class="form__section">
              <div class="form__row">
                <div class="input-field">
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

            <h3 class="form__subtitle">
              Observações deadicionais da nota fiscal
            </h3>

            <div class="form__section">
              <div class="form__row">
                <div class="input-field">
                  <textarea name="" id="" placeholder="Digite aqui"></textarea>
                </div>
              </div>
            </div>

            <div class="form__footer">
              <div class="form__footer__buttons">
                <button class="button button--outline">Cancelar</button>
                <!-- <button class="button button--primary" disabled>Próxima</button> -->
                <button class="button button--primary" @click="step = 2">Próxima</button>
              </div>
            </div>
          </div>

          <div v-if="step === 2" class="step-2">
            <a @click.prevent="step = 1" class="back-button">
              <img
                src="@/assets/images/icons/angle-left-blue.svg"
                class="back-button__icon"
              />
              Voltar para editar
            </a>

            <div class="card card--blue">
              <div class="step-2__header flex-left">
                <h2>Nota fiscal de serviço</h2>
                <div class="status status--sketch">Rascunho</div>
              </div>

              <h3 class="form__subtitle">dados da nota fiscal</h3>

              <div class="form__section">
                <div class="form__row form__row--limited-80">
                  <div class="input-field flex-1">
                    <label for="">RPS</label>
                    <input type="text" placeholder="Digite aqui" />
                  </div>

                  <div class="input-field flex-3">
                    <label for="taker-option">Série</label>
                    <input type="text" value="SN" disabled />
                  </div>

                  <div class="input-field input-field--datepicker flex-1">
                    <label for="">Data do RPS</label>
                    <DatePicker />
                  </div>
                </div>
              </div>

              <h3 class="form__subtitle">dados do tomador do serviço</h3>

              <div class="form__section">
                <div class="form__row">
                  <div class="input-field flex-1">
                    <label for="">Cliente</label>
                    <input
                      type="text"
                      value="Cristiane de Souza Pacheco"
                      disabled
                    />
                  </div>

                  <div class="input-field flex-3">
                    <label for="taker-option">CPF</label>
                    <input type="text" value="305.060.148-07" />
                  </div>

                  <div class="input-field input-field--datepicker flex-1">
                    <label for="">Telefone</label>
                    <input type="text" placeholder="(00) 0000.0000" />
                  </div>

                  <div class="input-field input-field--datepicker flex-1">
                    <label for="">E-mail</label>
                    <input type="text" placeholder="Digite aqui" />
                  </div>
                </div>

                <div class="form__row form__row--limited-80">
                  <div class="input-field flex-1">
                    <label for="">CEP</label>
                    <input type="text" placeholder="Digite aqui" />
                  </div>

                  <div class="input-field flex-3">
                    <label for="taker-option">Endereço</label>
                    <input type="text" />
                  </div>

                  <div class="input-field input-field--datepicker flex-1">
                    <label for="">Número</label>
                    <input type="text" placeholder="(00) 0000.0000" />
                  </div>
                </div>

                <div class="form__row">
                  <div class="input-field flex-1">
                    <label for="city-option">Cidade</label>
                    <label for="city-option" class="input-field__select-area">
                      <select
                        class="input-field__select-area__select"
                        name=""
                        id="city-option"
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
                    <label for="taker-option">Bairro</label>
                    <input type="text" />
                  </div>

                  <div class="input-field input-field--datepicker flex-3">
                    <label for="">Complemento</label>
                    <input type="text" />
                  </div>
                </div>
              </div>

              <h3 class="form__subtitle">dados Fiscais do serviço</h3>

              <div class="form__section">
                <div class="form__row">
                  <div class="input-field flex-1">
                    <label for="city-option" class="input-field__select-area">
                      <select
                        class="input-field__select-area__select"
                        name=""
                        id="city-option"
                        ref=""
                      >
                        <option selected>Consulta média com paciente</option>
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
                    class="button button--primary"
                    @click.prevent="confirmNF"
                  >
                    Emitir NF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Internal>

    <Modal ref="modal" :textCenter="true">
      <div class="profile-image profile-image--center profile-image--bigger">
        <img src="@/assets/images/profile-image-2.png" />
      </div>

      <h3 class="modal__title">Confirmar emissão da Nota Fiscal</h3>
      <p class="modal__text">
        Certifique-se de que as informações preenchidas estejam corretas antes
        de Emitir NF. Mas não se preocupe. você ainda poderá cancelar e emitir
        uma nova NF caso precise.
      </p>

      <div class="modal__footer">
        <div class="modal__footer__buttons">
          <button class="button button--outline" @click="closeModal">
            Cancelar
          </button>
          <button class="button button--primary" @click="closeModal">
            Emitir NF
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import Internal from "@/components/Internal.vue";
import DatePicker from "@/components/DatePicker.vue";
import ChooseUnity from "@/components/ChooseUnity.vue";
import Modal from "@/components/Modal.vue";

export default {
  name: "app-tax-invoice-issuance",

  data() {
    return {
      step: 1,
    };
  },

  methods: {
    onChooseUnity(option) {
      console.log(option);
    },

    confirmNF() {
      this.$refs.modal.open();
    },

    closeModal() {
      this.$refs.modal.close();
    },
  },

  components: {
    Internal,
    DatePicker,
    ChooseUnity,
    Modal,
  },
};
</script>
<style lang=""></style>
