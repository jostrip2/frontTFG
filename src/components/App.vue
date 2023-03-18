<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router';
import NavBar from '@/components/NavBar.vue'

export default {
    name: "App",
    components: {
        RouterLink,
        RouterView,
        NavBar
    }
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
</style>