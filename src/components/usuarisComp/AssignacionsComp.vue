<template>
    <div class="container">
        <v-tooltip text="Assignar video" location="top">
            <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="x-large" @click="showDialog(true)">
                    mdi-video-account
                </v-icon>
            </template>
        </v-tooltip>
        <v-dialog v-model="this.dialog" persistent width="1024">
            <v-card>
                <v-toolbar flat color="blue-darken-3">
                    <v-btn icon="mdi-video-account"></v-btn>

                    <v-toolbar-title class="font-weight-light">
                        <span class="text-h5">Afegir usuari</span>
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <div class="videoSelect">
                            <h4 class="titleDiv">Selecció de video</h4>
                            <PickList v-model="videos" dataKey="id">
                                <template #sourceheader> Disponibles </template>
                                <template #targetheader> Seleccionats </template>
                                <template #item="slotProps">
                                    <div class="flex flex-wrap p-2 align-items-center gap-3">
                                        <span class="font-bold">{{ slotProps.item.name }}</span>
                                    </div>
                                </template>
                            </PickList>
                        </div>
                        <div class="dateSelect">
                            <h4 class="titleDiv">Selecció de dies</h4>
                            <p>calendari</p>
                        </div>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="showDialog(false)">
                        Cancelar
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="assignarVideos">
                        Assignar
                    </v-btn>
                </v-card-actions>
            </v-card>
            {{ videos }}
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
export default {
    name: "AssignacionsComp",
    props: ['selectedUser'],
    emits: ['assignedVideo'],
    data() {
        return {
            videos: null,
            dialog: false,
            snack: false
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
                        this.videos = [response.data, []]
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.showMessage(error)
                })
        },

        assignarVideos() {
            console.log('Videos assignats')
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

.videoSelect {
    margin: 10px 0 10px 0;
    border: 1px solid rgb(221, 221, 221);
}

.dateSelect {
    margin: 10px 0 10px 0;
    border: 1px solid rgb(221, 221, 221);
}

.titleDiv {
    display: flex;
    padding: 10px 0 10px 0;
    margin-left: auto;
    margin-right: 0;
    padding-left: 10px;
}
</style>