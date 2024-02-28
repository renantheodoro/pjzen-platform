import validateZipcode from "@/services/validate-cep-service.js";
import { mask } from "vue-the-mask";

export default {
  data() {
    return {
      messages: {
        requiredMessage: "Este campo é obrigatório",
        invalidEmail: "Este campo deve ter um endereço de e-mail válido",
        invalidPassword:
          "Sua senha precisa ter pelo menos 6 dígitos, um caracter especial, números não sequencias e uma letra maiúscula.",
        invalidPhone: "Telefone inválido",
        requiredSelectedMessage: "Seleciona uma opção para continuar",
        invalidCardNumber: "O número do cartão é inválido",
        invalidCNPJMessage: "CNPJ inválido",
        invalidCPFMessage: "CPF inválido",
        invalidDateMessage: "Formato de data inválida",
        documentMessage: "Documento inválido",
        invalidExpirationDateMessage: "Data de vencimento inválida",
        invalidCodeNumber: "Código de segurança inválido",
        differentPasswords: "As senhas não são iguais",
      },

      masks: {
        phone: ["(##) ####-####", "(##) #####-####"],
        cpf: ["###.###.###-##"],
        cnpj: ["##.###.###/####-##"],
        cardNumber: ["#### #### #### ####"],
        expirationDate: ["##/##"],
        cvc: ["###"],
        zipCode: ["#####-###"],
        clientsNumber: ["#####"],
      },
    };
  },

  directives: { mask },

  methods: {
    checkGroupForm(group, fields) {
      let isInvalid = 0;

      for (let index = 0; index < fields.length; index++) {
        const field = fields[index];

        if (!group[field].isValid) {
          isInvalid++;
          group[field].isVisited = true;
        }
      }

      return isInvalid > 0 ? false : true;
    },

    visit(field) {
      this.form[field].isVisited = true;
    },

    validateNotEmpty(value) {
      return value !== null && value !== "";
    },

    validateEmail(value) {
      if (!this.validateNotEmpty(value)) {
        return false;
      }
      return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value);
    },

    validatePassword(value) {
      if (!this.validateNotEmpty(value)) {
        return false;
      }

      // Verifica se a senha tem pelo menos 6 caracteres
      if (value.length < 6) {
        return false;
      }

      // Verifica se a senha contém pelo menos uma letra maiúscula
      if (!/[A-Z]/.test(value)) {
        return false;
      }

      // Verifica se a senha contém pelo menos um caractere especial
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        return false;
      }

      // Verifica se a senha contém pelo menos um número
      if (!/\d/.test(value)) {
        return false;
      }

      // Verifica se a senha não contém sequências de números
      if (/123|456|789|012/.test(value)) {
        return false;
      }

      // Se passou por todas as verificações, a senha é válida
      return true;
    },

    validateNumberOnly(value) {
      if (!this.validateNotEmpty(value)) {
        return false;
      }
      return new RegExp(/^\d+$/).test(value);
    },

    validatePhone(value) {
      if (!this.validateNotEmpty(value)) {
        return false;
      }
      return new RegExp(
        /(\([0-9]{2}\)\s?[0-9]{4,5}-?[0-9]{3,4})|([0-9]{10,11})|([0-9]{2}\s?[0-9]{8,9})/
      ).test(value);
    },

    validateUF(value) {
      if (!this.validateNotEmpty(value)) {
        return false;
      }

      const ufs = [
        "AC",
        "AL",
        "AP",
        "AM",
        "BA",
        "CE",
        "DF",
        "ES",
        "GO",
        "MA",
        "MT",
        "MS",
        "MG",
        "PA",
        "PB",
        "PR",
        "PE",
        "PI",
        "RJ",
        "RN",
        "RS",
        "RO",
        "RR",
        "SC",
        "SP",
        "SE",
        "TO",
      ];

      // Verifica se o valor é uma string não vazia
      if (typeof value !== "string" || value.trim().length === 0) {
        return false;
      }

      // Converte a UF para maiúsculas (caso não esteja)
      const uf = value.toUpperCase();

      // Verifica se a UF é válida
      return ufs.includes(uf);
    },

    async validateZipcode(value) {
      this.isBusy = true;

      const response = await validateZipcode(value);

      if (!response || response.error) {
        return false;
      }

      if (response) {
        this.form.zipcode.value = response.cep ?? "";
        this.form.street.value = response.logradouro ?? "";
        this.form.neighborhood.value = response.bairro ?? "";
        this.form.city.value = response.localidade ?? "";
        this.form.uf.value = response.uf ?? "";

        this.visit("zipcode");
        this.visit("street");
        this.visit("neighborhood");
        this.visit("city");
        this.visit("uf");

        this.validateInputs();
      }

      this.isBusy = false;

      return true;
    },

    validateSelect(value) {
      return value !== "" && value !== "-1" && value != "0";
    },

    validateCNPJOrCPF(value) {
      return new RegExp(
        /(([0-9]{2}[.]?[0-9]{3}[.]?[0-9]{3}[/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}[-]?[0-9]{2}))/
      ).test(value);
    },

    formatDate(date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    },

    validateDate(value) {
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(value)) {
        return false;
      }

      // Obtém o dia, mês e ano da string
      const [day, month, year] = value.split("/").map(Number);

      // Verifica se o ano é bissexto
      const isLeapYear =
        (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

      // Define a quantidade de dias em cada mês
      const daysInMonth = [
        31,
        isLeapYear ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
      ];

      // Verifica se o mês está dentro do intervalo válido
      if (month < 1 || month > 12) {
        return false;
      }

      // Verifica se o dia está dentro do intervalo válido para o mês
      if (day < 1 || day > daysInMonth[month - 1]) {
        return false;
      }

      return true;
    },

    validateCardNumber(value) {
      const ccNum = value.replaceAll(" ", "");

      let visa = /^4[0-9]{12}(?:[0-9]{3,4})?$/;
      let visa_local = /^4[19658][7684][0785][04278][128579](?:[0-9]{10})$/;
      let mastercard =
        /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/;
      let mastercard_local =
        /^(?:5[13]99|55[35][19]|514[36])(?:11|4[10]|23|83|88)(?:[0-9]{10})$/;
      let verve = /^(?:50[067][180]|6500)(?:[0-9]{15})$/;
      let american_exp = /^3[47](?:[0-9]{13})$/;
      let diners_club = /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/;
      let maestro =
        /^(5899|5018|5020|5038|6304|6703|6708|6759|676[1-3])[06][19](?:[0-9]{10})$/;
      let discover = /^6(?:011|4[4-9]3|222|5[0-9]{2})[0-9]{12}$/;
      let laser = /^(6706|6771|6709)[0-9]{11,15}$/;
      let hipercard = /^(384100|384140|384160|606282|637095|637568|60(?!11))/;
      let jcb = /^(?:2131|1800|35\d{3})\d{11}$/;

      if (visa.test(ccNum)) {
        return true;
      }
      if (visa_local.test(ccNum)) {
        return true;
      }
      if (mastercard.test(ccNum)) {
        return true;
      }
      if (mastercard_local.test(ccNum)) {
        return true;
      }
      if (verve.test(ccNum)) {
        return true;
      }
      if (american_exp.test(ccNum)) {
        return true;
      }
      if (diners_club.test(ccNum)) {
        return true;
      }
      if (maestro.test(ccNum)) {
        return true;
      }
      if (discover.test(ccNum)) {
        return true;
      }
      if (laser.test(ccNum)) {
        return true;
      }
      if (hipercard.test(ccNum)) {
        return true;
      }
      if (jcb.test(ccNum)) {
        return true;
      }

      return false;
    },

    validateExpirationDate(value) {
      const mm = value.split("/")[0];
      const yy = value.split("/")[1];

      if (mm <= 0) {
        return false;
      } else if (mm > 12) {
        return false;
      } else if (yy < new Date().getFullYear().toString().substring(2, 4)) {
        return false;
      }

      return true;
    },

    validateSecurityCode(value) {
      return value.length === 3;
    },

    compareEqualValues(value1, value2) {
      return value1 === value2;
    },

    validatePasswords(reference1, reference2) {
      if (
        !this.validateField({
          reference: reference1,
          validateFunction: this.validatePassword,
          errorMessage: this.messages.invalidPassword,
        })
      ) {
        return false;
      }

      if (
        !this.validateField({
          reference: reference2,
          validateFunction: this.validatePassword,
          errorMessage: this.messages.invalidPassword,
        })
      ) {
        return false;
      }

      if (reference1.isVisited && reference2.isVisited) {
        if (this.compareEqualValues(reference1.value, reference2.value)) {
          reference1.isValid = true;
          reference2.isValid = true;
        } else {
          reference1.isValid = false;
          reference2.isValid = false;
          reference1.errorMessage = this.messages.differentPasswords;
          reference2.errorMessage = this.messages.differentPasswords;
        }
      }
    },

    validateField({ reference, validateFunction, errorMessage }) {
      if (reference.isVisited) {
        if (validateFunction(reference.value)) {
          reference.isValid = true;
          return true;
        } else {
          reference.isValid = false;
          reference.errorMessage = errorMessage;
          return false;
        }
      }
    },
  },
};
