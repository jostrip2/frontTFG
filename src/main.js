import { createApp } from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import App from "./components/App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import "./assets/style.scss";

createApp(App).use(store)
    .use(router)
    .use(VueAxios, axios)
    .mount("#app");
