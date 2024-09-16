export default {
  data() {
    return {
      form: {
        firstName: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        lastName: {
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
        company: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        cnpj: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        clientsNumber: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        serviceType: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        password: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        confirmPassword: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
      },
    };
  },

  mounted() {},

  methods: {
    mockData() {
      return {
        firstName: {
          value: "Empresa",
          isValid: true,
          errorMessage: "",
          isVisited: true,
        },
        lastName: {
          value: "Teste",
          isValid: true,
          errorMessage: "",
          isVisited: true,
        },
        email: {
          value: "renan.b.theodoro+1@gmail.com",
          isValid: true,
          errorMessage: "",
          isVisited: true,
        },
        phone: {
          value: "11999999999",
          isValid: true,
          errorMessage: "",
          isVisited: true,
        },
        company: {
          value: "Contabilidate LTDA",
          isValid: true,
          errorMessage: "",
          isVisited: true,
        },
        cnpj: {
          value: "84.170.408/0001-00",
          isValid: true,
          errorMessage: "",
          isVisited: true,
        },
        clientsNumber: {
          value: "1",
          isValid: true,
          errorMessage: "",
          isVisited: true,
        },
        serviceType: {
          value: "Teste 1",
          isValid: true,
          errorMessage: "",
          isVisited: true,
        },
        password: {
          value: "Teste@2121",
          isValid: true,
          errorMessage: "",
          isVisited: true,
        },
        confirmPassword: {
          value: "Teste@2121",
          isValid: true,
          errorMessage: "",
          isVisited: true,
        },
      };
    },
  },
};
