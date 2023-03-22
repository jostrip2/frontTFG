<template>
    <div id="app">
        <v-card>
            <v-layout>
                <v-app-bar v-if="!isLogin" class="justify-left" color="blue-darken-3">
                    <v-toolbar-title class="title">FisioApp</v-toolbar-title>

                    <v-btn v-if="isAdmin" :to="{ name: 'UsuarisView' }">Usuaris</v-btn>
                    <p v-if="isAdmin">|</p>
                    <v-btn v-if="isAdmin">Videos</v-btn>

                    <v-spacer></v-spacer>
                    <v-btn @click="veureMissatges">Missatges</v-btn>
                    <p>|</p>
                    <v-btn @click="veurePerfil">Perfil</v-btn>
                    <p>|</p>
                    <v-btn @click="logout">Tancar sessió</v-btn>
                </v-app-bar>

                <v-main id="content">
                    <RouterView />
                </v-main>
            </v-layout>
        </v-card>
    </div>
</template>

<script>
import { RouterView } from 'vue-router';

export default {
    name: "App",
    components: {
        RouterView
    },
    data() {
        return {
            itemsVideos: [
                { title: 'Cercar videos', to: "" },
                { title: 'Assignar videos', to: "" }
            ],
        }
    },
    computed: {
        isLogin() {
            return this.$route.name === 'LoginView'
        },

        isLoggedIn() {
            return this.$store.getters.isAuthenticated
        },

        isAdmin() {
            return this.$store.getters.isAdmin
        }
    },
    methods: {
        logout() {
            this.$store.commit('logOut')
            this.$router.push('/')
        },

        veurePerfil() {

        },

        veureMissatges() {

        }
    },
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

v-app-bar {
    position: relative;
    justify-content: flex-start;
}

#content {
    height: 100vh;
    display: flex;
    flex-direction: column;
}
</style>