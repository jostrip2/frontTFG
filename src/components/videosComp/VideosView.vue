<template>
    <div class="list">
        <DataTable v-model:filters="filters" :value="videos" dataKey="id" paginator :rows="10" :alwaysShowPaginator=false
            removableSort tableStyle="min-width: 50rem" :metaKeySelection=false selectionMode="single"
            v-model:selection="selectedVideo" :globalFilterFields="['nom', 'descripcio']">
            <template #header>
                <div class="listHeader">
                    <div class="search">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Cercar videos" />
                        </span>
                    </div>
                    <div class="actions">
                        <p>WIP</p>
                    </div>
                </div>
            </template>
            <template #empty> No s'han trobat usuaris. </template>
            <PColumn field="nom" sortable header="Nom" style="width: 200px;"></PColumn>
            <PColumn field="descripcio" sortable header="Descripcio" style="width: 200px;"></PColumn>
            <PColumn field="area" header="Area" style="width: 200px;"></PColumn>
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
    <p>{{ this.videos }}</p>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';

export default {
    name: "VideosView",
    data() {
        return {
            allVideos: [],
            videos: [],
            selectedVideo: null,
            showSnack: false,
            message: '',
            filters: {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS }
            }
        };
    },
    computed: {

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
                        this.allVideos = response.data
                        this.videos = this.allVideos
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.showMessage(error)
                })
        },

        searchVideos() {
            var searchedVideos = [];
            this.allVideos.forEach(user => {
                if (user.username.indexOf(this.usernameSearch.toLowerCase()) >= 0) {
                    searchedVideos.push(user)
                }
            });
            this.videos = searchedVideos;

            if (searchedVideos.indexOf(this.selectedVideo) < 0) {
                this.selectedVideo = null
            }
        },

        refresh() {
            this.getVideos()
            this.searchVideos()
        },

        getToken() {
            return this.$store.state.token
        },

        showMessage(message) {
            this.message = message
            this.showSnack = true
        },
    },

    mounted() {
        this.getVideos();
    }
}
</script>

<style scoped>
.listHeader {
    display: flex;
    flex-direction: row;
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