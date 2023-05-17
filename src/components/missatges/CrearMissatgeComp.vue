<template>
    <div>
        <v-tooltip text="Nou missatge" location="top">
            <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="x-large" @click="showDialog(true)">
                    mdi-plus
                </v-icon>
            </template>
        </v-tooltip>
        <v-dialog v-model="this.dialog" persistent width="512">
            <v-card>
                <v-toolbar flat color="blue-darken-3">
                    <v-btn icon="mdi-email"></v-btn>

                    <v-toolbar-title id="title" class="font-weight-light">
                        <span class="text-h5">Nou missatge</span>
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-form fast-fail @submit.prevent ref="form">
                            <v-text-field v-model="receptor.nomComplet" label="Per " type="text" hide-details
                                readonly></v-text-field>
                            <v-text-field v-model="titol" label="Titol *" type="text" :rules="noBuitRules" hide-details
                                clearable required></v-text-field>
                            <v-textarea v-model="missatge" label="Missatge *" type="text" :rules="noBuitRules" hide-details
                                clearable required></v-textarea>
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
import commonMethods from '@/commonMethods';

export default {
    name: "CrearMissatgeComp",
    emits: ['createdMessage'],
    data() {
        return {
            dialog: false,
            snack: false,
            receptor: commonMethods.getUserFisio(),
            titol: '',
            missatge: '',
            noBuitRules: [
                value => {
                    if (value) return true;
                    return 'Camp obligatori'
                }
            ]
        };
    },
    methods: {
        async validate() {
            const { valid } = await this.$refs.form.validate()
            if (valid) this.crearMissatge()
            else this.snack = true
        },

        crearMissatge() {
            const url = process.env.VUE_APP_APIURL + "/missatges";
            const missatge = {
                emissor: commonMethods.getLoggedUserId(),
                receptor: this.receptor.id,
                titol: this.titol,
                missatge: this.missatge
            }
            this.axios.post(url, missatge, {
                headers: {
                    'Authorization': 'Bearer ' + commonMethods.getSessionToken()
                }
            }).then(response => {
                if (response.status == 201) {
                    const message = 'Missatge enviat correctament'
                    this.$emit('createdMessage', message)
                    this.closeDialog()
                }
            }).catch(error => {
                console.log(error);
                const message = "S'ha produit un error a l'afegir un usuari"
                this.$emit('createdMessage', message)
                this.closeDialog()
            })
        },

        showDialog(bool) {
            this.dialog = bool;
        },

        closeDialog() {
            this.showDialog(false);
            this.clearFields();
        },

        clearFields() {
            this.titol = '';
            this.missatge = '';
        },

        showSnack(bool) {
            this.snack = bool
        }
    },
    computed: {

    },

    mounted() {

    }
}
</script>
<style scoped>
div {
    padding: 5px;
}

#title {
    margin: 0;
}
</style>