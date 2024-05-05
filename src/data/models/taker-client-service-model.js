export default {
  data() {
    return {
      form: this.buildEmptyForm(),
    };
  },

  methods: {
    updateForm(updatedForm) {
      this.form = Object.assign({}, this.form, updatedForm);
    },

    buildEmptyForm() {
      return {
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
        uf: {
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
        neighborhood: {
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
        phone: {
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
      };
    },
  },
};
