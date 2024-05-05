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
};
