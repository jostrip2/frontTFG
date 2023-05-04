<template>
    <div id="container">
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
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="showVideo = false">
                        Sortir
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
                            this.setItems(response.data)
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
            this.items = assigns.map(v => ({ "id": v.id, "startDate": v.dia, "title": v.Video.nom }))
        },

        seeVideo(calendarItem) {
            const assign = this.assigns.find(a => a.id == calendarItem.id);
            console.log(assign);
            this.selectedVideo = assign.Video
            this.showVideo = true
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
            //https://drive.google.com/file/d/1lfInM3TqTdjGroYISqLok-MQmomBHNJq/view?usp=sharing
            //https://drive.google.com/file/d/1lfInM3TqTdjGroYISqLok-MQmomBHNJq/preview
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
    border: 1px solid rgb(221, 221, 221);
}
</style>