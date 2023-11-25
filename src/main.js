import { createApp } from 'vue'
import App from './App.vue'
import * as VueRouter from "vue-router";
import routes from "./routes";

// CSS import
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

// App config
const app = createApp(App);

// App Usages
app.use(router);

// App mount
app.mount("#app");