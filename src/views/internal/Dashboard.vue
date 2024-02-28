<template>
  <div class="view view--dashboard">
    <div class="container">
      <h2>Links temporários</h2>

      <nav class="nav-list">
        <h2>AUTENTICAÇÃO</h2>

        <router-link :to="{ name: 'login', query: { expiredSession: true } }">
          Logout
        </router-link>

        <router-link :to="{ name: 'login' }">Login</router-link>

        <router-link :to="{ name: 'create-accountancy-form' }"
          >Cadastro</router-link
        >

        <router-link :to="{ name: 'validate-account' }"
          >Validar conta</router-link
        >

        <router-link :to="{ name: 'validate-success' }"
          >Validar conta sucesso</router-link
        >

        <router-link :to="{ name: 'recovery-password' }"
          >Recuperar Senha</router-link
        >

        <router-link :to="{ name: 'create-new-password' }"
          >Cadastre uma nova senha</router-link
        >

        <router-link :to="{ name: 'recovery-password-success' }"
          >Senha atualizada com sucesso</router-link
        >

        <div class="divider"></div>

        <h2>INTERNAS</h2>

        <router-link :to="{ name: 'client-list' }"
          >Lista de clientes</router-link
        >

        <router-link :to="{ name: 'client' }">Cadastrar cliente</router-link>

        <router-link :to="{ name: 'tax-invoice-issuance' }"
          >Emitir Nota Fiscal</router-link
        >

        <router-link :to="{ name: 'company-data' }"
          >Dados da Empresa</router-link
        >

        <router-link
          :to="{
            name: 'digital-certificate',
            params: { id: '34213412342340' },
          }"
          >Certificado Digital</router-link
        >

        <router-link :to="{ name: 'create-service' }"
          >Cadastrar Serviço</router-link
        >
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
