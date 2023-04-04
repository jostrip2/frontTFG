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
                    <v-btn icon="mdi-account"></v-btn>

                    <v-toolbar-title class="font-weight-light">
                        <span class="text-h5">Editar usuari</span>
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-form fast-fail @submit.prevent ref="form">
                            <v-text-field v-model="propUser.nom" label="Nom" type="text" clearable required></v-text-field>
                            <v-text-field v-model="propUser.cognoms" label="Cognoms" type="text" clearable
                                required></v-text-field>
                            <v-text-field v-model="propUser.email" label="Email" type="email" :rules="emailRules" clearable
                                required></v-text-field>
                            <v-text-field v-model="propUser.numMobil" label="Mòbil" type="numbers" :rules="mobilRules"
                                clearable></v-text-field>
                            <v-select v-if="propUser.rol == 'Client'" v-model="propUser.Fisioterapeuta.nomComplet"
                                :items="fisios" item-title="nom" item-value="id" label="Fisioterapeuta" :rules="rolRules"
                                return-object></v-select>
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
export default {
    name: "PerfilView",
    data() {
        return {
            user: null,
            dialog: false,
            snack: false,
            nameRules: [
                value => {
                    if (value) return true;
                    return 'Camp obligatori'
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
    methods: {
        getUsuari() {
            const username = this.$store.status.username
            const url = process.env.VUE_APP_APIURL + "/users/" + username
            this.axios.get(url)
                .then(response => {
                    this.user = response.data
                })
                .catch(error => {
                    console.log(error);
                })

        },

        async validate() {
            const { valid } = await this.$refs.form.validate()

            if (valid) this.modificarUsuari()
            else this.snack = true
        },

        modificarUsuari() {
            const url = process.env.VUE_APP_APIURL + "/users";
            const user = {
                username: this.propUser.username,
                nom: this.propUser.nom,
                cognoms: this.propUser.cognoms,
                email: this.propUser.email,
                numMobil: this.propUser.numMobil,
                FisioterapeutaId: this.propUser.FisioterapeutaId
            }
            this.axios.patch(url, user)
                .then(response => {
                    if (response.status == 200) {
                        const message = 'Usuari modificat correctament'
                        this.$emit('editedUser', message)
                    }
                })
                .catch(error => {
                    console.log(error);
                    const message = "S'ha produit un error al modificar un usuari"
                    this.$emit('editedUser', message)
                })
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
        esViewPerfil() {
            return this.$route.name == 'PerfilView'
        }
    },

    mounted() {
        this.user = this.$store.state.user
    }

}

</script>

<style scoped>
div {
    padding: 5px;
}
</style>