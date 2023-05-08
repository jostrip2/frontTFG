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
                        <DataTable :value="videos" dataKey="id" paginator :rows="3" :alwaysShowPaginator=false removableSort
                            :metaKeySelection=false selectionMode="single" scrollable scrollHeight="800px"
                            v-model:selection="selectedVideo" :class="'p-datatable-sm'" v-model:filters="filters"
                            :globalFilterFields="['nom', 'areaExercici']">
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
                            <PColumn field="areaExercici" sortable header="Area" style="width: 100px;"></PColumn>
                        </DataTable>
                    </div>
                    <div id="dateSelect">
                        <h4 class="titleDiv">Selecció de dies</h4>
                        <div class="dateSelect_calendar">
                            <VueDatePicker v-model="selectedDates" multi-dates auto-apply inline
                                :enable-time-picker="false" />
                        </div>
                    </div>
                </v-card-text>
                <v-card-actions id="cardActions">
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="closeDialog">
                        Cancelar
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="assignarVideos">
                        Assignar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snack" :timeout=3000>
            {{ messageSnack }}
            <template v-slot:actions>
                <v-btn color="blue" variant="text" @click="showSnack(false)">
                    Tancar
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';
import commonMethods from '@/commonMethods';

export default {
    name: "AssignacionsComp",
    props: ['selectedUser'],
    emits: ['assignedVideo'],
    data() {
        return {
            videos: null,
            selectedVideo: null,
            selectedDates: [],
            dialog: false,
            snack: false,
            messageSnack: '',
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
                    'Authorization': 'Bearer ' + commonMethods.getSessionToken()
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
            return this.selectedVideo != null && this.selectedDates.length > 0
        },

        assignarVideos() {
            if (this.checkSelection()) {
                const url = process.env.VUE_APP_APIURL + "/assignacions";
                const assignacio = {
                    selectedDates: this.getDies,
                    UsuariId: this.propUser,
                    VideoId: this.selectedVideo.id
                }
                this.axios.post(url, assignacio, {
                    headers: {
                        'Authorization': 'Bearer ' + commonMethods.getSessionToken()
                    }
                })
                    .then(response => {
                        if (response.status == 201) {
                            const message = 'Videos assignats correctament'
                            this.$emit('assignedVideo', message)
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        const message = "S'ha produit un error a l'assignar els videos"
                        this.$emit('assignedVideo', message)
                    })
                this.closeDialog()
            }
            else {
                this.showMessage(this.getMessageSnack())
            }
        },

        formatDate(date) {
            return date.map(date => {
                let newDate = new Date(date)
                let day = newDate.getDate().toString().padStart(2, "0")
                let month = (newDate.getMonth() + 1).toString().padStart(2, "0")
                let year = newDate.getFullYear()
                return year + '-' + month + '-' + day
            })
        },

        getMessageSnack() {
            if (this.selectedVideo == null && this.selectedDates.length == 0)
                return 'No hi ha video ni data seleccionats'

            if (this.selectedVideo == null)
                return 'No hi ha video seleccionat'

            if (this.selectedDates.length == 0)
                return 'No hi ha data seleccionada'

        },

        closeDialog() {
            this.clearFields()
            this.showDialog(false)
        },

        clearFields() {
            this.selectedDates = []
            this.selectedVideo = null
        },

        showMessage(message) {
            this.messageSnack = message
            this.snack = true
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
            if (this.selectedDates.length > 0) {
                const dies = Object.assign([], this.selectedDates)
                return this.formatDate(dies.sort((a, b) => Date.parse(a) - Date.parse(b)))
            }
            else return null
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
    width: 800px;
    height: 100%;
}

#cardContent {
    display: flex;
    align-items: stretch;
}

#videoSelect {
    margin: 10px 5px 10px 0;
    border: 1px solid rgb(221, 221, 221);
    width: 400px;
}

#dateSelect {
    margin: 10px 0 10px 5px;
    border: 1px solid rgb(221, 221, 221);
    width: 300px;
}

.titleDiv {
    padding: 10px 0 10px 0;
    margin-left: auto;
    margin-right: 0;
    padding-left: 10px;
}

.dateSelect_calendar {
    display: flex;
    justify-content: center;
    margin: 10px;
}

#cardActions {
    margin: 10px;
}
</style>