<template lang="">
  <div class="view view--nf-invoice">
    <Toast
      ref="toast"
      :type="toast.type"
      :title="toast.title"
      :text="toast.message"
    />

    <Loader v-if="isBusy" />

    <Internal :clientId="clientId">
      <div class="card">
        <h2 class="view--nf-invoice__title">Emitir nota fiscal</h2>

        <form class="form">
          <div v-show="step === 1" class="step-1">
            <h3 class="form__subtitle">Informações da venda</h3>

            <div class="form__section">
              <div class="form__row">
                <div
                  class="input-field flex-3"
                  :class="{
                    'input-field--error': form.sellingValue.isValid === false,
                  }"
                >
                  <label for="nf--sellingValue">Número da venda</label>
                  <input
                    id="nf--sellingValue"
                    type="text"
                    placeholder="Digite aqui"
                    v-model="form.sellingValue.value"
                    @blur="
                      visit('sellingValue');
                      validateInputs();
                    "
                    :disabled="$route.name === 'nf-invoice-consult'"
                  />
                  <span
                    v-if="form.sellingValue.isValid === false"
                    class="helper-text helper-text--error"
                    >{{ form.sellingValue.errorMessage }}</span
                  >
                </div>

                <!-- <Autocomplete
                  :currentData="form.taker.value"
                  label=""
                  placeholder="Selecione"
                  :itemList="filteredTakerNameList"
                  :hasError="form.taker.isValid === false"
                  :errorMessage="form.taker.errorMessage"
                  @updateValue="form.taker.value = $event"
                  @selectItem="form.taker.value = $event"
                  @blur="
                    visit('taker');
                    validateInputs();
                  "
                ></Autocomplete> -->
                <div
                  v-if="!isBusy"
                  class="input-field"
                  :class="{
                    'input-field--error': form.taker.isValid === false,
                  }"
                >
                  <label for="nf--taker">Tomador de serviço</label>
                  <label for="nf--taker" class="input-field__select-area">
                    <select
                      id="nf--taker"
                      v-model="form.taker.value"
                      @change="selectTaker"
                      @blur="
                        visit('taker');
                        validateInputs();
                      "
                      class="input-field__select-area__select"
                      :disabled="$route.name === 'nf-invoice-consult'"
                    >
                      <option v-if="!currentNfData" value="-1">
                        Selecione
                      </option>
                      <option
                        v-for="(taker, index) in takerList"
                        :key="index"
                        :value="taker.id"
                      >
                        {{ taker.businessName }}
                      </option>
                    </select>
                    <img
                      src="@/assets/images/icons/angle-down.svg"
                      class="input-field__select-area__icon"
                    />
                  </label>

                  <span
                    v-if="form.taker.isValid === false"
                    class="helper-text helper-text--error"
                    >{{ form.taker.errorMessage }}</span
                  >
                </div>

                <div
                  v-if="!isBusy"
                  class="input-field input-field--datepicker flex-1"
                >
                  <label for="create-client--datepicker">Data da venda</label>
                  <DatePicker
                    :isDisabled="$route.name === 'nf-invoice-consult'"
                    :initialValue="form.sellingDate.value"
                    @pickedChanged="pickDate($event, 'sellingDate')"
                  />
                </div>

                <!-- <div
                  class="input-field"
                  :class="{
                    'input-field--error': form.category.isValid === false,
                  }"
                >
                  <label for="nf--category">Categoria</label>
                  <label for="nf--category" class="input-field__select-area">
                    <select
                      id="nf--category"
                      v-model="form.category.value"
                      @blur="
                        visit('category');
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
                    v-if="form.category.isValid === false"
                    class="helper-text helper-text--error"
                    >{{ form.category.errorMessage }}</span
                  >
                </div> -->
              </div>
            </div>

            <h3 class="form__subtitle">Itens da venda</h3>

            <div class="form__section">
              <div class="form__row">
                <div
                  v-if="!isBusy"
                  class="input-field"
                  :class="{
                    'input-field--error': form.service.isValid === false,
                  }"
                >
                  <label for="nf--service">Serviço</label>
                  <label for="nf--service" class="input-field__select-area">
                    <select
                      v-if="serviceList"
                      id="nf--service"
                      v-model="form.service.value"
                      @change="selectService"
                      @blur="
                        visit('service');
                        validateInputs();
                      "
                      class="input-field__select-area__select"
                      :disabled="$route.name === 'nf-invoice-consult'"
                    >
                      <option v-if="!currentNfData" value="-1" selected>
                        Selecione
                      </option>
                      <option
                        v-for="(service, index) in serviceList"
                        :key="index"
                        :value="service.id"
                      >
                        {{ service.serviceName }}
                      </option>
                    </select>
                    <img
                      src="@/assets/images/icons/angle-down.svg"
                      class="input-field__select-area__icon"
                    />
                  </label>

                  <span
                    v-if="form.service.isValid === false"
                    class="helper-text helper-text--error"
                    >{{ form.taxRegime.errorMessage }}</span
                  >
                </div>

                <!-- <div
                  class="input-field flex-3"
                  :class="{
                    'input-field--error': form.itemDetails.isValid === false,
                  }"
                >
                  <label for="nf--itemDetails">Detalhes do item</label>
                  <input
                    id="nf--itemDetails"
                    type="text"
                    placeholder="Digite aqui"
                    v-model="form.itemDetails.value"
                    @blur="
                      visit('itemDetails');
                      validateInputs();
                    "
                    :disabled="$route.name === 'nf-invoice-consult'"
                  />
                  <span
                    v-if="form.itemDetails.isValid === false"
                    class="helper-text helper-text--error"
                    >{{ form.itemDetails.errorMessage }}</span
                  >
                </div> -->
              </div>

              <div class="form__row">
                <div
                  class="input-field flex-3"
                  :class="{
                    'input-field--error': form.quantity.isValid === false,
                  }"
                >
                  <label for="nf--quantity">Quantidade</label>
                  <input
                    id="nf--quantity"
                    type="number"
                    placeholder="Digite aqui"
                    v-model="form.quantity.value"
                    @blur="
                      visit('quantity');
                      validateInputs();
                    "
                    :disabled="$route.name === 'nf-invoice-consult'"
                  />
                  <span
                    v-if="form.quantity.isValid === false"
                    class="helper-text helper-text--error"
                    >{{ form.quantity.errorMessage }}</span
                  >
                </div>

                <div
                  class="input-field flex-3"
                  :class="{
                    'input-field--error': form.unityValue.isValid === false,
                  }"
                >
                  <label for="nf--unityValue">Valor unitário</label>
                  <input
                    id="nf--unityValue"
                    type="text"
                    placeholder="R$"
                    v-model="form.unityValue.value"
                    @input="
                      formatInputCurrency($event.target.value, 'unityValue')
                    "
                    @blur="
                      visit('unityValue');
                      validateInputs();
                    "
                    :disabled="$route.name === 'nf-invoice-consult'"
                  />
                  <span
                    v-if="form.unityValue.isValid === false"
                    class="helper-text helper-text--error"
                    >{{ form.unityValue.errorMessage }}</span
                  >
                </div>

                <div
                  class="input-field flex-3"
                  :class="{
                    'input-field--error': form.total.isValid === false,
                  }"
                >
                  <label for="nf--total">Total</label>
                  <input
                    id="nf--total"
                    type="text"
                    placeholder="R$"
                    v-model="form.total.value"
                    @input="formatInputCurrency($event.target.value, 'total')"
                    @blur="
                      visit('total');
                      validateInputs();
                    "
                    class="input--darkned"
                    disabled
                  />
                  <span
                    v-if="form.total.isValid === false"
                    class="helper-text helper-text--error"
                    >{{ form.total.errorMessage }}</span
                  >
                </div>
              </div>

              <!-- <div class="form__row">
                <div class="input-field width-auto">
                  <label for="">Desconto</label>

                  <ChooseUnity
                    :initialOption="form.discountUnity.value"
                    option1="R$"
                    text1="R$"
                    option2="%"
                    text2="%"
                    @onSelectOption="chooseDiscountUnity"
                  />
                </div>

                <div
                  class="input-field flex-3"
                  :class="{
                    'input-field--error': form.discount.isValid === false,
                    'input-field--icon': form.discountUnity.value === '%',
                  }"
                >
                  <label for=""></label>
                  <input
                    id="nf--discount"
                    type="text"
                    :placeholder="form.discountUnity.value === 'R$' ? 'R$' : ''"
                    v-model="form.discount.value"
                    @input="applyDiscount($event.target.value)"
                    @blur="
                      visit('discount');
                      validateInputs();
                    "
                  />
                  <span
                    v-if="form.discount.isValid === false"
                    class="helper-text helper-text--error"
                    >{{ form.discount.errorMessage }}</span
                  >
                </div>
              </div> -->

              <div class="form__row">
                <div class="price-section">
                  <div class="price-section__column">
                    <div class="price-section__item">
                      <p><strong>Total da venda</strong></p>
                      <!-- <p>1 serviço</p> -->
                    </div>
                  </div>
                  <div class="price-section__column">
                    <!-- <div class="price-section__item">
                      <p>Itens da venda</p>
                      <p class="green">
                        <strong>{{ form.total.value ?? "R$ 00,00" }}</strong>
                      </p>
                    </div> -->
                    <!-- <div class="price-section__sign">+</div> -->
                    <!-- <div class="price-section__item">
                      <p>Valores adicionais</p>
                      <p><strong>R$ 00,00</strong></p>
                    </div> -->
                    <!-- <div class="price-section__sign">-</div> -->
                    <!-- <div class="price-section__item">
                      <p>Desconto</p>
                      <p class="red">
                        <strong>{{ getDiscount() }}</strong>
                      </p>
                    </div> -->
                    <div class="price-section__sign">=</div>
                    <div class="price-section__item">
                      <p>Total</p>
                      <p>
                        <strong>{{ form.total.value ?? "R$ 00,00" }}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h3 class="form__subtitle">Informações fiscais</h3>

            <div class="form__section">
              <div class="form__row">
                <div
                  class="input-field"
                  :class="{
                    'input-field--error':
                      form.operationNature.isValid === false,
                  }"
                >
                  <label for="nf--operationNature">Natureza da operação</label>
                  <label
                    for="nf--operationNature"
                    class="input-field__select-area"
                  >
                    <select
                      id="nf--operationNature"
                      v-model="form.operationNature.value"
                      @blur="
                        visit('operationNature');
                        validateInputs();
                      "
                      class="input-field__select-area__select"
                      :disabled="$route.name === 'nf-invoice-consult'"
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

            <h3 class="form__subtitle">
              Observações adicionais da nota fiscal
            </h3>

            <div class="form__section">
              <div class="form__row">
                <div class="input-field flex-3">
                  <textarea
                    id="nf--observations"
                    type="text"
                    v-model="form.observations.value"
                    @blur="
                      visit('observations');
                      validateInputs();
                    "
                    placeholder="Digite aqui"
                    :disabled="$route.name === 'nf-invoice-consult'"
                  ></textarea>

                  <span
                    v-if="form.observations.isValid === false"
                    class="helper-text helper-text--error"
                    >{{ form.observations.errorMessage }}</span
                  >
                </div>
              </div>
            </div>

            <div class="form__footer">
              <div class="form__footer__buttons">
                <router-link
                  class="button button--outline"
                  :to="{ name: 'client', params: { id: clientId } }"
                >
                  {{
                    $route.name === "nf-invoice-consult" ? "Fechar" : "Cancelar"
                  }}</router-link
                >
                <button
                  class="button button--primary"
                  @click.prevent="step = 2"
                  :disabled="!isFormFirstStepAvailable"
                >
                  Próxima
                </button>
              </div>
            </div>
          </div>

          <div v-show="step === 2" class="step-2">
            <a @click.prevent="step = 1" class="back-button">
              <img
                src="@/assets/images/icons/angle-left-blue.svg"
                class="back-button__icon"
              />
              {{
                $route.name === "nf-invoice-consult"
                  ? "Voltar"
                  : "Voltar para editar"
              }}
            </a>

            <div class="card card--blue">
              <div class="step-2__header flex-left">
                <h2>Nota fiscal de serviço</h2>
                <div class="status status--sketch">Rascunho</div>
              </div>

              <h3 class="form__subtitle">dados da nota fiscal</h3>

              <div class="form__section">
                <div class="form__row form__row--limited-80">
                  <div
                    class="input-field flex-3"
                    :class="{
                      'input-field--error': form.rps.isValid === false,
                    }"
                  >
                    <label for="nf--rps">RPS</label>
                    <input
                      id="nf--rps"
                      type="text"
                      placeholder="Digite aqui"
                      v-model="form.rps.value"
                      @blur="
                        visit('rps');
                        validateInputs();
                      "
                      :disabled="$route.name === 'nf-invoice-consult'"
                    />
                    <span
                      v-if="form.rps.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.rps.errorMessage }}</span
                    >
                  </div>

                  <div
                    class="input-field flex-3"
                    :class="{
                      'input-field--error': form.rpsSerie.isValid === false,
                    }"
                  >
                    <label for="nf--rpsSerie">Série</label>
                    <input
                      id="nf--rpsSerie"
                      type="text"
                      placeholder="Digite aqui"
                      v-model="form.rpsSerie.value"
                      @blur="
                        visit('rpsSerie');
                        validateInputs();
                      "
                      :disabled="$route.name === 'nf-invoice-consult'"
                    />
                    <span
                      v-if="form.rpsSerie.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.rpsSerie.errorMessage }}</span
                    >
                  </div>

                  <div
                    v-if="!isBusy"
                    class="input-field input-field--datepicker flex-1"
                  >
                    <label for="nf--datepicker">Data do RPS</label>
                    <DatePicker
                      :isDisabled="false"
                      :initialValue="form.rpsDate.value"
                      @pickedChanged="pickDate($event, 'rpsDate')"
                    />
                  </div>

                  <div
                    v-if="!isBusy"
                    class="input-field input-field--datepicker flex-1"
                  >
                    <label for="nf--datepicker"
                      >Data de vencimento do RPS</label
                    >
                    <DatePicker
                      :isDisabled="false"
                      :initialValue="form.rpsDueDate.value"
                      @pickedChanged="pickDate($event, 'rpsDueDate')"
                    />
                  </div>
                </div>
              </div>

              <h3 class="form__subtitle">dados do tomador do serviço</h3>

              <div class="form__section">
                <div class="form__row">
                  <div
                    class="input-field flex-3"
                    :class="{
                      'input-field--error':
                        form.businessNameTaker.isValid === false,
                    }"
                  >
                    <label for="nf--businessNameTaker">Cliente</label>
                    <input
                      id="nf--businessNameTaker"
                      type="text"
                      v-model="form.businessNameTaker.value"
                      @blur="
                        visit('businessNameTaker');
                        validateInputs();
                      "
                      class="input--darkned"
                      disabled
                    />
                    <span
                      v-if="form.businessNameTaker.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.businessNameTaker.errorMessage }}</span
                    >
                  </div>

                  <div
                    class="input-field flex-3"
                    :class="{
                      'input-field--error': form.cpfCnpjTaker.isValid === false,
                    }"
                  >
                    <label for="nf--cpfCnpjTaker">CPF/CNPJ</label>
                    <input
                      id="nf--cpfCnpjTaker"
                      type="text"
                      placeholder="Digite
                    aqui"
                      v-model="form.cpfCnpjTaker.value"
                      @blur="
                        visit('cpfCnpjTaker');
                        validateInputs();
                      "
                      class="input--darkned"
                      disabled
                    />
                    <span
                      v-if="form.cpfCnpjTaker.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.cpfCnpjTaker.errorMessage }}</span
                    >
                  </div>

                  <div
                    class="input-field flex-3"
                    :class="{
                      'input-field--error': form.phoneTaker.isValid === false,
                    }"
                  >
                    <label for="nf--phoneTaker">Telefone</label>
                    <input
                      id="nf--phoneTaker"
                      type="text"
                      placeholder="Digite aqui"
                      v-model="form.phoneTaker.value"
                      @blur="
                        visit('phoneTaker');
                        validateInputs();
                      "
                      class="input--darkned"
                      disabled
                    />
                    <span
                      v-if="form.phoneTaker.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.phoneTaker.errorMessage }}</span
                    >
                  </div>

                  <div
                    class="input-field flex-3"
                    :class="{
                      'input-field--error': form.emailTaker.isValid === false,
                    }"
                  >
                    <label for="nf--emailTaker">E-mail</label>
                    <input
                      id="nf--emailTaker"
                      type="text"
                      placeholder="Digite aqui"
                      v-model="form.emailTaker.value"
                      @blur="
                        visit('emailTaker');
                        validateInputs();
                      "
                      class="input--darkned"
                      disabled
                    />
                    <span
                      v-if="form.emailTaker.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.emailTaker.errorMessage }}</span
                    >
                  </div>
                </div>

                <div class="form__row form__row--limited-80">
                  <div
                    class="input-field flex-3"
                    :class="{
                      'input-field--error': form.zipcodeTaker.isValid === false,
                    }"
                  >
                    <label for="nf--zipcodeTaker">CEP</label>
                    <input
                      id="nf--zipcodeTaker"
                      type="text"
                      placeholder="Digite aqui"
                      v-model="form.zipcodeTaker.value"
                      @blur="
                        visit('zipcodeTaker');
                        validateInputs();
                      "
                      class="input--darkned"
                      disabled
                    />
                    <span
                      v-if="form.zipcodeTaker.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.zipcodeTaker.errorMessage }}</span
                    >
                  </div>

                  <div
                    class="input-field flex-3"
                    :class="{
                      'input-field--error': form.streetTaker.isValid === false,
                    }"
                  >
                    <label for="nf--streetTaker">Endereço</label>
                    <input
                      id="nf--streetTaker"
                      type="text"
                      placeholder="Digite aqui"
                      v-model="form.streetTaker.value"
                      @blur="
                        visit('streetTaker');
                        validateInputs();
                      "
                      class="input--darkned"
                      disabled
                    />
                    <span
                      v-if="form.streetTaker.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.streetTaker.errorMessage }}</span
                    >
                  </div>

                  <div
                    class="input-field flex-3"
                    :class="{
                      'input-field--error': form.numberTaker.isValid === false,
                    }"
                  >
                    <label for="nf--numberTaker">Número</label>
                    <input
                      id="nf--numberTaker"
                      type="text"
                      placeholder="Digite aqui"
                      v-model="form.numberTaker.value"
                      @blur="
                        visit('numberTaker');
                        validateInputs();
                      "
                      class="input--darkned"
                      disabled
                    />
                    <span
                      v-if="form.numberTaker.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.numberTaker.errorMessage }}</span
                    >
                  </div>
                </div>

                <div class="form__row">
                  <div
                    class="input-field flex-3"
                    :class="{
                      'input-field--error': form.cityTaker.isValid === false,
                    }"
                  >
                    <label for="nf--cityTaker">Cidade</label>
                    <input
                      id="nf--cityTaker"
                      type="text"
                      placeholder="Digite aqui"
                      v-model="form.cityTaker.value"
                      @blur="
                        visit('cityTaker');
                        validateInputs();
                      "
                      class="input--darkned"
                      disabled
                    />
                    <span
                      v-if="form.cityTaker.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.cityTaker.errorMessage }}</span
                    >
                  </div>

                  <div
                    class="input-field flex-3"
                    :class="{
                      'input-field--error':
                        form.neighborhoodTaker.isValid === false,
                    }"
                  >
                    <label for="nf--neighborhoodTaker">Bairro</label>
                    <input
                      id="nf--neighborhoodTaker"
                      type="text"
                      placeholder="Digite aqui"
                      v-model="form.neighborhoodTaker.value"
                      @blur="
                        visit('neighborhoodTaker');
                        validateInputs();
                      "
                      class="input--darkned"
                      disabled
                    />
                    <span
                      v-if="form.neighborhoodTaker.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.neighborhoodTaker.errorMessage }}</span
                    >
                  </div>

                  <div class="input-field flex-3">
                    <label for="nf--complementTaker">Complemento</label>
                    <input
                      id="nf--complementTaker"
                      type="text"
                      :placeholder="
                        $route.name === 'nf-invoice-consult' ||
                        (form.complementTaker.value !== null &&
                          form.complementTaker.value !== '')
                          ? ''
                          : 'Digite aqui'
                      "
                      v-model="form.complementTaker.value"
                      @blur="
                        visit('complementTaker');
                        validateInputs();
                      "
                      class="input--darkned"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <h3 class="form__subtitle">Dados Fiscais do Serviço</h3>

              <div class="form__section">
                <!-- <div class="form__row">
                  <div
                    class="input-field flex-3"
                    :class="{
                      'input-field--error': form.description.isValid === false,
                    }"
                  >
                    <textarea
                      id="nf--description"
                      type="text"
                      v-model="form.description.value"
                      @blur="
                        visit('description');
                        validateInputs();
                      "
                      placeholder="Digite aqui"
                    ></textarea>

                    <span
                      v-if="form.description.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.description.errorMessage }}</span
                    >
                  </div>
                </div> -->

                <div class="form__row">
                  <div
                    class="input-field flex-3"
                    :class="{
                      'input-field--error':
                        form.serviceNameService.isValid === false,
                    }"
                  >
                    <label for="nf--serviceNameService">Serviço prestado</label>
                    <input
                      id="nf--serviceNameService"
                      type="text"
                      placeholder="Digite aqui"
                      v-model="form.serviceNameService.value"
                      @blur="
                        visit('serviceNameService');
                        validateInputs();
                      "
                      class="input--darkned"
                      disabled
                    />
                    <span
                      v-if="form.serviceNameService.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.serviceNameService.errorMessage }}</span
                    >
                  </div>

                  <div
                    class="input-field flex-3"
                    :class="{
                      'input-field--error': form.cnaeService.isValid === false,
                    }"
                  >
                    <label for="nf--cnaeService">CNAE</label>
                    <input
                      id="nf--cnaeService"
                      type="text"
                      placeholder="Digite aqui"
                      v-model="form.cnaeService.value"
                      @blur="
                        visit('cnaeService');
                        validateInputs();
                      "
                      class="input--darkned"
                      disabled
                    />
                    <span
                      v-if="form.cnaeService.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.cnaeService.errorMessage }}</span
                    >
                  </div>
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
                      placeholder="Digite aqui"
                      @blur="
                        visit('municipalServiceCode');
                        validateInputs();
                      "
                      disabled
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
                      v-model="form.complementaryLawCode.value"
                      placeholder="Digite aqui"
                      @blur="
                        visit('complementaryLawCode');
                        validateInputs();
                      "
                      disabled
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
                    class="input-field flex-3"
                    :class="{
                      'input-field--error': form.cityService.isValid === false,
                    }"
                  >
                    <label for="nf--cityService"
                      >Município de prestação do serviço</label
                    >
                    <input
                      id="nf--cityService"
                      type="text"
                      placeholder="Digite aqui"
                      v-model="form.cityService.value"
                      @blur="
                        visit('cityService');
                        validateInputs();
                      "
                      disabled
                    />
                    <span
                      v-if="form.cityService.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.cityService.errorMessage }}</span
                    >
                  </div>

                  <div
                    class="input-field flex-3"
                    :class="{
                      'input-field--error': form.ufService.isValid === false,
                    }"
                  >
                    <label for="nf--ufService">UF</label>
                    <input
                      id="nf--ufService"
                      type="text"
                      placeholder="Digite aqui"
                      v-model="form.ufService.value"
                      @blur="
                        visit('ufService');
                        validateInputs();
                      "
                      disabled
                    />
                    <span
                      v-if="form.ufService.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.ufService.errorMessage }}</span
                    >
                  </div>

                  <div
                    class="input-field max-width-50"
                    :class="{
                      'input-field--error':
                        form.issResponsible.isValid === false,
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
                        disabled
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
                </div>

                <div class="form__row form__row--limited-80">
                  <div
                    class="input-field flex-3 input-field--icon"
                    :class="{
                      'input-field--error': form.iss.isValid === false,
                    }"
                  >
                    <label for="nf--iss">ISS</label>
                    <input
                      id="nf--iss"
                      type="text"
                      placeholder="Digite aqui"
                      v-model="issValue"
                      @blur="
                        visit('iss');
                        validateInputs();
                      "
                      disabled
                    />
                    <span
                      v-if="form.iss.isValid === false"
                      class="helper-text helper-text--error"
                      >{{ form.iss.errorMessage }}</span
                    >
                  </div>
                  <div class="input-field flex-3">
                    <label for="nf--issDeduction">Dedução ISS</label>
                    <input
                      id="nf--issDeduction"
                      type="text"
                      placeholder="Digite aqui"
                      :value="issDeductionValue"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <h3 class="form__subtitle">Totais da nota fiscal</h3>

              <div class="form__section">
                <div class="input-field">
                  <label for="taker-option">Impostos da Nota Fiscal</label>

                  <div class="form-block-table">
                    <div class="form-block-table__content">
                      <div class="form-block-table__content__column">
                        <h4 class="form-block-table__content__title">
                          SERVIÇOS PRESTADOS
                        </h4>
                        <div class="form-block-table__content__column__line">
                          <p>Valor total dos serviços prestados</p>
                          <p>{{ form.total.value }}</p>
                        </div>
                      </div>
                      <div class="form-block-table__content__column">
                        <h4 class="form-block-table__content__title">
                          CÁLCULO DE IMPOSTOS DO SERVIÇO PRESTADO
                        </h4>
                        <div class="form-block-table__content__column__line">
                          <p>Base de cálculo</p>
                          <p>{{ form.total.value }}</p>
                        </div>
                        <div class="form-block-table__content__column__line">
                          <p>ISS</p>
                          <p>{{ issValue }} %</p>
                        </div>
                        <!-- <div class="form-block-table__content__column__line">
                          <p>CSLL</p>
                          <p>R$ 150,00</p>
                        </div>
                        <div class="form-block-table__content__column__line">
                          <p>COFINS</p>
                          <p>R$ 150,00</p>
                        </div>
                        <div class="form-block-table__content__column__line">
                          <p>PISS</p>
                          <p>R$ 150,00</p>
                        </div>
                        <div class="form-block-table__content__column__line">
                          <p>INSS</p>
                          <p>R$ 150,00</p>
                        </div> -->
                        <div class="form-block-table__content__column__line">
                          <p>Impostos que subtraem na Nota Fiscal</p>
                          <p>{{ issDeductionValue }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="form-block-table__footer">
                      <p>Total - Impostos</p>
                      <p>{{ nfTotal }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="$route.name !== 'nf-invoice-consult'"
                class="form__footer"
              >
                <div class="form__footer__buttons">
                  <router-link
                    :to="{ name: 'client', params: { id: clientId } }"
                    class="button button--outline"
                    >Cancelar</router-link
                  >
                  <button
                    class="button button--primary"
                    @click.prevent="confirmNF"
                    :disabled="!isFormAvailable"
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
          <button class="button button--primary" @click.prevent="handleIssueNf">
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
import nfModel from "@/data/models/nf-model.js";

/**
 * Services
 * */
import getClientCompanyService from "@/services/internal/company/get-client-by-id-service.js";
import getNfService from "@/services/internal/nf/get-nf-service.js";
import getTakerListService from "@/services/internal/taker/get-taker-list-service.js";
import getServiceListService from "@/services/internal/service/get-service-list-service.js";
import issueNfService from "@/services/internal/nf/issue-nf-service.js";
import { parseCurrencyToFloat } from "@/helpers/format-currency.js";
/**
 * Components
 * */
import Internal from "@/components/Internal.vue";
import DatePicker from "@/components/DatePicker.vue";
// import ChooseUnity from "@/components/ChooseUnity.vue";
import Modal from "@/components/Modal.vue";
// import Autocomplete from "@/components/Autocomplete.vue";
import Toast from "@/components/Toast.vue";
import Loader from "@/components/Loader.vue";

export default {
  name: "app-nf-invoice",

  mixins: [formMixin, nfModel],

  components: {
    Internal,
    DatePicker,
    // ChooseUnity,
    Modal,
    Toast,
    Loader,
    // Autocomplete,
  },

  data() {
    return {
      step: 1,

      isBusy: false,

      clientId: null,

      companyDataLoaded: null,

      takerList: null,
      currentTaker: null,

      serviceList: null,
      currentService: null,

      toast: {
        type: null,
        message: null,
        title: null,
      },

      currentNfId: null,
      currentNfData: null,
    };
  },

  computed: {
    filteredTakerNameList() {
      const takerNameList = this.takerList.map((item) => item.businessName);
      return takerNameList;
    },

    isFormAvailable() {
      return this.isFormValid();
    },

    isFormFirstStepAvailable() {
      return this.isFormFirstStepValid();
    },

    issDeductionValue() {
      return this.getDeductionValue();
    },

    nfTotal() {
      return this.getTotalWithDiscounts();
    },

    issValue() {
      let currentValue = this.form.iss.value;

      // Multiplica o valor por 100 para converter para porcentagem
      const percentage = currentValue * 100;

      // Formata o valor para exibir duas casas decimais e substitui o ponto por vírgula
      const formatted = percentage.toFixed(2).replace(".", ",");

      return formatted;
    },
  },

  watch: {
    "form.quantity.value"() {
      this.calculateTotalSellValue();
    },
    "form.unityValue.value"() {
      this.calculateTotalSellValue();
    },
  },

  methods: {
    getDiscount() {
      if (!this.form.discount.value) return "R$ 0,00";

      if (!this.form.discount.value.includes("R$")) {
        return `${this.form.discount.value} %`;
      }

      return this.form.discount.value;
    },

    convertStringToFloat(string) {
      // Remove o símbolo de moeda e substitui vírgula por ponto
      const numeroString = string.replace(/[^\d,]/g, "").replace(",", ".");
      // Converte a string para um número float
      const numeroFloat = parseFloat(numeroString);
      return numeroFloat;
    },

    getDeductionValue() {
      if (!this.form.total.value || !this.form.iss.value) {
        return "R$ 00,00";
      }

      const numberValue1 = this.convertStringToFloat(this.form.total.value);

      // Convertendo o valor do desconto para número
      let numberValue2;
      let result;

      // Verificando se o desconto está em reais (R$)
      numberValue2 = this.form.iss.value;
      result = numberValue1 * numberValue2;

      if (isNaN(numberValue1) || isNaN(numberValue2) || isNaN(result)) {
        return "R$ 00,00";
      }

      // Retornando o resultado formatado como moeda brasileira
      return result.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },

    getTotalWithDiscounts() {
      if (!this.form.total.value) {
        return "R$ 00,00";
      }

      const numberValue1 = this.convertStringToFloat(this.form.total.value);

      // Convertendo o valor do desconto para número
      let numberValue2;
      let result;

      // Verificando se o desconto está em reais (R$)
      numberValue2 = this.convertStringToFloat(this.getDeductionValue());
      result = numberValue1 - numberValue2;

      if (isNaN(numberValue1) || isNaN(numberValue2) || isNaN(result)) {
        return "R$ 00,00";
      }

      // Retornando o resultado formatado como moeda brasileira
      return result.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },

    // getTotal() {
    //   if (!this.form.total.value || !this.form.discount.value) {
    //     return "R$ 00,00";
    //   }

    //   const numberValue1 = this.convertStringToFloat(this.form.total.value);

    //   // Convertendo o valor do desconto para número
    //   let numberValue2;
    //   let result;

    //   // Verificando se o desconto está em reais (R$)
    //   if (this.form.discount.value.includes("R$")) {
    //     numberValue2 = this.convertStringToFloat(this.form.discount.value);

    //     result = numberValue1 - numberValue2;
    //   } else {
    //     numberValue2 = this.convertStringToFloat(this.form.discount.value);
    //     numberValue2 = numberValue2 / 100;

    //     result = numberValue1 * (1 - numberValue2);
    //   }

    //   if (isNaN(numberValue1) || isNaN(numberValue2) || isNaN(result)) {
    //     return "R$ 00,00";
    //   }

    //   // Retornando o resultado formatado como moeda brasileira
    //   return result.toLocaleString("pt-BR", {
    //     style: "currency",
    //     currency: "BRL",
    //   });
    // },

    showSuccessToast(message) {
      this.toast = {
        type: "success",
        message: message,
        title: "NF em processamento!",
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

    pickDate(date, reference) {
      this.form[reference].value = this.formatDate(date);
      if (this.form[reference].value) {
        this.form[reference].isVisited = true;
      }
    },

    chooseDiscountUnity(option) {
      this.form.discountUnity.value = option;

      this.applyDiscount(this.form.discount.value);

      if (this.form.discountUnity.value) {
        this.form.discountUnity.isVisited = true;
      }
    },

    applyDiscount(value) {
      if (this.form.discountUnity.value === "R$") {
        this.formatInputCurrency(value, "discount");
      } else {
        this.formatToPercentage(value, "discount");
      }
    },

    calculateTotalSellValue() {
      if (
        this.form.quantity.value &&
        this.form.quantity.value !== "" &&
        this.form.unityValue.value &&
        this.form.unityValue.value !== ""
      ) {
        const unityValue = parseCurrencyToFloat(this.form.unityValue.value);
        const quantity = parseInt(this.form.quantity.value);
        const total = unityValue * quantity;

        this.form.total.value = this.formatValueCurrency(total);
        this.form.total.isValid = true;
        this.form.total.isVisited = true;
      }
    },

    confirmNF() {
      this.$refs.modal.open();
    },

    closeModal() {
      this.$refs.modal.close();
    },

    selectTaker() {
      const takerId = this.form.taker.value;

      const selectedTaker = this.takerList.find(
        (taker) => taker.id === takerId
      );

      if (selectedTaker) {
        this.currentTaker = selectedTaker;

        if (selectedTaker.businessName) {
          this.updateField(selectedTaker.businessName, "businessNameTaker");
        }
        if (selectedTaker.cpfCnpj) {
          this.updateField(selectedTaker.cpfCnpj, "cpfCnpjTaker");
        }
        if (selectedTaker.email) {
          this.updateField(selectedTaker.email, "emailTaker");
        }
        if (selectedTaker.phone) {
          this.updateField(selectedTaker.phone, "phoneTaker");
        }
        if (selectedTaker.address && selectedTaker.address.email) {
          this.updateField(selectedTaker.address.email, "emailTaker");
        }
        if (selectedTaker.address && selectedTaker.address.zipcode) {
          this.updateField(selectedTaker.address.zipcode, "zipcodeTaker");
        }
        if (selectedTaker.address && selectedTaker.address.street) {
          this.updateField(selectedTaker.address.street, "streetTaker");
        }
        if (selectedTaker.address && selectedTaker.address.number) {
          this.updateField(selectedTaker.address.number, "numberTaker");
        }
        if (selectedTaker.address && selectedTaker.address.city) {
          this.updateField(selectedTaker.address.city, "cityTaker");
        }
        if (selectedTaker.address && selectedTaker.address.neighborhood) {
          this.updateField(
            selectedTaker.address.neighborhood,
            "neighborhoodTaker"
          );
        }
        if (selectedTaker.address && selectedTaker.address.complement) {
          this.updateField(selectedTaker.address.complement, "complementTaker");
        }

        this.validateInputs();
      }
    },

    selectService() {
      const serviceId = this.form.service.value;

      const selectedService = this.serviceList.find(
        (service) => service.id === serviceId
      );

      if (selectedService) {
        this.currentService = selectedService;

        if (selectedService.serviceName) {
          this.updateField(selectedService.serviceName, "serviceNameService");
        }

        if (selectedService.cnae && selectedService.cnae.code) {
          this.updateField(selectedService.cnae.code, "cnaeService");
        }

        if (selectedService.operationNature) {
          this.updateField(selectedService.operationNature, "operationNature");
        }

        if (selectedService.municipalServiceCode) {
          this.updateField(
            selectedService.municipalServiceCode,
            "municipalServiceCode"
          );
        }

        if (selectedService.complementaryLawCode) {
          this.updateField(
            selectedService.complementaryLawCode,
            "complementaryLawCode"
          );
        }

        if (selectedService.serviceCity) {
          this.updateField(selectedService.serviceCity, "cityService");
        }

        if (selectedService.serviceUF) {
          this.updateField(selectedService.serviceUF, "ufService");
        }

        if (selectedService.iss.responsible) {
          this.updateField(selectedService.iss.responsible, "issResponsible");
        }

        if (selectedService.iss.value) {
          this.updateField(selectedService.iss.value, "iss");
        }

        if (selectedService.sellingValue) {
          this.formatCurrencyFromNumber(
            selectedService.sellingValue,
            "unityValue"
          );
        }

        this.validateInputs();
      }
    },

    formatToPercentage(value, reference) {
      let currentValue;

      if (value != "" && value != null) {
        currentValue = parseFloat(value.replace(/\D/g, "").replace(",", ".")); // Converte para número e remove todos os caracteres não numéricos
      } else {
        return "";
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

    formatCurrencyFromNumber(value, reference) {
      if (value === undefined || value === null) return;

      let currentValue;

      // Verifica o tipo do valor e converte para número, se necessário
      if (typeof value === "string") {
        currentValue = parseFloat(value.replace(/\D/g, ".")) || 0;
      } else {
        currentValue = parseFloat(value) || 0;
      }

      // Formata o valor
      const formatted = currentValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      // Atualiza o modelo com o valor formatado
      this.form[reference].value = formatted;
      this.form[reference].isValid = true;
      this.form[reference].isVisited = true;
    },

    formatInputCurrency(value, reference) {
      if (!value) return;

      let currentValue = value.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
      currentValue = parseInt(currentValue || "0", 10); // Converte para inteiro

      // Formata o valor
      const formatted = (currentValue / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      // Atualiza o modelo com o valor formatado
      this.form[reference].value = formatted;
    },

    formatValueCurrency(currenValue) {
      const formatted = currenValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      return formatted;
    },

    validateInputs() {
      // FILLED FIELDS

      this.validateField({
        reference: this.form.sellingValue,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.taker,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.sellingDate,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      // this.validateField({
      //   reference: this.form.category,
      //   validateFunction: this.validateNotEmpty,
      //   errorMessage: this.messages.requiredMessage,
      // });

      this.validateField({
        reference: this.form.service,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      // this.validateField({
      //   reference: this.form.itemDetails,
      //   validateFunction: this.validateNotEmpty,
      //   errorMessage: this.messages.requiredMessage,
      // });

      this.validateField({
        reference: this.form.quantity,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.unityValue,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.total,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      // this.validateField({
      //   reference: this.form.discount,
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

      // this.validateField({
      //   reference: this.form.observations,
      //   validateFunction: this.validateNotEmpty,
      //   errorMessage: this.messages.requiredMessage,
      // });

      // this.validateField({
      //   reference: this.form.description,
      //   validateFunction: this.validateNotEmpty,
      //   errorMessage: this.messages.requiredMessage,
      // });

      this.validateField({
        reference: this.form.rps,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.rpsSerie,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.rpsDate,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.rpsDueDate,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      // AUTOCOMPLETED FIELDS

      this.validateField({
        reference: this.form.cpfCnpjTaker,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.businessNameTaker,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.zipcodeTaker,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.streetTaker,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.cityTaker,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.neighborhoodTaker,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.numberTaker,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.phoneTaker,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.emailTaker,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.serviceNameService,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.cnaeService,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.cityService,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      this.validateField({
        reference: this.form.ufService,
        validateFunction: this.validateNotEmpty,
        errorMessage: this.messages.requiredMessage,
      });

      // this.validateField({
      //   reference: this.form.issResponsible,
      //   validateFunction: this.validateNotEmpty,
      //   errorMessage: this.messages.requiredMessage,
      // });

      // this.validateField({
      //   reference: this.form.iss,
      //   validateFunction: this.validateNotEmpty,
      //   errorMessage: this.messages.requiredMessage,
      // });
    },

    isFormFirstStepValid() {
      if (
        this.form.sellingValue.isValid &&
        this.form.sellingDate.isValid &&
        this.form.taker.isValid &&
        // this.form.category.isValid &&
        this.form.service.isValid &&
        // this.form.itemDetails.isValid &&
        this.form.quantity.isValid &&
        this.form.unityValue.isValid &&
        this.form.total.isValid &&
        // this.form.discount.isValid &&
        this.form.municipalServiceCode.isValid
        // this.form.observations.isValid
      ) {
        return true;
      }

      return false;
    },

    isFormValid() {
      if (
        this.form.sellingValue.isValid &&
        this.form.taker.isValid &&
        this.form.sellingDate.isValid &&
        // this.form.category.isValid &&
        this.form.service.isValid &&
        // this.form.itemDetails.isValid &&
        this.form.quantity.isValid &&
        this.form.unityValue.isValid &&
        this.form.total.isValid &&
        // this.form.discount.isValid &&
        this.form.operationNature.isValid &&
        // this.form.observations.isValid &&
        // this.form.description.isValid &&
        this.form.rps.isValid &&
        this.form.rpsSerie.isValid &&
        this.form.rpsDate.isValid &&
        this.form.rpsDueDate.isValid
        // this.form.cpfCnpjTaker.isValid &&
        // this.form.businessNameTaker.isValid &&
        // this.form.zipcodeTaker.isValid &&
        // this.form.streetTaker.isValid &&
        // this.form.cityTaker.isValid &&
        // this.form.neighborhoodTaker.isValid &&
        // this.form.numberTaker.isValid &&
        // this.form.phoneTaker.isValid &&
        // this.form.emailTaker.isValid &&
        // this.form.serviceNameService.isValid &&
        // this.form.cnaeService.isValid &&
        // this.form.cityService.isValid &&
        // this.form.ufService.isValid &&
        // this.form.issResponsible.isValid &&
        // this.form.iss.isValid
      ) {
        return true;
      }

      return false;
    },

    async getTakers() {
      this.isBusy = true;

      try {
        const takersResponse = await getTakerListService(this.clientId);

        this.takerList = takersResponse.data.clientTakers.filter(
          (item) => item.isActive
        );

        this.isBusy = false;
      } catch (error) {
        this.showErrorToast(error);
        this.isBusy = false;
      }
    },

    async getServiceList() {
      this.isBusy = true;

      try {
        const response = await getServiceListService(this.clientId);
        this.serviceList = response?.data?.filter(
          (item) => item.isActive === true
        );

        this.isBusy = false;
      } catch (error) {
        const errorMessage = error
          ? error
          : "Não foi possível carregar os serviços. Tente novamente mais tarde.";

        this.showErrorToast("Falha ao buscar serviços", errorMessage);

        this.isBusy = false;
      }
    },

    autoCompleteNfDataForm(nfData) {
      const formUpdated = {};

      for (const key in nfData) {
        const fieldData = nfData[key];
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

    async getNfData() {
      this.isBusy = true;

      try {
        const response = await getNfService(this.currentNfId);
        this.currentNfData = response.data;

        const nfData = {
          // FILLED FIELDS
          sellingValue: this.currentNfData?.sellingValue ?? null,
          sellingDate: this.currentNfData?.sellingDate ?? null,
          taker: this.currentNfData?.taker?.id ?? "-1",
          service: this.currentNfData?.service?.id ?? "-1",
          // itemDetails: this.currentNfData?.itemDetails ?? null,
          quantity: this.currentNfData?.quantity ?? 1,
          unityValue: this.currentNfData?.unityValue ?? null,
          total: this.currentNfData?.total ?? null,
          operationNature: this.currentNfData?.operationNature ?? "-1",
          observations: this.currentNfData?.observations ?? null,

          // RPS FIELDS
          rps: this.currentNfData?.rps ?? null,
          rpsSerie: this.currentNfData?.rpsSerie ?? null,
          rpsDate: this.currentNfData?.rpsDate ?? null,
          rpsDueDate: this.currentNfData?.rpsDueDate ?? null,

          // TAKER FIELDS
          cpfCnpjTaker: this.currentNfData?.taker.cpfCnpj ?? null,
          businessNameTaker: this.currentNfData?.taker.businessName ?? null,
          zipcodeTaker: this.currentNfData?.taker?.address?.zipcode ?? null,
          streetTaker: this.currentNfData?.taker?.address?.street ?? null,
          complementTaker:
            this.currentNfData?.taker?.address?.complement ?? null,
          cityTaker: this.currentNfData?.taker?.address?.city ?? null,
          neighborhoodTaker:
            this.currentNfData?.taker?.address?.neighborhood ?? null,
          numberTaker: this.currentNfData?.taker?.address?.number ?? null,
          phoneTaker: this.currentNfData?.taker?.phone ?? null,
          emailTaker: this.currentNfData?.taker?.email ?? null,

          // SERVICE FIELDS
          serviceNameService: this.currentNfData?.service?.serviceName ?? null,
          cnaeService: this.currentNfData?.service?.cnae.code ?? null,
          cityService: this.currentNfData?.service?.serviceCity ?? null,
          ufService: this.currentNfData?.service?.serviceUF ?? null,
          municipalServiceCode:
            this.currentNfData?.service?.municipalServiceCode ?? null,
          complementaryLawCode:
            this.currentNfData?.service?.complementaryLawCode ?? null,

          // ISS FIELDS
          issResponsible: this.currentNfData?.issResponsible ?? "my-client",
          iss: this.currentNfData?.iss ?? null,
        };

        this.currentTaker = this.currentNfData.taker;
        this.currentService = this.currentNfData.service;

        this.autoCompleteNfDataForm(nfData);

        this.isBusy = false;
      } catch (error) {
        const errorMessage = error
          ? error
          : "Não foi possível carregar os dados da nota fiscal. Tente novamente mais tarde.";

        this.showErrorToast("Falha ao buscar nota fiscal", errorMessage);

        this.isBusy = false;
      }
    },

    async getCompanyData() {
      this.isBusy = true;

      try {
        const response = await getClientCompanyService(this.clientId);

        this.companyDataLoaded = response?.data;

        this.autoCompleteForm(this.companyDataLoaded);

        this.isBusy = false;
      } catch (error) {
        this.isBusy = false;
      }
    },

    async handleIssueNf() {
      if (this.isFormValid()) {
        this.isBusy = true;

        try {
          const nfData = {
            companyUid: this.clientId,
            sellingValue: this.form.sellingValue.value,
            sellingDate: this.form.sellingDate.value,
            taker: this.currentTaker,
            service: this.currentService,
            // itemDetails: this.form.itemDetails.value,
            quantity: this.form.quantity.value,
            unityValue: this.form.unityValue.value,
            total: this.form.total.value,
            totalWithDiscounts: this.nfTotal,
            operationNature: this.form.operationNature.value,
            observations: this.form.observations.value,
            rps: this.form.rps.value,
            rpsSerie: this.form.rpsSerie.value,
            rpsDate: this.form.rpsDate.value,
            rpsDueDate: this.form.rpsDueDate.value,
            iss: {
              value: this.form.iss.value,
              responsible: this.form.issResponsible.value,
            },
          };

          if (
            this.$route.name === "nf-invoice-detail" &&
            this.currentNfData != null
          ) {
            nfData.importMethod = "automatically-imported";
          } else {
            nfData.importMethod = "manually-imported";
          }

          const response = await issueNfService(nfData);

          if (response.data) {
            this.closeModal();

            this.showSuccessToast(
              "Sua NF está em processo de emissão e logo poderá ser consultada."
            );

            this.$router.push({
              name: "client",
              params: {
                id: this.clientId,
              },
            });
          }
        } catch (error) {
          let errorMessage;

          if (error != null && typeof error === "string") {
            errorMessage = error;
          } else {
            errorMessage =
              "Não foi possível emitir nota fiscal. Tente novamente mais tarde.";
          }

          console.error(`${errorMessage}: ${error}`);

          this.showErrorToast(errorMessage);
        } finally {
          this.isBusy = false;
        }
      }
    },
  },

  async mounted() {
    const clientId = this.$route.params.id;
    const nfId = this.$route.params.nfId;

    this.clientId = clientId;

    if (!clientId) {
      this.$router.go(-1);
    }

    if (nfId) {
      this.currentNfId = nfId;
      await this.getNfData();
    }

    await this.getCompanyData();
    await this.getTakers();
    await this.getServiceList();
  },
};
</script>
<style lang=""></style>
