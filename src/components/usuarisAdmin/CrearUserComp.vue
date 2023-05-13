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
                    <v-btn icon="mdi-account-plus"></v-btn>

                    <v-toolbar-title class="font-weight-light">
                        <span class="text-h5">Afegir usuari</span>
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-form fast-fail @submit.prevent ref="form">
                            <v-text-field v-model="this.user.nom" label="Nom *" type="text" :rules="noBuitRules" clearable
                                required></v-text-field>
                            <v-text-field v-model="this.user.cognoms" label="Cognoms *" type="text" :rules="noBuitRules"
                                clearable required></v-text-field>
                            <v-text-field v-model="this.user.username" label="Nom d'usuari *" type="text"
                                :rules="noBuitRules" clearable required></v-text-field>
                            <v-text-field v-model="this.user.password" label="Constrasenya *" type="password"
                                :rules="passRules" clearable required></v-text-field>
                            <v-text-field v-model="this.user.email" label="Email *" type="email" :rules="emailRules"
                                clearable required></v-text-field>
                            <v-text-field v-model="this.user.numMobil" label="Mòbil" type="numbers" :rules="mobilRules"
                                clearable></v-text-field>
                            <v-select v-model="this.user.rol" :items="['Administrador', 'Client']" label="Rol *"
                                :rules="noBuitRules"></v-select>
                            <v-select v-model="this.user.fisio" :items="fisios" item-title="nom" item-value="id"
                                label="Fisioterapeuta *" :rules="noBuitRules" return-object></v-select>
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
    name: "CrearUserComp",
    props: ['allFisios'],
    emits: ['createdUser'],
    data() {
        return {
            dialog: false,
            snack: false,
            user: {
                nom: '',
                cognoms: '',
                username: '',
                password: '',
                email: '',
                numMobil: null,
                rol: null,
                fisio: null
            },
            noBuitRules: [
                value => {
                    if (value) return true;
                    return 'Camp obligatori'
                }
            ],
            passRules: [
                value => {
                    if (value && value.length >= 8) return true;
                    return 'Min. 8 caràcters'
                }
            ],
            emailRegex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/,
            emailRules: [
                value => {
                    if (value && this.emailRegex.test(value)) return true
                    return 'El email no té el format correcte'
                }
            ],
            mobilRules: [
                value => {
                    if (value && value?.length == 9) return true
                    return 'Ha de ser de 9 números'
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
            const url = process.env.VUE_APP_APIURL + "/users";
            this.axios.post(url, this.user, {
                headers: {
                    'Authorization': 'Bearer ' + commonMethods.getSessionToken()
                }
            })
                .then(response => {
                    if (response.status == 201) {
                        const message = 'Usuari creat correctament'
                        this.$emit('createdUser', message)
                        this.closeDialog()
                    }
                    else {
                        if (response.data.code == 1) { // error usuari ja existeix
                            const message = "El nom d'usuari introduït ja existeix"
                            this.$emit('createdUser', message)
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                    const message = "S'ha produit un error a l'afegir un usuari"
                    this.$emit('createdUser', message)
                    this.closeDialog()
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
            this.user.nom = ''
            this.user.cognoms = ''
            this.user.username = ''
            this.user.password = ''
            this.user.email = ''
            this.user.numMobil = null
            this.user.rol = null
            this.user.fisio = null
        },

        showSnack(bool) {
            this.snack = bool
        }
    },
    computed: {
        fisios() {
            return this.allFisios
        }
    }
}
</script>
<style scoped>
div {
    padding: 5px;
}
</style>