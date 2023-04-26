<template>
    <div>
        <v-tooltip text="Eliminar" location="top">
            <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="x-large" @click="showDialog(true)">
                    mdi-delete
                </v-icon>
            </template>
        </v-tooltip>
        <v-dialog v-model="this.dialog" persistent width="512">
            <v-card>
                <v-toolbar flat color="blue-darken-3">
                    <v-btn icon="mdi-delete"></v-btn>

                    <v-toolbar-title class="font-weight-light">
                        <span class="text-h5">Eliminar video</span>
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    Aquesta és una decisió <b>irreversible</b>. Esteu segur que voleu eliminar el video?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="showDialog(false)">
                        Cancelar
                    </v-btn>
                    <v-btn color="red" variant="text" @click="eliminarVideo">
                        Eliminar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import commonMethods from '@/commonMethods';

export default {
    name: "EliminarVideoComp",
    props: ['selectedVideo'],
    emits: ['deletedVideo'],
    data() {
        return {
            dialog: false
        };
    },
    methods: {
        eliminarVideo() {
            const url = process.env.VUE_APP_APIURL + "/videos/" + this.propVideo.id;
            this.axios.delete(url, {
                headers: {
                    'Authorization': 'Bearer ' + commonMethods.sessionToken()
                }
            })
                .then(response => {
                    if (response.status == 200) {
                        const message = 'Video eliminat correctament';
                        this.$emit('deletedVideo', message)
                    }
                    else if (response.status == 404) {
                        const message = 'Video no existeix';
                        this.$emit('deletedVideo', message)
                    }
                })
                .catch(error => {
                    console.log(error);
                    const message = "S'ha produit un error a l'eliminar el video"
                    this.$emit('deletedVideo', message)
                })
            this.showDialog(false)
        },

        showDialog(bool) {
            this.dialog = bool
        }
    },

    computed: {
        propVideo() {
            return this.selectedVideo
        }
    }

}
</script>

<style scoped>
div {
    padding: 5px;
}

b {
    color: red;
}
</style>