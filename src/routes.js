// AUTHENTICATION
import Login from "@/views/authentication/Login.vue";
import RegisterAccountancy from "@/views/authentication/register/RegisterAccountancy.vue";
import RegisterAccountancyForm from "@/views/authentication/register/RegisterAccountancyForm.vue";
import ValidateAccount from "@/views/authentication/register/ValidateAccount.vue";
import ValidateSuccess from "@/views/authentication/register/ValidateSuccess.vue";
import RecoveryPassword from "@/views/authentication/recover-password/RecoveryPassword.vue";
import RegisterNewPassword from "@/views/authentication/recover-password/RegisterNewPassword.vue";
import RecoveryPasswordSuccess from "@/views/authentication/recover-password/RecoveryPasswordSuccess.vue";

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
    component: RegisterAccountancy,
    meta: {
      pageName: "Cadastro",
      authGuard: false,
    },
    children: [
      {
        path: "/",
        component: RegisterAccountancyForm,
        name: "register-accountancy-form",
      },
      {
        path: "validar-conta",
        component: ValidateAccount,
        name: "validate-account",
      },
      {
        path: "conta-validada",
        component: ValidateSuccess,
        name: "validate-success",
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
    name: "register-new-password",
    component: RegisterNewPassword,
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
      authGuard: false,
    },
  },
  {
    path: "/lista-de-clientes",
    name: "client-list",
    component: ClientList,
    meta: {
      pageName: "Clientes",
      authGuard: false,
    },
  },
  {
    path: "/cliente",
    name: "client",
    component: ClientView,
    meta: {
      pageName: "Visão do cliente",
      authGuard: false,
    },
  },
  {
    path: "/emitir-nota-fiscal",
    name: "tax-invoice-issuance",
    component: TaxInvoiceIssuance,
    meta: {
      pageName: "Emitir Nota Fiscal",
      authGuard: false,
    },
  },
  {
    path: "/dados-da-empresa",
    name: "company-data",
    component: CompanyData,
    meta: {
      pageName: "Dados da Empresa",
      authGuard: false,
    },
  },
  {
    path: "/certificado-digital",
    name: "digital-certificate",
    component: DigitalCertificate,
    meta: {
      pageName: "Certificado Digital",
      authGuard: false,
    },
  },
  {
    path: "/cadastrar-servico",
    name: "register-service",
    component: RegisterService,
    meta: {
      pageName: "Cadastrar Serviço",
      authGuard: false,
    },
  },

  // 404
  { path: "/:pathMatch(.*)*", name: "not-found", component: NotFound },
];
