import { createApp } from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import App from "./components/App.vue";
import router from "./router";
import store from "./store/store";

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/lib/iconsets/mdi'
import "@mdi/font/css/materialdesignicons.css"

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: { mdi }
    }
})

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

createApp(App).use(store)
    .use(router)
    .use(VueAxios, axios)
    .use(vuetify)
    .mount("#app");
