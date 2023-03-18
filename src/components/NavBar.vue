<template>
    <div id="nav">
        <v-toolbar class="container-fluid">
            <v-toolbar-title>FisioApp</v-toolbar-title>
            <span v-if="isLoggedIn">
                <a @click="logout">Logout</a>
            </span>
            <span v-else>
                <router-link to="/">Login</router-link>
            </span>
        </v-toolbar>
    </div>
</template>
<script>
export default {
    name: 'NavBar',
    computed: {
        isLoggedIn: function () { return this.$store.getters.isAuthenticated }
    },
    methods: {
        async logout() {
            await this.$store.dispatch('LogOut')
            this.$router.push('/')
        }
    },
}
</script>

<style>
#nav {
    padding: 30px, 30px, 30px, 0px;
}
</style>