<template>
  <div class="view view--dashboard">
    <div class="container">
      <h2>Links temporários</h2>
      <nav class="nav-list">
        <router-link v-for="route in routes" :to="route.to" :key="route.name">
          {{ route.meta.pageName }}
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script>
import routes from "@/routes";

export default {
  name: "app-dashboard",
  data() {
    return {
      routes: [],
    };
  },
  created() {
    this.routes = routes.filter((route) => route.meta);
    this.routes = this.routes.map((route) => {
      return {
        to: { name: route.name },
        meta: route.meta,
      };
    });
  },
};
</script>

<style lang=""></style>
