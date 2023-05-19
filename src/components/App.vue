<template>
    <Teleport to="head">

        <head http-equiv="Content-Security-Policy"
            content="default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self'; frame-src 'self'; frame-ancestors 'self' https://accounts.google.com/ https://drive.google.com">
        </head>
    </Teleport>
    <div id="app">
        <v-card>
            <v-layout>
                <v-app-bar v-if="!isLogin" class="justify-left" color="blue-darken-3">
                    <div id="barLeft">
                        <v-toolbar-title id="title">FisioApp</v-toolbar-title>

                        <v-btn v-if="isAdmin || isAdminSession" :to="{ name: 'UsuarisView' }" prepend-icon="mdi-account">
                            Usuaris</v-btn>
                        <p v-if="isAdmin || isAdminSession">|</p>
                        <v-btn v-if="isAdmin || isAdminSession" :to="{ name: 'VideosView' }"
                            prepend-icon="mdi-video">Videos</v-btn>
                        <v-btn v-if="!isAdmin && !isAdminSession" :to="{ name: 'AssignacionsClientView' }"
                            prepend-icon="mdi-video">Videos</v-btn>
                    </div>
                    <div id="barRigth">
                        <v-btn prepend-icon="mdi-email" :to="{ name: 'MissatgesView' }">Missatges</v-btn>
                        <p>|</p>
                        <v-btn prepend-icon="mdi-account-details" :to="{ name: 'PerfilView' }">Perfil</v-btn>
                        <p>|</p>
                        <v-btn @click="logout" prepend-icon="mdi-power">Tancar sessió</v-btn>
                    </div>
                </v-app-bar>

                <v-main id="content">
                    <RouterView @loggedUser="setIsAdmin" />
                </v-main>
            </v-layout>
        </v-card>
    </div>
</template>

<script>
import { RouterView } from 'vue-router';
import commonMethods from '@/commonMethods';

export default {
    name: "App",
    components: {
        RouterView
    },
    data() {
        return {
            isAdmin: false
        }
    },
    computed: {
        isLogin() {
            return this.$route.name === 'LoginView'
        },

        isAdminSession() {
            return commonMethods.isAdmin()
        }
    },
    methods: {
        logout() {
            sessionStorage.clear()
            this.$router.push('/')
        },

        setIsAdmin(bool) {
            this.isAdmin = bool
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

p {
    margin-top: 5px;
}

#barLeft {
    display: flex;
    margin-left: 15px;
    margin-right: auto;
    padding-left: 35px;
}

#title {
    margin-right: 20px;
    margin-top: 3px;
}

#barRigth {
    display: flex;
    margin-left: auto;
    margin-right: 15px;
    padding-right: 35px;
}

#content {
    height: 100vh;
    display: flex;
    flex-direction: column;
}
</style>