<template>
    <div>
        <v-tooltip text="Canviar contrasenya" location="top">
            <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="default" @click="showDialog(true)">
                    mdi-key
                </v-icon>
            </template>
        </v-tooltip>
        <v-dialog v-model="this.dialog" persistent width="512">
            <v-card>
                <v-toolbar flat color="blue-darken-3">
                    <v-btn icon="mdi-account"></v-btn>

                    <v-toolbar-title class="font-weight-light">
                        <span class="text-h5">Modificar contrasenya</span>
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    TODO
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="showDialog(false)">
                        Cancelar
                    </v-btn>
                    <v-btn color="red" variant="text" @click="modifyPassword">
                        Eliminar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: "ModifyPassComp",
    props: ['selectedUser'],
    data() {
        return {
            dialog: false,
            user: this.selectedUser,
        };
    },
    emits: ['modifiedPassword'],
    methods: {

        modifyPassword() {

        },

        showDialog(bool) {
            this.dialog = bool
        }
    },

}
</script>

<style scoped>
div {
    padding: 5px;
}
</style>