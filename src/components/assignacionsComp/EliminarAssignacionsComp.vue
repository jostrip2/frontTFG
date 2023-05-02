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
                        <span class="text-h5">Eliminar assignació</span>
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    Aquesta és una decisió <b>irreversible</b>. Esteu segur de que voleu eliminar l'assignació?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="showDialog(false)">
                        Cancelar
                    </v-btn>
                    <v-btn color="red" variant="text" @click="eliminarAssignacio">
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
    name: "EliminarAssignacionsComp",
    props: ['selectedAssign'],
    emits: ['deletedAssign'],
    data() {
        return {
            dialog: false,
        };
    },
    methods: {

        eliminarAssignacio() {
            const url = process.env.VUE_APP_APIURL + "/assignacions/" + this.propAssign.id;
            this.axios.delete(url, {
                headers: {
                    'Authorization': 'Bearer ' + commonMethods.getSessionToken()
                }
            })
                .then(response => {
                    if (response.status == 200) {
                        const message = 'Assignació eliminada correctament';
                        this.$emit('deletedAssign', message)
                    }
                })
                .catch(error => {
                    console.log(error);
                    const message = "S'ha produit un error a l'eliminar una assignació"
                    this.$emit('deletedAssign', message)
                })
            this.showDialog(false)
        },

        showDialog(bool) {
            this.dialog = bool
        }
    },

    computed: {
        propAssign() {
            return this.selectedAssign
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