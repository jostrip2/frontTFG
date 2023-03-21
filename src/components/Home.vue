<template>
    <div>
        <p>Home page</p>
    </div>
</template>

<script>
export default {
    name: "Login",
    components: {},
    data() {
        return {

        };
    },
    methods: {

    },

    created() {
        if (!this.$store.getters.isAuthenticated) {
            this.$router.push("/")
        }
    }
};
</script>

<style></style>