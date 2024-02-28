export default {
  data() {
    return {
      form: {
        type: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        file: {
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
