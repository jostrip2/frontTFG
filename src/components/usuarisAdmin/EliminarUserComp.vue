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
                        <span class="text-h5">Eliminar usuari</span>
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    Aquesta és una decisió <b>irreversible</b>. Esteu segur de que voleu eliminar l'usuari?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="showDialog(false)">
                        Cancelar
                    </v-btn>
                    <v-btn color="red" variant="text" @click="eliminarUsuari">
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
    name: "EliminarUserComp",
    props: ['selectedUser'],
    emits: ['deletedUser'],
    data() {
        return {
            dialog: false,
        };
    },
    methods: {

        eliminarUsuari() {
            const url = process.env.VUE_APP_APIURL + "/users/" + this.propUser.username;
            this.axios.delete(url, {
                headers: {
                    'Authorization': 'Bearer ' + commonMethods.getSessionToken()
                }
            })
                .then(response => {
                    if (response.status == 200) {
                        const message = 'Usuari eliminat correctament';
                        this.$emit('deletedUser', message)
                    }
                    else if (response.status == 404) {
                        const message = 'Usuari no existeix';
                        this.$emit('deletedUser', message)
                    }
                })
                .catch(error => {
                    console.log(error);
                    const message = "S'ha produit un error a l'eliminar un usuari"
                    this.$emit('deletedUser', message)
                })
            this.showDialog(false)
        },

        showDialog(bool) {
            this.dialog = bool
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
div {
    padding: 5px;
}

b {
    color: red;
}
</style>