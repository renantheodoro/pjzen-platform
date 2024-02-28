import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// CSS Libs
import "./assets/styles/index.scss";

// App config
const app = createApp(App);

// App Usages
app.use(router);

// App mount
app.mount("#app");
