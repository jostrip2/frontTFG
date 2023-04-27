<template>
    <div class="list">
        <h2 id="whichUser" v-if="selectedUser != null">Videos assignats a {{ selectedUser.nomComplet }}</h2>
        <DataTable v-model:filters="filters" :value="getVideoInfo" dataKey="id" paginator :rows="10" removableSort
            :loading="loading" filterDisplay="menu" tableStyle="min-width: 50rem" :metaKeySelection=false
            selectionMode="single" v-model:selection="selectedAssign" :globalFilterFields="['nom', 'descripcio', 'dia']">
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
                    <CrearAssignacionsComp v-if="selectedUser != null" :selectedUser="selectedUser.id"
                        @assignedVideo="postAssign" />
                    <VeureVideoComp v-if="selectedAssign != null" :selectedVideo="selectedAssign" />
                    <EliminarAssignacionsComp v-if="selectedAssign != null" :selectedAssign="selectedAssign"
                        @deletedAssign="postAssign" />
                </div>
            </template>
            <template #empty> No hi ha videos assignats. </template>
            <template #loading> Carregant videos... </template>
            <PColumn field="nom" sortable header="Nom" style="width: 150px;"></PColumn>
            <PColumn field="descripcio" sortable header="Descripcio" style="width: 200px;"></PColumn>
            <PColumn field="areaExercici" header="Area" style="width: 100px;"></PColumn>
            <PColumn field="dia" header="Dia" style="width: 100px;"></PColumn>
            <PColumn field="realitzat" header="Realitzat" dataType="boolean" style="width: 200px;">
                <template #body="{ data }">
                    <v-icon v-if="data.realitzat" color="green"> mdi-check-circle-outline </v-icon>
                    <v-icon v-else color="red"> mdi-close-circle-outline </v-icon>
                </template>
                <template #filter="{ filterModel }">
                    <label for="realitzat-filter" class="font-bold"> Realitzat </label>
                    <TriStateCheckbox v-model="filterModel.value" inputId="realitzat-filter" />
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
import commonMethods from '@/commonMethods';
import CrearAssignacionsComp from './CrearAssignacionsComp.vue';
import VeureVideoComp from '../videosComp/VeureVideoComp.vue';
import EliminarAssignacionsComp from './EliminarAssignacionsComp.vue';

export default {
    name: "AssignacionsView",
    components: {
        CrearAssignacionsComp,
        VeureVideoComp,
        EliminarAssignacionsComp
    },
    emits: ['loggedUser'],
    data() {
        return {
            selectedUser: null,
            videos: [],
            selectedAssign: null,
            showSnack: false,
            message: '',
            loading: false,
            filters: {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                realitzat: { value: null, matchMode: FilterMatchMode.EQUALS }
            }
        };
    },

    methods: {
        getAssignedVideos() {
            if (this.selectedUser != null) {
                this.loading = true
                const url = process.env.VUE_APP_APIURL + "/assignacions/client/" + this.selectedUser.id;
                this.axios.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + commonMethods.sessionToken()
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
            }
        },

        getSelectedUser() {
            this.selectedUser = JSON.parse(sessionStorage.getItem('selectedUser'))
        },

        formatData(data) {
            return data.split('-').reverse().join('-')
        },

        postAssign(message) {
            this.showMessage(message)
            this.refresh()
        },

        refresh() {
            this.getAssignedVideos()
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
        }
    },

    mounted() {
        // si no esta autenticat o esta autenticat pero no es admin, no pot accedir a la pàgina
        if (!commonMethods.isAuthenticated() || (commonMethods.isAuthenticated() && !commonMethods.isAdmin())) {
            this.$router.push("/")
        }
        else {
            this.getSelectedUser();
            this.getAssignedVideos();
        }
    }
}
</script>

<style scoped>
#whichUser {
    display: flex;
    margin-left: auto;
    margin-right: 0;
    padding: 10px;

}

.search {
    display: flex;
    margin-left: 0;
    margin-right: auto;
    padding: 10px;
}

.list {
    margin: 30px 50px 0 50px;
    border: 1px solid rgb(221, 221, 221);
}

.actions {
    display: flex;
    margin-left: auto;
    margin-right: 0;
    padding: 10px;
}
</style>