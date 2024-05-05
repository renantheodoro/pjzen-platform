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
        email: {
          value: null,
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
        permission: {
          value: "-1",
          isValid: null,
          errorMessage: "",
          isVisited: false,
        },
      };
    },
  },
};
