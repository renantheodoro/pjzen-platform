import Dashboard from "@/views/Dashboard.vue";
import ClientList from "@/views/ClientList.vue";
import ClientView from "@/components/ClientView.vue";
import TaxInvoiceIssuance from "@/views/TaxInvoiceIssuance.vue";
import CompanyData from "@/views/CompanyData.vue";
import DigitalCertificate from "@/views/DigitalCertificate.vue";
import RegisterService from "@/views/RegisterService.vue";
import NotFound from "@/views/NotFound.vue";

export default [
  {
    path: "/",
    name: "dashboard",
    component: Dashboard,
    meta: {
      pageName: 'Dashboard'
    }
  },
  {
    path: "/lista-de-clientes",
    name: "client-list",
    component: ClientList,
    meta: {
      pageName: 'Clientes'
    }
  },
  {
    path: "/cliente",
    name: "client",
    component: ClientView,
    meta: {
      pageName: 'Visão do cliente'
    }
  },
  {
    path: "/emitir-nota-fiscal",
    name: "tax-invoice-issuance",
    component: TaxInvoiceIssuance,
    meta: {
      pageName: 'Emitir Nota Fiscal'
    }
  },
  {
    path: "/dados-da-empresa",
    name: "company-data",
    component: CompanyData,
    meta: {
      pageName: 'Dados da Empresa'
    }
  },
  {
    path: "/certificado-digital",
    name: "digital-certificate",
    component: DigitalCertificate,
    meta: {
      pageName: 'Certificado Digital'
    }
  },
  {
    path: "/cadastrar-servico",
    name: "register-service",
    component: RegisterService,
    meta: {
      pageName: 'Cadastrar Serviço'
    }
  },

  { path: "/:pathMatch(.*)*", name: "not-found", component: NotFound },
];
