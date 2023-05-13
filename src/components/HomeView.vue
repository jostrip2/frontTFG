<template>
    <div id="container">
        <h1>Els teus exercicis</h1>
        <CalendarView class="theme-default" :items="items" :show-date="showDate" :startingDayOfWeek="1"
            @click-item="seeVideo">
            <template #header="{ headerProps }">
                <CalendarViewHeader :header-props="headerProps" @input="setShowDate" />
            </template>
        </CalendarView>
    </div>
    <div>
        <v-dialog v-model="showVideo" persistent width="unset">
            <v-card>
                <v-toolbar flat color="blue-darken-3">
                    <v-btn icon="mdi-eye"></v-btn>

                    <v-toolbar-title class="font-weight-light">
                        <span class="text-h5">Veure video</span>
                    </v-toolbar-title>
                </v-toolbar>
                <iframe :src="linkVideo" width="640" height="480" allow="autoplay"></iframe>
                <div id="videoDescription">
                    <h3>{{ selectedVideo.nom }}</h3>
                    <p> {{ selectedVideo.descripcio }}</p>
                    <v-switch v-model="selectedAssign.realitzat" :label="`Video realitzat: ${textRealitzacio}`"
                        @change="marcarRealitzacio" hide-details inset></v-switch>
                </div>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="showVideo = false">
                        Tancar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
import commonMethods from '@/commonMethods';

export default {
    name: "HomeView",
    components: {
    },
    emits: ['loggedUser'],
    data() {
        return {
            loggedUserId: "",
            videos: [],
            selectedVideo: null,
            selectedAssign: null,
            showVideo: false,
            showDate: new Date(),
            items: [],
            showSnack: false,
            message: ''
        };
    },
    methods: {
        setShowDate(d) {
            this.showDate = d;
        },
        getAssignedVideos() {
            if (this.loggedUserId != "") {
                const url = process.env.VUE_APP_APIURL + "/assignacions/client/" + this.loggedUserId;
                this.axios.get(url, {
                    headers: {
                        "Authorization": "Bearer " + commonMethods.getSessionToken()
                    }
                })
                    .then(response => {
                        if (response.status == 200 && response.data) {
                            this.setItems(response.data);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        this.showMessage(error);
                    });
            }
        },

        setItems(assigns) {
            this.assigns = assigns;
            this.items = assigns.map((a) => (
                {
                    "id": a.id,
                    "startDate": a.dia,
                    "title": a.Video.nom,
                    "style": a.realitzat ? "background-color: rgb(0,255,0,.5);" : "background-color: rgb(255,0,0,.5);"
                }
            ));
        },

        seeVideo(calendarItem) {
            this.selectedAssign = this.assigns.find(a => a.id == calendarItem.id);
            this.selectedVideo = this.selectedAssign.Video;
            this.showVideo = true;
        },

        marcarRealitzacio() {
            const url = process.env.VUE_APP_APIURL + "/assignacions";
            this.axios.patch(url, {
                id: this.selectedAssign.id,
                realitzacio: this.selectedAssign.realitzat
            }, {
                headers: {
                    'Authorization': 'Bearer ' + commonMethods.getSessionToken()
                }
            })
                .then(this.getAssignedVideos)
                .catch(error => {
                    console.log(error);
                    this.showMessage(error);
                });
        },

        getLoggedUser() {
            this.loggedUserId = commonMethods.getLoggedUserId();
        },

        showMessage(message) {
            this.message = message
            this.showSnack = true
        }
    },

    computed: {
        linkVideo() {
            return 'https://drive.google.com/file/d/' + this.selectedVideo.codi + '/preview'
        },

        textRealitzacio() {
            return this.selectedAssign.realitzat ? 'si' : 'no'
        }
    },

    mounted() {
        if (!commonMethods.isAuthenticated()) {
            this.$router.push("/");
        }
        else {
            this.getLoggedUser();
            this.getAssignedVideos();
        }
    }
}
</script>

<style scoped>
#container {
    margin: 50px 50px 0 50px;
}

#videoDescription {
    margin: 10px 0 0 20px;
}
</style>