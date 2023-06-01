<template>
    <div id="container">
        <h1 id="titol">Videos registrats</h1>
        <div class="list">
            <DataTable v-model:filters="filters" :value="videos" dataKey="id" paginator :rows="5" removableSort
                :loading="loading" tableStyle="min-width: 50rem" :metaKeySelection=false selectionMode="single"
                v-model:selection="selectedVideo" :globalFilterFields="['nom', 'descripcio']">
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
                        <CrearVideoComp v-if="esAdmin" @createdVideo='postActionVideo' />
                        <VeureVideoComp v-if="videoIsSelected" :selectedVideo="selectedVideo" />
                        <EditarVideoComp v-if="esAdmin && videoIsSelected" :selectedVideo="selectedVideo"
                            @editedVideo='postActionVideo' />
                        <EliminarVideoComp v-if="esAdmin && videoIsSelected" :selectedVideo="selectedVideo"
                            @deletedVideo='postActionVideo' />
                    </div>
                </template>
                <template #empty> No s'han trobat videos. </template>
                <template #loading> Carregant videos... </template>
                <PColumn field="nom" sortable header="Nom" style="width: 200px;"></PColumn>
                <PColumn field="descripcio" sortable header="Descripcio" style="width: 200px;"></PColumn>
                <PColumn field="areaExercici" header="Area" style="width: 200px;"></PColumn>
            </DataTable>
        </div>
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
import CrearVideoComp from './CrearVideoComp.vue';
import EditarVideoComp from './EditarVideoComp.vue';
import EliminarVideoComp from './EliminarVideoComp.vue';
import VeureVideoComp from './VeureVideoComp.vue';
import commonMethods from '@/commonMethods';

export default {
    name: "VideosView",
    components: {
        CrearVideoComp,
        EditarVideoComp,
        EliminarVideoComp,
        VeureVideoComp
    },
    emits: ['loggedUser'],
    data() {
        return {
            videos: [],
            selectedVideo: null,
            esAdmin: commonMethods.isAdmin(),
            showSnack: false,
            message: '',
            loading: false,
            filters: {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS }
            }
        };
    },

    methods: {
        getVideos() {
            this.loading = true
            const url = process.env.VUE_APP_APIURL + "/videos";
            this.axios.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + commonMethods.getSessionToken()
                }
            })
                .then(response => {
                    if (response.status == 200 && response.data) {
                        this.videos = response.data
                        this.loading = false
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.showMessage(error)
                })
        },

        postActionVideo(message) {
            this.showMessage(message)
            this.refresh()
        },

        refresh() {
            this.getVideos()
        },

        showMessage(message) {
            this.message = message
            this.showSnack = true
        },
    },

    computed: {
        videoIsSelected() {
            return this.selectedVideo != null
        }
    },

    mounted() {
        // si no esta autenticat o no es admin ni fisio, no pot accedir a la pàgina
        if (!commonMethods.isAuthenticated() || commonMethods.isClient()) {
            this.$router.push("/")
        }
        else {
            this.getVideos();
        }
    }
}
</script>

<style scoped>
#container {
    margin: 30px 50px 0 50px;
    min-height: 600px;
}

#titol {
    margin-left: 50px;
    text-align: start;
}

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
    margin: 10px 50px 0 50px;
    border: 1px solid rgb(221, 221, 221);
}

.actions {
    display: flex;
    margin-left: auto;
    margin-right: 0;
    padding: 10px;
}
</style>