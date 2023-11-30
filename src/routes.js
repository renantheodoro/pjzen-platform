import Dashboard from "@/views/Dashboard.vue";
import ClientList from "@/views/ClientList.vue";
import ClientView from "@/components/ClientView.vue";
import TaxInvoiceIssuance from "@/views/TaxInvoiceIssuance.vue";
import CompanyData from "@/views/CompanyData.vue";
import NotFound from "@/views/NotFound.vue";

export default [
  {
    path: "/",
    name: "dashboard",
    component: Dashboard,
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
  {
    path: "/emitir-nota-fiscal",
    name: "tax-invoice-issuance",
    component: TaxInvoiceIssuance,
  },
  {
    path: "/dados-da-empresa",
    name: "company-data",
    component: CompanyData,
  },

  { path: "/:pathMatch(.*)*", name: "not-found", component: NotFound },
];
