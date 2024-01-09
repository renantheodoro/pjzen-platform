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
    this.extractRoutes();
  },
  methods: {
    extractRoutes() {
      this.routes = routes
        .filter((route) => route.meta)
        .flatMap((route) =>
          route.children ? this.mapChildren(route) : this.mapRoute(route)
        );
    },
    mapChildren(parentRoute) {
      return parentRoute.children.map((child) => ({
        to: { name: child.name },
        meta: child.meta,
      }));
    },
    mapRoute(route) {
      return {
        to: { name: route.name },
        meta: route.meta,
      };
    },
  },
};
</script>

<style lang=""></style>
