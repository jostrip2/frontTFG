<template>
    <div>
        <v-tooltip text="Afegir" location="top">
            <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="x-large" @click="showDialog(true)">
                    mdi-plus
                </v-icon>
            </template>
        </v-tooltip>
        <v-dialog v-model="this.dialog" persistent width="512">
            <v-card>
                <v-toolbar flat color="blue-darken-3">
                    <v-btn icon="mdi-video-plus"></v-btn>

                    <v-toolbar-title class="font-weight-light">
                        <span class="text-h5">Afegir usuari</span>
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-form fast-fail @submit.prevent ref="form">
                            <v-text-field v-model="this.video.nom" label="Nom *" type="text" :rules="noBuitRules" clearable
                                required></v-text-field>
                            <v-text-field v-model="this.video.descripcio" label="Descripcio *" type="text"
                                :rules="noBuitRules" clearable required></v-text-field>
                            <v-text-field v-model="this.linkVideo" label="Enllaç de Google Drive *" type="text"
                                :rules="linkRules" clearable required></v-text-field>
                            <v-select v-model="this.video.areaExercici" :items="arees" label="Area"></v-select>
                        </v-form>
                    </v-container>
                    <small style="padding-left: 12px; color: red;">* Camp necessari</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="closeDialog">
                        Cancelar
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="validate">
                        Afegir
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snack" :timeout=3000>
            Formulari no correcte
            <template v-slot:actions>
                <v-btn color="blue" variant="text" @click="showSnack(false)">
                    Tancar
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
import isUrl from 'is-url'
import commonMethods from '@/commonMethods';

export default {
    name: "CrearVideoComp",
    emits: ['createdVideo'],
    data() {
        return {
            dialog: false,
            snack: false,
            video: {
                nom: '',
                codi: '',
                descripcio: '',
                areaExercici: ''
            },
            linkVideo: '',
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
            if (valid) this.afegirUsuari()
            else this.snack = true
        },

        afegirUsuari() {
            const url = process.env.VUE_APP_APIURL + "/videos";
            this.video.codi = this.getCodiVideo;
            this.axios.post(url, this.video, {
                headers: {
                    'Authorization': 'Bearer ' + commonMethods.getSessionToken()
                }
            })
                .then(response => {
                    if (response.status == 201) {
                        const message = 'Video creat correctament';
                        this.$emit('createdVideo', message);
                        this.closeDialog();
                    }
                    else {
                        if (response.data.code == 1) {
                            const message = "El video ja existeix";
                            this.$emit('createdVideo', message);
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                    const message = "S'ha produit un error a l'afegir un video";
                    this.$emit('createdVideo', message);
                    this.closeDialog();
                })
        },

        showDialog(bool) {
            this.dialog = bool
        },

        closeDialog() {
            this.showDialog(false)
            this.clearFields()
        },

        clearFields() {
            this.video = {}
        },

        showSnack(bool) {
            this.snack = bool
        }
    },
    computed: {
        getCodiVideo() {
            return this.linkVideo.split('/')[5]
        }
    }
}
</script>
<style scoped>
div {
    padding: 5px;
}
</style>