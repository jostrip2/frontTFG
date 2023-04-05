<template>
    <div class="list">
        <DataTable v-model:filters="filters" :value="users" dataKey="id" paginator :rows="10" :alwaysShowPaginator=false
            removableSort tableStyle="min-width: 50rem" :metaKeySelection=false selectionMode="single"
            v-model:selection="selectedUser" :globalFilterFields="['nomComplet', 'username']">
            <template #header>
                <div class="listHeader">
                    <div class="search">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Cercar usuari" />
                        </span>
                        <div class="checks">
                            <v-checkbox v-model="this.checkAdmin" label="Administrador" @change="searchUser"
                                hide-details></v-checkbox>
                            <v-checkbox v-model="this.checkClient" label="Client" @change="searchUser"
                                hide-details></v-checkbox>
                        </div>
                    </div>
                    <div class="actions">
                        <CrearUserComp :allFisios="getFisios" :allUsers="allUsers" @createdUser='postUsuari' />
                        <EditarUserComp v-if="selectedUser != null" v-model="this.editDialog" :selectedUser="selectedUser"
                            :allFisios="getFisios" :allUsers="allUsers" @click="showEditUser" @editedUser="postUsuari" />
                        <EliminarUserComp v-if="selectedUser != null" v-model="this.deleteDialog"
                            :selectedUser="selectedUser" @click="showDeleteUser" @deletedUser="postUsuari" />
                    </div>
                </div>
            </template>
            <template #empty> No s'han trobat usuaris. </template>
            <PColumn field="nomComplet" sortable header="Nom" style="width: 200px;"></PColumn>
            <PColumn field="username" sortable header="Username" style="width: 200px;"></PColumn>
            <PColumn field="email" header="Email" style="width: 200px;"></PColumn>
            <PColumn field="numMobil" header="Mòbil" style="width: 200px;"></PColumn>
            <PColumn field="rol" header="Rol" style="width: 200px;"></PColumn>
            <PColumn field="Fisioterapeuta.nomComplet" header="Fisioterapeuta" style="width: 200px;"></PColumn>
        </DataTable>
    </div>
    <v-snackbar v-model="showSnack">
        {{ message }}

        <template v-slot:actions>
            <v-btn color="blue" variant="text" @click="showSnack = false">
                Close
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';

import CrearUserComp from './CrearUserComp.vue'
import EditarUserComp from './EditarUserComp.vue'
import EliminarUserComp from './EliminarUserComp.vue'

export default {
    name: "UsuarisView",
    components: {
        CrearUserComp,
        EditarUserComp,
        EliminarUserComp
    },
    emits: ['createdUser', 'editedUser', 'deletedUser'],
    data() {
        return {
            allUsers: [],
            users: [],
            checkAdmin: false,
            checkClient: false,
            editDialog: false,
            deleteDialog: false,
            showSnack: false,
            message: '',
            selectedUser: null,
            filters: {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS }
            }
        };
    },
    methods: {
        getUsers() {
            const url = process.env.VUE_APP_APIURL + "/users";
            this.axios.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + this.getToken
                }
            })
                .then(response => {
                    if (response.status == 200 && response.data) {
                        this.allUsers = response.data
                        this.users = this.allUsers
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.showMessage(error)
                })
        },

        searchUser() {
            var searchedUsers = [];
            this.allUsers.forEach(user => {
                if (this.checkRol(user.rol)) {
                    searchedUsers.push(user)
                }
            });
            this.users = searchedUsers;

            if (searchedUsers.indexOf(this.selectedUser) < 0) {
                this.selectedUser = null
            }
        },

        checkRol(rol) {
            const isAdmin = rol == 'Administrador'
            const isClient = rol == 'Client'
            return (isAdmin && this.checkAdmin) || (isClient && this.checkClient) || (!this.checkAdmin && !this.checkClient)
        },

        refresh() {
            this.getUsers()
            this.searchUser()
        },

        postUsuari(message) {
            this.showMessage(message)
            this.refresh()
        },

        showMessage(message) {
            this.message = message
            this.showSnack = true
        },

        showEditUser() {
            this.editDialog = true
        },

        showDeleteUser() {
            this.deleteDialog = true
        }
    },

    computed: {
        getFisios() {
            var fisios = []
            this.allUsers.forEach(user => {
                if (user.rol == "Administrador") {
                    fisios.push({ id: user.id, nom: user.nomComplet })
                }
            });
            return fisios;
        },

        getToken() {
            return this.$store.state.token
        }
    },

    mounted() {
        if (!this.$store.getters.isAuthenticated || !this.$store.getters.isAdmin) {
            this.$router.push("/")
        }
        this.getUsers();
    }
};
</script>

<style scoped>
.listHeader {
    display: flex;
    flex-direction: row;
}

.search {
    display: flex;
    margin-left: 0;
    margin-right: auto;
    padding: 10px;
}

.checks {
    display: flex;
}

.list {
    margin: 50px 50px 0 50px;
    border: 1px solid rgb(221, 221, 221);
}

.actions {
    display: flex;
    margin-left: auto;
    margin-right: 0;
    padding: 10px;
}
</style>