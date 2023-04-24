<template>
    <div class="container">
        <v-tooltip text="Videos assignats" location="top">
            <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="x-large" @click="toAssignacions">
                    mdi-video-account
                </v-icon>
            </template>
        </v-tooltip>
    </div>
</template>

<script>
export default {
    name: 'VeureAssignacionsComp',
    props: ['selectedUser'],

    methods: {
        toAssignacions() {
            this.$store.commit('setSelectedUser', this.propUser)
            this.$router.push({ name: 'AssignacionsView' })
        }
    },

    computed: {
        propUser() {
            return this.selectedUser
        }
    }
}
</script>

<style scoped>
.container {
    padding: 5px;
}
</style>