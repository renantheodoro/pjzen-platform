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
        // NF
        sellingValue: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        taker: {
          value: "-1",
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        sellingDate: {
          value: null,
          isValid: true,
          errorMessage: "",
          isVisited: false,
        },
        // category: {
        //   value: null,
        //   isValid: null,
        //   errorMessage: "",
        //   isVisited: false,
        // },
        service: {
          value: "-1",
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        itemDetails: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        quantity: {
          value: 1,
          isValid: true,
          errorMessage: "",
          isVisited: false,
        },
        unityValue: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        total: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        // discountUnity: {
        //   value: "R$", // R$ | %
        //   isValid: true,
        //   errorMessage: "",
        //   isVisited: true,
        // },
        // discount: {
        //   value: null,
        //   isValid: null,
        //   errorMessage: "",
        //   isVisited: false,
        // },
        operationNature: {
          value: "-1",
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        observations: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        description: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },

        // RPS
        rps: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        rpsSerie: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        rpsDate: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        rpsDueDate: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },

        // TAKER
        cpfCnpjTaker: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        businessNameTaker: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        zipcodeTaker: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        streetTaker: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        complementTaker: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        cityTaker: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        neighborhoodTaker: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        numberTaker: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        phoneTaker: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        emailTaker: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },

        // SERVICE
        serviceNameService: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        cnaeService: {
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
        cityService: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        ufService: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },

        // ISS
        issResponsible: {
          value: "my-client",
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        iss: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
      };
    },
  },
};
