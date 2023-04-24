<template>
    <div class="list">
        <DataTable v-model:filters="filters" :value="getVideoInfo" dataKey="id" paginator :rows="10" removableSort
            tableStyle="min-width: 50rem" :metaKeySelection=false selectionMode="single" v-model:selection="selectedVideo"
            :globalFilterFields="['nom', 'descripcio']">
            <template #header>
                <div class="search">
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Cercar videos" />
                    </span>
                </div>
            </template>
            <template #paginatorstart>
                <div class="actions">
                    <CrearAssignacionsComp v-if="selectedUser != null" :selectedUser="selectedUser"
                        @assignedVideo="postActionVideo" />
                    <VeureVideoComp v-if="selectedVideo != null" :selectedVideo="selectedVideo.codi" />
                </div>
            </template>
            <template #empty> No s'han trobat videos. </template>
            <template #loading> Carregant videos... </template>
            <PColumn field="nom" sortable header="Nom" style="width: 150px;"></PColumn>
            <PColumn field="descripcio" sortable header="Descripcio" style="width: 200px;"></PColumn>
            <PColumn field="areaExercici" header="Area" style="width: 100px;"></PColumn>
            <PColumn field="dia" header="Data" style="width: 100px;"></PColumn>
            <PColumn field="realitzat" header="Realitzat" dataType="boolean" style="width: 200px;">
                <template #body="{ data }">
                    <v-icon v-if="data.realitzat" color="green"> mdi-check-circle-outline </v-icon>
                    <v-icon v-else color="red"> mdi-close-circle-outline </v-icon>
                </template>
            </PColumn>
        </DataTable>
    </div>
    <v-snackbar v-model="showSnack">
        {{ message }}

        <template v-slot:actions>
            <v-btn color="blue" variant="text" @click="showSnack = false">
                Close
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';

import CrearAssignacionsComp from './CrearAssignacionsComp.vue';
import VeureVideoComp from '../videosComp/VeureVideoComp.vue';

export default {
    name: "AssignacionsView",
    components: {
        CrearAssignacionsComp,
        VeureVideoComp
    },
    data() {
        return {
            selectedUser: null,
            videos: [],
            selectedVideo: null,
            showSnack: false,
            message: '',
            filters: {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                realitzat: { value: null, matchMode: FilterMatchMode.EQUALS }
            }
        };
    },

    methods: {
        getAssignedVideos() {
            const url = process.env.VUE_APP_APIURL + "/assignacions/" + this.selectedUser;
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

        formatData(data) {
            return data.split('-').reverse().join('-')
        },

        postActionVideo(message) {
            this.showMessage(message)
            this.refresh()
        },

        refresh() {
            this.getAssignedVideos()
        },

        getSelectedUser() {
            this.selectedUser = this.$store.getters.getSelectedUser
        },

        showMessage(message) {
            this.message = message
            this.showSnack = true
        },
    },

    computed: {
        getVideoInfo() {
            return this.videos.map((video) => {
                const data = this.formatData(video.dia);
                return {
                    "id": video.id,
                    "dia": data,
                    "realitzat": video.realitzat,
                    "nom": video.Video.nom,
                    "codi": video.Video.codi,
                    "descripcio": video.Video.descripcio,
                    "areaExercici": video.Video.areaExercici
                }
            })
        },

        getToken() {
            return this.$store.state.token
        },
    },

    mounted() {
        this.getSelectedUser();
        this.getAssignedVideos();
    }
}
</script>

<style scoped>
.search {
    display: flex;
    margin-left: 0;
    margin-right: auto;
    padding: 10px;
}

.checks {
    display: flex;
}

.list {
    margin: 50px 50px 0 50px;
    border: 1px solid rgb(221, 221, 221);
}

.actions {
    display: flex;
    margin-left: auto;
    margin-right: 0;
    padding: 10px;
}
</style>