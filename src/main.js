import { createApp } from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import App from "./components/App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
})

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_LOCAL_API_URL;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

axios.interceptors.response.use(undefined, function (error) {
    if (error) {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            store.dispatch("LogOut");
            return router.push("/");
        }
    }
});



createApp(App).use(store)
    .use(router)
    .use(VueAxios, axios)
    .use(vuetify)
    .mount("#app");
