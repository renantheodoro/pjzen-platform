<template>
  <div class="view view--register-service">
    <Internal v-if="clientId" :clientId="clientId">
      <div class="card no-pad">
        <ul class="tabs">
          <li :class="{ active: $route.name === 'service' }">
            <router-link
              :to="{ name: 'service', params: { id: this.clientId } }"
            >
              <img src="@/assets/images/icons/list.svg" class="tabs__icon" />
              <img
                src="@/assets/images/icons/list-active.svg"
                class="tabs__icon tabs__icon--active"
              />
              Lista de serviços
            </router-link>
          </li>

          <li :class="{ active: $route.name === 'taker' }">
            <router-link :to="{ name: 'taker', params: { id: this.clientId } }">
              <img
                src="@/assets/images/icons/user-plus.svg"
                class="tabs__icon"
              />
              <img
                src="@/assets/images/icons/user-plus-active.svg"
                class="tabs__icon tabs__icon--active"
              />
              Lista de tomadores de serviço</router-link
            >
          </li>
        </ul>

        <div class="tab-section">
          <div v-if="$route.name === 'service'" class="tab-section">
            <RegisterService />
          </div>

          <div v-if="$route.name === 'taker'" class="tab-section">
            <RegisterTaker />
          </div>
        </div>
      </div>
    </Internal>
  </div>
</template>
<script>
/**
 * Components
 * */
import Internal from "@/components/Internal.vue";
import RegisterService from "@/views/internal/RegisterService.vue";
import RegisterTaker from "@/views/internal/RegisterTaker.vue";

export default {
  name: "app-register-wrapper",

  components: {
    Internal,
    RegisterService,
    RegisterTaker,
  },

  data() {
    return {
      tabSection: 1,
      clientId: null,
    };
  },

  mounted() {
    if (!this.$route.params.id) {
      this.$router.go(-1);
      return;
    }

    this.clientId = this.$route.params.id;
  },
};
</script>
