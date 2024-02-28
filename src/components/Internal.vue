<template>
  <div class="container">
    <div class="view__row">
      <ViewSidebar v-if="currentClient" :currentClient="currentClient" />

      <div class="view__column view__column--content">
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
/**
 * Services
 * */
import getClientByIdService from "@/services/company/get-client-by-id-service.js";

/**
 * Components
 * */
import ViewSidebar from "@/components/ViewSidebar.vue";

export default {
  name: "app-internal",

  props: {
    clientId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isBusy: false,
      currentClient: null,
    };
  },

  components: {
    ViewSidebar,
  },

  mounted() {
    this.handleGetClient();
  },

  methods: {
    async handleGetClient() {
      this.isBusy = true;

      try {
        const currentClient = await getClientByIdService(this.clientId);

        if (currentClient) {
          this.currentClient = currentClient;
        }
      } catch (error) {
        this.isBusy = false;
        const errorMessage = error
          ? error
          : "Não foi possível buscar o cliente.";

        console.error(errorMessage);
      } finally {
        this.isBusy = false;
      }
    },
  },
};
</script>
<style lang=""></style>
