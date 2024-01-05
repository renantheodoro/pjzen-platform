export default {
    data() {
      return {
        form: {
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
  