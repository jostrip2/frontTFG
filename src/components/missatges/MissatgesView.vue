<template>
    <div id="container">
        <div id="titol">
            <h1 v-if="isAdmin">Missatges rebuts</h1>
            <h1 v-else>Missatges enviats</h1>
        </div>
        <DataTable v-model:filters="filters" v-model:expandedRows="cosMissatge" :value="missatges" dataKey="id" paginator
            :rows="10" sortField="data" :sortOrder="1" removableSort :loading="loading" tableStyle="min-width: 50rem"
            :metaKeySelection=false selectionMode="single" v-model:selection="selectedMessage" @rowExpand="onRowExpand"
            :globalFilterFields="['data']">
            <template #header>
                <div id="actions">
                    <CrearMissatgeComp @createdUser='postMessage' />
                </div>
            </template>
            <template #empty> No s'han trobat missatges. </template>
            <template #loading> Carregant missatges... </template>
            <PColumn expander style="width: 1rem" />
            <PColumn field="titol" header="Titol" style="width: 200px;"></PColumn>
            <PColumn field="data" sortable header="Dia" style="width: 200px;"></PColumn>
            <PColumn v-if="isAdmin" field="emissor" header="Emissor" style="width: 200px;"></PColumn>
            <PColumn v-else field="receptor.nomComplet" header="Enviat a" style="width: 200px;"></PColumn>
            <PColumn field="llegit" header="Llegit" dataType="boolean" style="width: 200px;">
                <template #body="{ data }">
                    <v-icon v-if="data.llegit" color="green"> mdi-check-circle-outline </v-icon>
                    <v-icon v-else color="red"> mdi-close-circle-outline </v-icon>
                </template>
                <template #filter="{ filterModel }">
                    <label for="realitzat-filter" class="font-bold"> Realitzat </label>
                    <TriStateCheckbox v-model="filterModel.value" inputId="realitzat-filter" />
                </template>
            </PColumn>
            <template #expansion="slotProps">
                <div class="p-3">
                    <h5>Missatge</h5>
                    <p>{{ slotProps.data.missatge }}</p>
                </div>
            </template>
        </DataTable>
    </div>


    <v-snackbar v-model="showSnack">
        {{ message }}

        <template v-slot:actions>
            <v-btn color="blue" variant="text" @click="showSnack = false">
                Tancar
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';
import commonMethods from '@/commonMethods';

import CrearMissatgeComp from './CrearMissatgeComp.vue'

export default {
    name: "MissatgesView",
    components: {
        CrearMissatgeComp,
    },
    emits: ['loggedUser'],
    data() {
        return {
            missatges: [],
            isAdmin: commonMethods.isAdmin(),
            cosMissatge: [],
            selectedMessage: null,
            message: '',
            showSnack: false,
            loading: false,
            filters: {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS }
            }
        };
    },
    methods: {
        getMessagesReceptor() {
            const url = process.env.VUE_APP_APIURL + "/missatges/receptor/" + commonMethods.getLoggedUserId();
            this.axios.get(url, {
                headers: {
                    "Authorization": "Bearer " + commonMethods.getSessionToken()
                }
            }).then(response => {
                if (response.data) {
                    this.missatges = this.formatMessageDate(response.data);
                }
            }).catch(error => {
                console.log(error);
                if (error.response.status != 404) {
                    this.showMessage(error);
                }
            });
        },

        getMessagesEmissor() {
            const url = process.env.VUE_APP_APIURL + "/missatges/emissor/" + commonMethods.getLoggedUserId();
            this.axios.get(url, {
                headers: {
                    "Authorization": "Bearer " + commonMethods.getSessionToken()
                }
            }).then(response => {
                if (response.data) {
                    this.missatges = this.formatMessageDate(response.data);
                }
            }).catch(error => {
                console.log(error);
                if (error.response.status != 404) {
                    this.showMessage(error);
                }
            });
        },

        getMessages() {
            if (this.isAdmin) {
                this.getMessagesReceptor();
            }
            else {
                this.getMessagesEmissor();
            }
        },

        formatMessageDate(messages) {
            return messages.map(message => {
                message.data = this.formatData(message.data)
                return message
            })
        },

        formatData(data) {
            return data.split('-').reverse().join('-')
        },

        postMessage(message) {
            this.showMessage(message)
            this.getMessages()
        },

        onRowExpand(event) {
            if (!event.data.llegit) {
                const url = process.env.VUE_APP_APIURL + "/missatges"
                this.axios.patch(url, { id: event.data.id, llegit: true }, {
                    headers: {
                        "Authorization": "Bearer " + commonMethods.getSessionToken()
                    }
                }).then(this.actualitzarLlegit(event.data.id))
                    .catch(error => {
                        console.log(error);
                        if (error.response.status != 404) {
                            this.showMessage(error);
                        }
                    });
            }
        },

        actualitzarLlegit(id) {
            this.missatges.map(m => {
                if (m.id == id) {
                    m.llegit = true;
                }
            })
        },

        showMessage(message) {
            this.message = message
            this.showSnack = true
        }
    },

    computed: {
        estatLlegit() {
            return "Estat: " + this.checkLlegit == null ? 'tots' : this.checkLlegit ? 'llegits' : 'no llegits'
        }
    },

    mounted() {
        if (!commonMethods.isAuthenticated()) {
            this.$router.push("/");
        }
        else {
            this.getMessages();
        }
    }
}
</script>

<style scoped>
#titol {
    margin-bottom: 20px;
}

#container {
    margin: 30px 50px 0 50px;
    min-height: 600px;
}

#actions {
    display: flex;
    margin-left: auto;
    margin-right: 0;
}
</style>