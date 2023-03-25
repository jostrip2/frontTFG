<template>
    <div>
        <v-icon size="small" @click="showDialog(true)">
            mdi-delete
        </v-icon>
        <v-dialog v-model="this.dialog" persistent width="512">
            <v-card>
                <v-toolbar flat color="blue-darken-3">
                    <v-btn icon="mdi-account"></v-btn>

                    <v-toolbar-title class="font-weight-light">
                        <span class="text-h5">Eliminar usuari</span>
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    Text explicacio
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="showDialog(false)">
                        Cancelar
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="eliminarUsuari">
                        Eliminar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: "EliminarUserComp",
    props: ['selectedUser'],
    data() {
        return {
            dialog: false,
            username: this.selectedUser,
        };
    },
    emits: 'deletedUser',
    methods: {

        eliminarUsuari() {
            console.log('eliminat');
            /*const url = process.env.VUE_APP_APIURL + "/users" + this.username;
            this.axios.delete(url)
                .then(response => {
                    if (response.status == 200) {
                        const message = 'Usuari eliminat correctament';
                        this.$emit('deletedUser', message)
                    }
                })
                .catch(error => {
                    console.log(error);
                    const message = "S'ha produit un error al modificar un usuari"
                    this.$emit('deletedUser', message)
                })
            this.showDialog(false)*/
        },

        showDialog(bool) {
            this.dialog = bool
        }
    },

}
</script>