import * as VueRouter from "vue-router";
import routes from "@/routes";
import { verifyToken } from "@/services/common/interceptor-service";
import {
  setTokenToSessionStorage,
  getTokenFromSessionStorage,
} from "@/helpers/session-storage";
import {
  setAccountancyDataToLocalStorage,
  setProfileDataToLocalStorage,
  setUserSessionStorage,
  getUserSessionStorage,
  getAccountancyDataFromLocalStorage,
} from "@/helpers/local-storage";
import { USER_SESSION_PROFILE_TYPE } from "@/data/const/user-session-type";

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
  setAccountancyDataToLocalStorage("");
  setUserSessionStorage("");
  setProfileDataToLocalStorage("");
  router.push({ name: "login", query: { expiredSession: true } });
};

const isStorageLoaded = () => {
  const storageToken = getTokenFromSessionStorage();
  const storageAccountancyData = getAccountancyDataFromLocalStorage();
  const storageUserSession = getUserSessionStorage();

  if (
    !storageToken ||
    storageToken === "" ||
    !storageAccountancyData ||
    storageAccountancyData === "" ||
    !storageUserSession ||
    storageUserSession === ""
  ) {
    return false;
  }

  return true;
};

router.beforeEach(async (to, from, next) => {
  const requiresAuthGuard = to.matched.some((record) => record.meta.authGuard);
  const requiresAdminGuard = to.matched.some(
    (record) => record.meta.adminGuard
  );

  if (requiresAuthGuard) {
    const isAuthenticated = await verifyToken();

    if (!isAuthenticated || !isStorageLoaded()) {
      return logout();
    }
  }

  if (requiresAdminGuard) {
    const sessionType = getUserSessionStorage()?.sessionType;

    if (sessionType === USER_SESSION_PROFILE_TYPE) {
      router.go(-1);
    }
  }

  // Continue a navegação normalmente
  next();
});

export default router;
