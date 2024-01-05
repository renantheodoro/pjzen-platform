export default {
  data() {
    return {
      form: {
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
      },
    };
  },
};
