<template>
    <div>
        <v-tooltip text="Editar" location="top">
            <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="x-large" @click="showDialog(true)">
                    mdi-pencil
                </v-icon>
            </template>
        </v-tooltip>
        <v-dialog v-model="this.dialog" persistent width="512">
            <v-card>
                <v-toolbar flat color="blue-darken-3">
                    <v-btn icon="mdi-pencil"></v-btn>

                    <v-toolbar-title class="font-weight-light">
                        <span class="text-h5">Editar video</span>
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-form fast-fail @submit.prevent ref="form">
                            <v-text-field v-model="propVideo.nom" label="Nom *" type="text" :rules="noBuitRules" clearable
                                required></v-text-field>
                            <v-text-field v-model="propVideo.descripcio" label="Descripcio *" type="text"
                                :rules="noBuitRules" clearable required></v-text-field>
                            <v-text-field v-model="linkVideo" label="Enllaç de Google Drive *" type="text"
                                :rules="linkRules" clearable required></v-text-field>
                            <v-select v-model="propVideo.areaExercici" :items="arees" label="Area"></v-select>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="showDialog(false)">
                        Cancelar
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="validate">
                        Editar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snack" :timeout=3000>
            Formulari no correcte
            <template v-slot:actions>
                <v-btn color="blue" variant="text" @click="showSnack(false)">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
import isUrl from 'is-url'
import commonMethods from '@/commonMethods';

export default {
    name: "EditarVideoComp",
    props: ['selectedVideo'],
    emits: ['editedVideo'],
    data() {
        return {
            linkVideo: '',
            dialog: false,
            snack: false,
            arees: ['Braços', 'Tronc', 'Cames', 'Coll'],
            noBuitRules: [
                value => {
                    if (value) return true;
                    return 'Camp obligatori'
                }
            ],
            linkRules: [
                value => {
                    if (!value) return 'Camp obligatori'
                    if (isUrl(value)) return true
                    return 'Link no vàlid'
                }
            ]
        };
    },
    methods: {
        async validate() {
            const { valid } = await this.$refs.form.validate()

            if (valid) this.modificarVideo()
            else this.snack = true
        },
        modificarVideo() {
            const url = process.env.VUE_APP_APIURL + "/videos";
            try {
                let video = {
                    id: this.propVideo.id,
                    nom: this.propVideo.nom,
                    codi: this.getVideoCodi,
                    descripcio: this.propVideo.descripcio,
                    areaExercici: this.propVideo.areaExercici
                }
                this.axios.patch(url, video, {
                    headers: {
                        'Authorization': 'Bearer ' + commonMethods.sessionToken()
                    }
                })
                    .then(response => {
                        if (response.status == 200) {
                            const message = 'Video modificat correctament'
                            this.$emit('editedVideo', message)
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        const message = "S'ha produit un error al modificar un video"
                        this.$emit('editedVideo', message)
                    })
            }
            catch (error) {
                console.log(error);
                const message = "S'ha produit un error a l'editar un video"
                this.$emit('editedVideo', message)
            }
            this.showDialog(false)
        },

        showDialog(bool) {
            this.dialog = bool
        },

        showSnack(bool) {
            this.snack = bool
        }
    },
    computed: {
        propVideo() {
            return this.selectedVideo
        },

        getVideoLink() {
            return 'https://drive.google.com/file/d/' + this.propVideo.codi + '/view?usp=share_link'
        },

        getVideoCodi() {
            return this.linkVideo.split('/')[5]
        }
    },
    mounted() {
        this.linkVideo = this.getVideoLink
    }

}

</script>

<style scoped>
div {
    padding: 5px;
}
</style>