// import Dashboard from "@/views/Dashboard.vue";
import ClientList from "@/views/ClientList.vue";
import ClientView from "@/views/ClientView.vue";
import NotFound from "@/views/NotFound.vue";

export default [
  {
    path: "/",
    name: "dashboard",
    // TODO: quando houver uma dashboard, é só adicionar o componente aqui
    // component: Dashboard,
    component: ClientList,
  },
  {
    path: "/lista-de-clientes",
    name: "client-list",
    component: ClientList,
  },
  {
    path: "/cliente",
    name: "client",
    component: ClientView,
  },

  { path: "/:pathMatch(.*)*", name: "not-found", component: NotFound },
];
