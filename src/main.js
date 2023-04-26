import { createApp } from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import App from "./components/App.vue";
import router from "./router";

// PrimeVue
import PrimeVue from 'primevue/config';
import "primevue/resources/themes/lara-light-indigo/theme.css";     //theme
import "primevue/resources/primevue.min.css";                       //core
import "primeicons/primeicons.css";                                 //icons

// PrimeVue components
import InputText from "primevue/inputtext";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Message from 'primevue/message';
import TriStateCheckbox from 'primevue/tristatecheckbox';

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

// Calendar
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

// Axios common header
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

// App
const app = createApp(App);

app.use(router)
app.use(VueAxios, axios)
app.use(vuetify)
app.use(PrimeVue)

// PrimeVue components
app.component("InputText", InputText)
app.component("DataTable", DataTable)
app.component("PColumn", Column)
app.component("PMessage", Message)
app.component("VueDatePicker", VueDatePicker)
app.component("TriStateCheckbox", TriStateCheckbox)

// Mount
app.mount("#app");
