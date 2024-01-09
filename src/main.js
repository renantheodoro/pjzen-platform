import { createApp } from "vue";
import App from "./App.vue";
import * as VueRouter from "vue-router";
import routes from "./routes";
import { verifyToken } from "@/services/common/interceptor-service";

// CSS Libs
import "./assets/styles/index.scss";

// Route definition
const router = new VueRouter.createRouter({
  linkActiveClass: "active",
  history: VueRouter.createWebHistory(),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  const requiresAuthGuard = to.matched.some((record) => record.meta.authGuard);

  if (requiresAuthGuard) {
    // Lógica de verificação de autenticação
    const isAuthenticated = await verifyToken();

    if (!isAuthenticated) {
      // Redirecione para a página de login
      return next({ name: "login" });
    }
  }

  // Continue a navegação normalmente
  next();
});

// App config
const app = createApp(App);

// App Usages
app.use(router);

// App mount
app.mount("#app");
