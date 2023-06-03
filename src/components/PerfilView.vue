<template>
    <div id="container">
        <h1 id="titol">{{ titol }}</h1>
        <div class="formInfoUser">
            <v-form v-if="!isEditPass" fast-fail @submit.prevent ref="form">
                <v-text-field v-model="username" label="Nom d'usuari" type="text" readonly></v-text-field>
                <v-text-field v-model="nom" label="Nom" type="text" :rules="nameRules" :clearable="isEdit"
                    :required="isEdit" :readonly="!isEdit"></v-text-field>
                <v-text-field v-model="cognoms" label="Cognoms" type="text" :rules="nameRules" :clearable="isEdit"
                    :required="isEdit" :readonly="!isEdit"></v-text-field>
                <v-text-field v-model="email" label="Email" type="email" :rules="emailRules" :clearable="isEdit"
                    :required="isEdit" :readonly="!isEdit"></v-text-field>
                <v-text-field v-model="numMobil" label="Num. Mòbil" type="numbers" :rules="mobilRules" :clearable="isEdit"
                    :readonly="!isEdit"></v-text-field>
                <v-text-field v-if="isClient" v-model="nomCompletFisio" label="Fisioterapeuta" readonly></v-text-field>
            </v-form>
            <v-form v-if="isEditPass" fast-fail @submit.prevent ref="formPass">
                <v-text-field v-model="password" label="Contrasenya actual" type="password" :rules="passRules" clearable
                    required></v-text-field>
                <v-text-field v-model="password2" label="Repetir contrasenya actual" type="password" :rules="passRules"
                    clearable required></v-text-field>
                <v-text-field v-model="newPassword" label="Nova contrasenya" type="password" :rules="passRules" clearable
                    required></v-text-field>
            </v-form>
            <div class="buttons">
                <v-btn v-if="!isEdit && !isEditPass" color="blue-darken-1" variant="text" @click="isEdit = true">
                    Editar
                </v-btn>
                <v-btn v-if="!isEdit && !isEditPass" color="blue-darken-1" variant="text" @click="setCanviarPass">
                    Canviar contrasenya
                </v-btn>
                <v-btn v-if="isEdit || isEditPass" color="blue-darken-1" variant="text" @click="cancelarEdit">
                    Cancelar
                </v-btn>
                <v-btn v-if="isEdit" color="blue-darken-1" variant="text" @click="validate">
                    Confirmar
                </v-btn>
                <v-btn v-if="isEditPass" color="blue-darken-1" variant="text" @click="validatePass">
                    Confirmar
                </v-btn>
            </div>
        </div>
    </div>

    <v-snackbar v-model="snack" :timeout=3000>
        {{ message }}
        <template v-slot:actions>
            <v-btn color="blue" variant="text" @click="snack = false">
                Tancar
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
import commonMethods from '@/commonMethods';

export default {
    name: "PerfilView",
    emits: ['loggedUser'],
    data() {
        return {
            titol: 'Perfil',
            nom: '',
            cognoms: '',
            username: '',
            password: '',
            password2: '',
            newPassword: '',
            email: '',
            numMobil: '',
            fisio: commonMethods.getUserFisio(),
            isClient: commonMethods.isClient(),
            isEdit: false,
            isEditPass: false,
            snack: false,
            message: '',
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
            passRules: [
                value => {
                    if (value && value.length >= 8) return true;
                    return 'Min. 8 caràcters'
                }
            ],
        };
    },
    methods: {
        getLoggedUser() {
            const url = process.env.VUE_APP_APIURL + "/users/" + commonMethods.getLoggedUsername()
            this.axios.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + commonMethods.getSessionToken()
                }
            }).then(response => {
                this.setUser(response.data);
            }).catch(error => {
                console.log(error);
            })

        },

        setUser(user) {
            this.nom = user.nom;
            this.cognoms = user.cognoms;
            this.username = user.username;
            this.email = user.email;
            this.numMobil = user.numMobil;
        },

        async validate() {
            const { valid } = await this.$refs.form.validate()

            if (valid) {
                this.modificarUsuari();
                this.isEdit = false;
            }
            else {
                this.message = 'Camps no vàlids';
                this.snack = true;
            }
        },

        modificarUsuari() {
            const url = process.env.VUE_APP_APIURL + "/users";
            this.axios.patch(url, {
                username: this.username,
                nom: this.nom,
                cognoms: this.cognoms,
                email: this.email,
                numMobil: this.numMobil,
                FisioterapeutaId: this.fisio.id
            }, {
                headers: {
                    'Authorization': 'Bearer ' + commonMethods.getSessionToken()
                }
            }).then(response => {
                if (response.status == 200) {
                    this.message = 'Perfil modificat correctament'
                    this.snack = true
                }
            }).catch(error => {
                console.log(error);
                this.message = "S'ha produit un error al modificar el perfil"
                this.snack = true
            })
        },

        cancelarEdit() {
            if (this.isEdit) this.getLoggedUser();
            this.isEdit = false;
            if (this.isEditPass) this.clearPass();
            this.isEditPass = false;
            this.titol = 'Perfil';
        },

        clearPass() {
            this.password = '';
            this.password2 = '';
            this.newPassword = '';
        },

        setCanviarPass() {
            this.isEditPass = true;
            this.titol = 'Canviar contrasenya';
        },

        async validatePass() {
            const { valid } = await this.$refs.formPass.validate()

            if (valid) {
                if (this.password !== this.password2) {
                    this.message = 'Les contrasenyes no coincideixen';
                    this.snack = true;
                }
                else if (this.password === this.newPassword) {
                    this.message = "La nova contrasenya no pot ser igual a l'anterior";
                    this.snack = true;
                }
                else this.checkPass();
            }
            else {
                this.message = 'Camps no vàlids';
                this.snack = true;
            }
        },

        checkPass() {
            const url = process.env.VUE_APP_APIURL + "/users/checkPass";
            this.axios.post(url, {
                username: this.username,
                password: this.password
            }, {
                headers: {
                    'Authorization': 'Bearer ' + commonMethods.getSessionToken()
                }
            }).then(response => {
                if (response.data) {
                    this.modificarPassword();
                    this.isEditPass = false;
                    this.clearPass();
                }
                else {
                    this.message = "La contrasenya no coincideix amb la de l'usuari";
                    this.snack = true;
                }
            }).catch(error => {
                console.log(error);
                this.message = "S'ha produit un error al modificar la contrasenya"
                this.snack = true
            })
        },

        modificarPassword() {
            const url = process.env.VUE_APP_APIURL + "/users/pass";
            this.axios.patch(url, {
                username: this.username,
                password: this.newPassword
            }, {
                headers: {
                    'Authorization': 'Bearer ' + commonMethods.getSessionToken()
                }
            }).then(response => {
                if (response.status == 200) {
                    this.message = 'Contrasenya modificada correctament'
                    this.snack = true
                }
            }).catch(error => {
                console.log(error);
                this.message = "S'ha produit un error al modificar la contrasenya"
                this.snack = true
            })
        }
    },

    computed: {
        nomCompletFisio() {
            return this.fisio.nomComplet;
        }
    },

    mounted() {
        if (!commonMethods.isAuthenticated()) {
            this.$router.push("/");
        }
        else {
            this.getLoggedUser();
        }
    }

}

</script>

<style scoped>
#container {
    margin: 30px 50px 0 50px;
    min-height: 600px;
}

#titol {
    margin-bottom: 20px;
    text-align: start;
}

.formInfoUser {
    width: 500px;
}

.buttons {
    text-align: start;
    margin-bottom: 20px;
}
</style>