<template>
    <div>
        <div v-if="loading">Loading...</div>
        <div v-if="!loading && !error">Welcome</div>
        <div v-if="!loading && error">Something went wrong</div>
        <p>{{ loading }} -- {{ error }} -- {{ err }}</p>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    name: "App",

    data() {
        return{
            loading: true,
            error: false,
            err: ""
        }
    },

    methods: {
        ...mapActions(["initialLoad"])
    },

    async mounted() {
        try {
            await this.initialLoad();
            this.loading = false;
        } catch (err) {
            this.loading = false;
            this.error = true;
            this.err = err;
        }
    }
}
</script>