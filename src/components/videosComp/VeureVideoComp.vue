<template>
    <div>
        <v-tooltip text="Veure" location="top">
            <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="x-large" @click="showDialog(true)">
                    mdi-eye
                </v-icon>
            </template>
        </v-tooltip>
        <v-dialog v-model="this.dialog" persistent width="unset">
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
                    <v-btn color="blue-darken-1" variant="text" @click="showDialog(false)">
                        Sortir
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: "VeureVideoComp",
    props: ['selectedVideo'],
    data() {
        return {
            dialog: false
        };
    },

    methods: {
        showDialog(bool) {
            this.dialog = bool
        }
    },

    computed: {
        propVideo() {
            return this.selectedVideo
        },

        linkVideo() {
            return 'https://drive.google.com/file/d/' + this.propVideo + '/preview'
        }
    }
}
</script>

<style scoped>
div {
    padding: 5px;
}
</style>