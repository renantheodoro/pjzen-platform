<template lang="">
  <div class="authentication">
    <div class="authentication__view">
      <router-view></router-view>
    </div>

    <div class="authentication_thumb">
      <img src="@/assets/images/register-thumb.png" />
    </div>
  </div>
</template>
<script>
export default {
  name: "app-create-user",

  data() {
    return {
      passwordFieldType: "password",
    };
  },

  methods: {
    togglePasswordView() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },
  },
};
</script>
