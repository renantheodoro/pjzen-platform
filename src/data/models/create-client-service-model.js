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
        serviceName: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        internalCode: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        type: {
          value: "-1",
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        sellingValue: {
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
        coastValue: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        municipalServiceCode: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        complementaryLawCode: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        operationNature: {
          value: "-1",
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        serviceUF: {
          value: "-1",
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        serviceCity: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        hasRetainedIss: {
          value: "Sim",
          isValid: true,
          errorMessage: "",
          isVisited: false,
        },
        issResponsible: {
          value: "my-client",
          isValid: true,
          errorMessage: "",
          isVisited: false,
        },
        iss: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        // inss: {
        //   value: null,
        //   isValid: null,
        //   errorMessage: "",
        //   isVisited: false,
        // },
      };
    },
  },
};
