<template>
    <div class="list">
        <DataTable v-model:filters="filters" :value="users" dataKey="id" paginator :rows="10" removableSort
            :loading="loading" tableStyle="min-width: 50rem" :metaKeySelection=false selectionMode="single"
            v-model:selection="selectedUser" :globalFilterFields="['nomComplet', 'username']">
            <template #header>
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
            </template>
            <template #paginatorstart>
                <div class="actions">
                    <CrearUserComp :allFisios="getFisios" :allUsers="allUsers" @createdUser='postUsuari' />
                    <EditarUserComp v-if="userIsSelected" :selectedUser="selectedUser" :allFisios="getFisios"
                        :allUsers="allUsers" @editedUser="postUsuari" />
                    <EliminarUserComp v-if="userIsSelected" :selectedUser="selectedUser" @deletedUser="postUsuari" />
                    <VeureAssignacionsComp v-if="userIsSelected" :selectedUser="selectedUser" />
                </div>
            </template>
            <template #empty> No s'han trobat usuaris. </template>
            <template #loading> Carregant usuaris... </template>
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
                Tancar
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';
import commonMethods from '@/commonMethods';

import CrearUserComp from './CrearUserComp.vue'
import EditarUserComp from './EditarUserComp.vue'
import EliminarUserComp from './EliminarUserComp.vue'
import VeureAssignacionsComp from './VeureAssignacionsComp.vue'

export default {
    name: "UsuarisView",
    components: {
        CrearUserComp,
        EditarUserComp,
        EliminarUserComp,
        VeureAssignacionsComp
    },
    emits: ['loggedUser'],
    data() {
        return {
            allUsers: [],
            users: [],
            checkAdmin: false,
            checkClient: false,
            showSnack: false,
            message: '',
            selectedUser: null,
            loading: false,
            filters: {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS }
            }
        };
    },
    methods: {
        getUsers() {
            this.loading = true
            const url = process.env.VUE_APP_APIURL + "/users";
            this.axios.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + commonMethods.getSessionToken()
                }
            })
                .then(response => {
                    if (response.status == 200 && response.data) {
                        this.allUsers = response.data
                        this.users = this.allUsers
                        this.loading = false
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
            const rolIsAdmin = rol == 'Administrador'
            const rolIsClient = rol == 'Client'
            return (rolIsAdmin && this.checkAdmin) || (rolIsClient && this.checkClient) || (!this.checkAdmin && !this.checkClient)
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

        userIsSelected() {
            return this.selectedUser != null
        }
    },

    mounted() {
        // si no esta autenticat o  no es admin, no pot accedir a la pàgina
        if (!commonMethods.isAuthenticated() || !commonMethods.isAdmin()) {
            this.$router.push("/")
        }
        else {
            this.getUsers();
        }
    }
};
</script>

<style scoped>
.search {
    display: flex;
    margin-left: 0;
    margin-right: auto;
    padding: 10px;
}

.searchBar {
    width: 200px;
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