<template>
    <div class="search">
        <v-row class="filter" justify="space-between">
            <v-col cols="6">
                <v-text-field id="inputSearch" v-model="this.usernameSearch" variant="solo" label="Cercar usuari ..."
                    single-line @keyup="searchUser" hide-details />
            </v-col>
            <v-col cols="2">
                <CrearUserComp @usuariCreat='postUsuariCreat' />
            </v-col>
        </v-row>
        <v-row class="filter">
            <v-col cols="2" class="filter">
                <div class="checks">
                    <v-checkbox v-model="this.checkAdmin" label="Administrador" @change="searchUser"
                        hide-details></v-checkbox>
                    <v-checkbox id="checkClient" v-model="this.checkClient" label="Client" @change="searchUser"
                        hide-details></v-checkbox>
                </div>
            </v-col>
        </v-row>
    </div>
    <div class="list">
        <v-table class="table table-hover">
            <thead>
                <tr>
                    <th class="text-left">Username</th>
                    <th class="text-left">Email</th>
                    <th class="text-left">Num mobil</th>
                    <th class="text-left">Rol</th>
                    <th class="text-left">Accions</th>
                </tr>
            </thead>
            <tbody v-if="users.length > 0">
                <tr v-for="user in users" :key="user.username" class="text-left">
                    <td>{{ user.username }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.numMobil }}</td>
                    <td>{{ user.rol }}</td>
                    <td>
                        <v-icon size="small" class="me-2" @click="editUser(user)">
                            mdi-pencil
                        </v-icon>
                        <v-icon size="small" @click="deleteItem(user)">
                            mdi-delete
                        </v-icon>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </div>
    <EditarUserComp v-model="this.editarDialog" :selectedUser="this.selectedUser" @editedUser="refresh"></EditarUserComp>
    <v-snackbar v-model="showSnack" :timeout=3000>
        {{ message }}

        <template v-slot:actions>
            <v-btn color="blue" variant="text" @click="showSnack = false">
                Close
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
import CrearUserComp from './CrearUserComp.vue'
import EditarUserComp from './EditarUserComp.vue'

export default {
    name: "UsuarisView",
    components: {
        CrearUserComp,
        EditarUserComp
    },
    emits: ['usuariCreat', 'editedUser'],
    data() {
        return {
            allUsers: [],
            users: [],
            usernameSearch: '',
            checkAdmin: false,
            checkClient: false,
            dialog: false,
            editarDialog: false,
            message: '',
            showSnack: false,
            selectedUser: {}
        };
    },
    methods: {
        getUsers() {
            const url = process.env.VUE_APP_APIURL + "/users";
            this.axios.get(url)
                .then(response => {
                    if (response.status == 200 && response.data) {
                        this.allUsers = response.data
                        this.users = this.allUsers
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        },

        searchUser() {
            var searchedUsers = [];
            this.allUsers.forEach(user => {
                if (user.username.indexOf(this.usernameSearch.toLowerCase()) >= 0 && this.checkRol(user.rol)) {
                    console.log(user)
                    searchedUsers.push(user)
                }
            });
            this.users = searchedUsers;
            console.log(this.searchedUsers)
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

        postUsuariCreat(message) {
            this.refresh()
            this.showMessage(message)
        },

        showMessage(message) {
            this.message = message
            this.showSnack = true
        },

        editUser(user) {
            this.selectedUser = user
            this.editarDialog = true
        }
    },

    created() {
        if (!this.$store.getters.isAuthenticated || !this.$store.getters.isAdmin) {
            this.$router.push("/")
        }
        this.getUsers();
    }
};
</script>

<style scoped>
.search {
    margin: 50px 50px 0 50px;
}

.checks {
    display: flex;
    flex-direction: row;
}

.filter {
    max-width: 100%;
    padding-top: 0;
}

#checkClient {
    padding-bottom: 20px;
}

.textInput {
    padding-top: 0;
    padding-bottom: 0;
}

.list {
    margin: 0 50px 0 50px;
    border: 1px solid black;
}
</style>