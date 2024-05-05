export default {
  data() {
    return {
      form: this.buildEmptyForm(),
    };
  },

  methods: {
    updateForm(updatedForm) {
      // Mesclar o formulário atual com o formulário recebido
      this.form = Object.assign({}, this.form, updatedForm);
    },

    buildEmptyForm() {
      return {
        entityType: {
          value: "cnpjPerson", // cpfPerson || cnpjPerson
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        isActive: {
          value: true,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        cpfCnpj: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        businessName: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        tradeName: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        cnae: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        foundationDate: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: null,
        },
        taxRegime: {
          value: "-1",
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        companyOffering: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        municipalRegistration: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        zipcode: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        street: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        number: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        complement: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        city: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        uf: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        neighborhood: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        email: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        phone: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        prefectureLogin: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        prefecturePassword: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
      };
    },
  },
};
