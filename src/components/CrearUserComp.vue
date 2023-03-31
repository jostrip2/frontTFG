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
                    <v-btn icon="mdi-account"></v-btn>

                    <v-toolbar-title class="font-weight-light">
                        <span class="text-h5">Afegir usuari</span>
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-form fast-fail @submit.prevent ref="form">
                            <v-text-field v-model="this.user.username" label="Nom d'usuari *" type="text" clearable
                                required></v-text-field>
                            <v-text-field v-model="this.user.password" label="Constrasenya *" type="password"
                                :rules="passRules" clearable required></v-text-field>
                            <v-text-field v-model="this.user.email" label="Email *" type="email" :rules="emailRules"
                                clearable required></v-text-field>
                            <v-text-field v-model="this.user.numMobil" label="Mòbil" type="numbers" :rules="mobilRules"
                                clearable></v-text-field>
                            <v-autocomplete v-model="this.user.rol" :items="['Administrador', 'Client']" label="Rol *"
                                :rules="rolRules" clearable required></v-autocomplete>
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
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>

export default {
    name: "CrearUserComp",
    data() {
        return {
            dialog: false,
            snack: false,
            user: {
                username: '',
                password: '',
                email: '',
                numMobil: null,
                rol: ''
            },
            nameRules: [
                value => {
                    if (value) return true;
                    return 'Camp obligatori'
                }
            ],
            passRules: [
                value => {
                    if (value && value?.length >= 8) return true;
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
                    if (/^([0-9]){9}/.test(value)) return true
                    return 'Min. 9 números'
                }
            ],
            rolRules: [
                value => {
                    if (value) return true;
                    return 'Camp obligatori'
                }
            ]
        };
    },
    emits: ['usuariCreat'],
    methods: {
        async validate() {
            const { valid } = await this.$refs.form.validate()

            if (valid) this.afegirUsuari()
            else this.snack = true
        },

        afegirUsuari() {
            const url = process.env.VUE_APP_APIURL + "/users";
            this.axios.post(url, this.user)
                .then(response => {
                    if (response.status == 201) {
                        const message = 'Usuari creat correctament'
                        this.$emit('createdUser', message)
                    }
                })
                .catch(error => {
                    console.log(error);
                    const message = "S'ha produit un error a l'afegir un usuari"
                    this.$emit('createdUser', message)
                })

            this.closeDialog()
        },

        showDialog(bool) {
            this.dialog = bool
        },

        closeDialog() {
            this.showDialog(false)
            this.clearFields()
        },

        clearFields() {
            this.user.username = ''
            this.user.password = ''
            this.user.email = ''
            this.user.numMobil = null
            this.user.rol = ''
        },

        showSnack(bool) {
            this.snack = bool
        }
    }
}
</script>
<style scoped>
div {
    padding: 5px;
}
</style>