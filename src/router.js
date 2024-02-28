import * as VueRouter from "vue-router";
import routes from "@/routes";
import { verifyToken } from "@/services/common/interceptor-service";
import { setTokenToSessionStorage } from "@/helpers/session-storage";

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

const logout = () => {
  setTokenToSessionStorage("");
  router.push({ name: "login", query: { expiredSession: true } });
};

router.beforeEach(async (to, from, next) => {
  const requiresAuthGuard = to.matched.some((record) => record.meta.authGuard);

  if (requiresAuthGuard) {
    const isAuthenticated = await verifyToken();

    if (!isAuthenticated) {
      return logout();
    }
  }

  // Continue a navegação normalmente
  next();
});

export default router;
