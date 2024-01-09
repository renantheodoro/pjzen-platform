// AUTHENTICATION
import Login from "@/views/authentication/Login.vue";
import CreateAccountancy from "@/views/authentication/create/CreateAccountancy.vue";
import CreateAccountancyForm from "@/views/authentication/create/CreateAccountancyForm.vue";
import ValidateAccount from "@/views/authentication/create/ValidateAccount.vue";
import ValidateSuccess from "@/views/authentication/create/ValidateSuccess.vue";
import RecoveryPassword from "@/views/authentication/recovery-password/RecoveryPassword.vue";
import CreateNewPassword from "@/views/authentication/recovery-password/CreateNewPassword.vue";
import RecoveryPasswordSuccess from "@/views/authentication/recovery-password/RecoveryPasswordSuccess.vue";

// INTERNAL
import Dashboard from "@/views/internal/Dashboard.vue";
import ClientList from "@/views/internal/ClientList.vue";
import ClientView from "@/components/ClientView.vue";
import TaxInvoiceIssuance from "@/views/internal/TaxInvoiceIssuance.vue";
import CompanyData from "@/views/internal/CompanyData.vue";
import DigitalCertificate from "@/views/internal/DigitalCertificate.vue";
import RegisterService from "@/views/internal/RegisterService.vue";
import NotFound from "@/views/internal/NotFound.vue";

export default [
  // AUTHENTICATION
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      pageName: "Login",
      authGuard: false,
    },
  },
  {
    path: "/cadastro",
    component: CreateAccountancy,
    meta: {
      pageName: "Cadastro",
      authGuard: false,
    },

    children: [
      {
        path: "",
        component: CreateAccountancyForm,
        name: "create-accountancy-form",
        meta: {
          pageName: "Cadastro",
          authGuard: false,
        },
      },
      {
        path: "validar-conta",
        component: ValidateAccount,
        name: "validate-account",
        meta: {
          pageName: "Validar conta",
          authGuard: false,
        },
      },
      {
        path: "conta-validada",
        component: ValidateSuccess,
        name: "validate-success",
        meta: {
          pageName: "Validar conta sucesso",
          authGuard: false,
        },
      },
    ],
  },
  {
    path: "/recuperar-senha",
    name: "recovery-password",
    component: RecoveryPassword,
    meta: {
      pageName: "Recuperar Senha",
      authGuard: false,
    },
  },
  {
    path: "/cadastrar-nova-senha",
    name: "create-new-password",
    component: CreateNewPassword,
    meta: {
      pageName: "Cadastre uma nova senha",
      authGuard: false,
    },
  },
  {
    path: "/senha-atualizada",
    name: "recovery-password-success",
    component: RecoveryPasswordSuccess,
    meta: {
      pageName: "Senha atualizada com sucesso",
      authGuard: false,
    },
  },

  // INTERNALS
  {
    path: "/",
    name: "dashboard",
    component: Dashboard,
    meta: {
      pageName: "Dashboard",
      authGuard: true,
    },
  },
  {
    path: "/lista-de-clientes",
    name: "client-list",
    component: ClientList,
    meta: {
      pageName: "Clientes",
      authGuard: true,
    },
  },
  {
    path: "/cliente",
    name: "client",
    component: ClientView,
    meta: {
      pageName: "Visão do cliente",
      authGuard: true,
    },
  },
  {
    path: "/emitir-nota-fiscal",
    name: "tax-invoice-issuance",
    component: TaxInvoiceIssuance,
    meta: {
      pageName: "Emitir Nota Fiscal",
      authGuard: true,
    },
  },
  {
    path: "/dados-da-empresa",
    name: "company-data",
    component: CompanyData,
    meta: {
      pageName: "Dados da Empresa",
      authGuard: true,
    },
  },
  {
    path: "/certificado-digital",
    name: "digital-certificate",
    component: DigitalCertificate,
    meta: {
      pageName: "Certificado Digital",
      authGuard: true,
    },
  },
  {
    path: "/cadastrar-servico",
    name: "create-service",
    component: RegisterService,
    meta: {
      pageName: "Cadastrar Serviço",
      authGuard: true,
    },
  },

  // 404
  { path: "/:pathMatch(.*)*", name: "not-found", component: NotFound },
];
