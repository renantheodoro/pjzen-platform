// AUTHENTICATION
import Login from "@/views/authentication/Login.vue";
import CreateAccountancy from "@/views/authentication/create/CreateAccountancy.vue";
import CreateAccountancyForm from "@/views/authentication/create/CreateAccountancyForm.vue";
import ValidateAccount from "@/views/authentication/create/ValidateAccount.vue";
import ValidateSuccess from "@/views/authentication/create/ValidateSuccess.vue";
import RecoveryPassword from "@/views/authentication/recovery-password/RecoveryPassword.vue";
import CreateNewPassword from "@/views/authentication/recovery-password/CreateNewPassword.vue";
import RecoveryPasswordSuccess from "@/views/authentication/recovery-password/RecoveryPasswordSuccess.vue";
import CreateProfileAccount from "@/views/authentication/profile/CreateProfileAccount.vue";
import ProfileAccountSuccess from "@/views/authentication/profile/ProfileAccountSuccess.vue";

// INTERNAL
import ClientList from "@/views/internal/ClientList.vue";
import ClientView from "@/views/internal/ClientView.vue";
import NFInvoice from "@/views/internal/NFInvoice.vue";
import CreateClientCompany from "@/views/internal/CreateClientCompany.vue";
import CompanyData from "@/views/internal/CompanyData.vue";
import DigitalCertificate from "@/views/internal/DigitalCertificate.vue";
import RegisterWrapper from "@/views/internal/RegisterWrapper.vue";
import Configuration from "@/views/internal/Configuration.vue";
import Profiles from "@/views/internal/Profiles.vue";
import NotFound from "@/views/internal/NotFound.vue";

export default [
  // AUTHENTICATION
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      authGuard: false,
    },
  },
  {
    path: "/cadastro",
    component: CreateAccountancy,
    meta: {
      authGuard: false,
    },

    children: [
      {
        path: "",
        component: CreateAccountancyForm,
        name: "create-accountancy-form",
        meta: {
          authGuard: false,
        },
      },
      {
        path: "validar-conta",
        component: ValidateAccount,
        name: "validate-account",
        meta: {
          authGuard: false,
        },
      },
      {
        path: "conta-validada",
        component: ValidateSuccess,
        name: "validate-success",
        meta: {
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
      authGuard: false,
    },
  },
  {
    path: "/cadastrar-nova-senha",
    name: "create-new-password",
    component: CreateNewPassword,
    meta: {
      authGuard: false,
    },
  },
  {
    path: "/senha-atualizada",
    name: "recovery-password-success",
    component: RecoveryPasswordSuccess,
    meta: {
      authGuard: false,
    },
  },
  {
    path: "/criar-conta-de-colaborador",
    name: "create-profile-account",
    component: CreateProfileAccount,
  },
  {
    path: "/perfil-criado",
    name: "profile-account-success",
    component: ProfileAccountSuccess,
    meta: {
      authGuard: false,
    },
  },

  // INTERNALS
  {
    path: "/",
    name: "initial",
    redirect: "/clientes",
  },
  {
    path: "/clientes",
    name: "clients",
    component: ClientList,
    meta: {
      authGuard: true,
    },
  },
  {
    path: "/cliente/:id?",
    name: "client",
    component: ClientView,
    meta: {
      authGuard: true,
    },
  },
  {
    path: "/cliente/:id/servico/",
    name: "service",
    component: RegisterWrapper,
    meta: {
      authGuard: true,
    },
  },
  {
    path: "/cliente/:id/tomador/",
    name: "taker",
    component: RegisterWrapper,
    meta: {
      authGuard: true,
    },
  },
  {
    path: "/cliente/:id/emitir-nota-fiscal/",
    name: "nf-invoice",
    component: NFInvoice,
    meta: {
      authGuard: true,
    },
  },
  {
    path: "/cliente/:id/consultar-nota-fiscal/:nfId",
    name: "nf-invoice-consult",
    component: NFInvoice,
    meta: {
      authGuard: true,
    },
  },
  {
    path: "/cliente/:id/duplicar-nota-fiscal/:nfId",
    name: "nf-invoice-duplicate",
    component: NFInvoice,
    meta: {
      authGuard: true,
    },
  },
  {
    path: "/dados-da-empresa/:id?",
    name: "company-data",
    component: CompanyData,
    meta: {
      authGuard: true,
    },
  },
  {
    path: "/cadastrar-empresa/",
    name: "create-company",
    component: CreateClientCompany,
    meta: {
      authGuard: true,
    },
  },
  {
    path: "/certificado-digital/:id",
    name: "digital-certificate",
    component: DigitalCertificate,
    meta: {
      authGuard: true,
    },
  },
  {
    path: "/configuracoes",
    name: "configuration",
    component: Configuration,
    meta: {
      authGuard: true,
      adminGuard: true,
    },
  },
  {
    path: "/configuracoes/perfis",
    name: "profiles",
    component: Profiles,
    meta: {
      authGuard: true,
      adminGuard: true,
    },
  },

  // 404
  { path: "/:pathMatch(.*)*", name: "not-found", component: NotFound },
];
