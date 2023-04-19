<template>
    <div class="container">
        <v-tooltip text="Assignar video" location="top">
            <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="x-large" @click="showDialog(true)">
                    mdi-video-account
                </v-icon>
            </template>
        </v-tooltip>
        <v-dialog id="dialog" v-model="dialog" persistent scrollable>
            <v-card>
                <v-toolbar flat color="blue-darken-3">
                    <v-btn icon="mdi-video-account"></v-btn>

                    <v-toolbar-title class="font-weight-light">
                        <span class="text-h5">Assignar video</span>
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text id="cardContent">
                    <div id="videoSelect">
                        <h4 class="titleDiv">Selecció de video</h4>
                        <DataTable v-model:filters="filters" :value="videos" dataKey="id" paginator :rows="3"
                            :alwaysShowPaginator=false removableSort :metaKeySelection=false selectionMode="single"
                            v-model:selection="selectedVideo" :globalFilterFields="['nom', 'descripcio']">
                            <template #header>
                                <div class="search">
                                    <span class="p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" class="p-inputtext-sm"
                                            placeholder="Cercar videos" />
                                    </span>
                                </div>
                            </template>
                            <template #empty> No s'han trobat videos. </template>
                            <PColumn field="nom" sortable header="Nom" style="width: 200px;"></PColumn>
                            <PColumn field="descripcio" header="Descripcio" style="width: 200px;"></PColumn>
                            <PColumn field="areaExercici" sortable header="Area" style="width: 150px;"></PColumn>
                        </DataTable>
                    </div>
                    <div id="dateSelect">
                        <h4 class="titleDiv">Selecció de dies</h4>
                        <div id="checks">
                            <v-checkbox v-model="checkDies" label="Per dies" @change="controlChecks('checkDies')"
                                hideDetails></v-checkbox>
                            <v-checkbox v-model="checkSetmana" label="Per dies de la setmana"
                                @change="controlChecks('checkSetmana')" hideDetails></v-checkbox>
                        </div>
                        <div v-if="checkDies" class="dateSelect_checkX">
                            <div>
                                <VueDatePicker id="calendar" v-model="dies" multi-dates multi-dates-limit="6" auto-apply
                                    inline :enable-time-picker="false" />
                            </div>
                            <div>
                                <p id="selectedDate_checkDies">Dies seleccionats:</p>
                                <v-list lines="one" density="compact">
                                    <v-list-item v-for="dia in getDies" :key="dia" :title="dia"></v-list-item>
                                </v-list>
                            </div>
                        </div>
                        <div v-if="checkSetmana" class="dateSelect_checkX">
                            <p id="selectedDate_checkSetmana">Dies seleccionats: {{ diesSet }}</p>
                        </div>
                    </div>
                </v-card-text>
                <v-card-actions id="cardActions">
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="showDialog(false)">
                        Cancelar
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="assignarVideos">
                        Assignar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snack" :timeout=3000>
            Formulari no correcte
            <template v-slot:actions>
                <v-btn color="blue" variant="text" @click="closeDialog">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';

export default {
    name: "AssignacionsComp",
    props: ['selectedUser'],
    emits: ['assignedVideo'],
    data() {
        return {
            videos: null,
            selectedVideo: null,
            checkDies: false,
            checkSetmana: false,
            checkTots: false,
            dies: [],
            diesSet: [],
            dialog: false,
            snack: false,
            filters: {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS }
            },
        }
    },
    methods: {
        getVideos() {
            const url = process.env.VUE_APP_APIURL + "/videos";
            this.axios.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + this.getToken
                }
            })
                .then(response => {
                    if (response.status == 200 && response.data) {
                        this.videos = response.data
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.showMessage(error)
                })
        },

        checkSelection() {
            return this.selectedVideo != null && (this.dies.length > 0 || this.diesSet.length > 0)
        },

        assignarVideos() {
            if (this.checkSelection()) {
                console.log('Video assignat')
            }
            else {
                console.log('Video no assignat')
            }
        },

        controlChecks(selectedCheck) {
            switch (selectedCheck) {
                case 'checkDies':
                    this.checkSetmana = false;
                    if (!this.checkDies) this.dies = [];
                    else this.diesSet = [];
                    break
                case 'checkSetmana':
                    this.checkDies = false;
                    if (!this.checkSetmana) this.diesSet = [];
                    else this.dies = [];
                    break
            }
        },

        formatDate(date) {
            return date.map(date => {
                let newDate = new Date(date)
                let day = newDate.getDate()
                let month = newDate.getMonth() + 1
                let year = newDate.getFullYear()
                return day + '/' + month + '/' + year
            })
        },

        closeDialog() {
            this.showDialog(false)
            this.clearFields()
        },

        clearFields() {
            this.videos = null
        },

        showDialog(bool) {
            this.dialog = bool
        },

        showSnack(bool) {
            this.snack = bool
        }
    },

    computed: {
        propUser() {
            return this.selectedUser
        },

        getDies() {
            if (this.dies != null) {
                const dies = Object.assign([], this.dies)
                return this.formatDate(dies.sort((a, b) => Date.parse(a) - Date.parse(b)))
            }
            else return null
        },

        getToken() {
            return this.$store.state.token
        }
    },

    mounted() {
        this.getVideos();
    }
}
</script>

<style scoped>
.container {
    padding: 5px;
}

#dialog {
    width: 80%;
    height: 100%;
}

#cardContent {
    display: flex;
    align-items: stretch;
}

#videoSelect {
    margin: 10px 5px 10px 0;
    border: 1px solid rgb(221, 221, 221);
    width: 652px;
}

#dateSelect {
    margin: 10px 0 10px 5px;
    border: 1px solid rgb(221, 221, 221);
    width: 648px;
}

.titleDiv {
    padding: 10px 0 10px 0;
    margin-left: auto;
    margin-right: 0;
    padding-left: 10px;
}

#checks {
    display: flex;
    border: 1px solid rgb(221, 221, 221);
}

.dateSelect_checkX {
    display: flex;
    justify-content: flex-start;
    margin: 10px;
}

#calendar {
    margin-right: 10px;
}

#cardActions {
    margin: 10px;
}
</style>