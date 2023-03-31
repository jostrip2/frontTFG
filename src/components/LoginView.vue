<template>
    <section>
        <div class="container">
            <div class="contForm">
                <form @submit.prevent="login">
                    <h2>Iniciar sessió</h2>
                    <div class="inputbox">
                        <v-text-field v-model="user.username" type="text" label="Nom d'usuari"
                            variant="underlined"></v-text-field>
                    </div>
                    <div class="inputbox">
                        <v-text-field v-model="user.password" type="password" label="Contrasenya"
                            variant="underlined"></v-text-field>
                    </div>
                    <button>Entrar</button>
                </form>
            </div>
            <!-- <p v-if="showError" class="error">Nom d'usuari o contrasenya incorrectes</p> -->

        </div>
        <PMessage v-if="showError" severity="error" @close="showError = false">Nom d'usuari o contrasenya incorrectes
        </PMessage>
    </section>
</template>

<script>
export default {
    name: "LoginView",
    components: {},
    data() {
        return {
            user: {
                username: "",
                password: ""
            },
            showError: false
        };
    },
    methods: {
        login() {
            const url = process.env.VUE_APP_APIURL + "/users/signIn";
            this.axios.post(url, this.user)
                .then(response => {
                    if (response.status == 200 && response.data.token && response.data.rol) {
                        const user = {
                            username: this.user.username,
                            token: response.data.token,
                            rol: response.data.rol
                        }
                        this.$store.commit('setUser', user)
                        if (user.rol == 'Administrador') {
                            this.$router.push("/users")
                        }
                        else {
                            this.$router.push("/home")
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.user.password = ""
                    this.showError = true
                })
        },
    },
};
</script>

<style scoped>
section {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 100%;
    background: url('../assets/background.jpg');
    background-position: center;
    background-size: 100% 100%;
}

.container {
    position: relative;
    width: 400px;
    height: 300px;
    background: transparent;
    border-radius: 20px;
    backdrop-filter: blur(10px);
    border: 2px solid;

    justify-content: center;
    align-items: center;
    border: solid #fff;
}

h2 {
    font-size: 2em;
    text-align: center;
    color: #fff;
}

.contForm {
    margin-top: 20px;
    justify-content: center;
    align-items: center;
    display: flex;
}

v-text-field {
    color: #fff;
}

.inputbox {
    position: relative;
    margin: 10px 0;
    width: 310px;
    color: #fff;
}

.inputbox label {
    position: absolute;
    top: 60%;
    left: 5px;
    transform: translateY(-50%);
    pointer-events: none;
    transition: .5s;
}

input:focus~label,
input:valid~label {
    top: -5px;
}

.inputbox input {
    width: 100%;
    height: 50px;
    padding: 0 35px 0 5px;
    border: none;
    outline: none;
    background: transparent;
    color: #fff;
}

.inputbox label {
    color: #fff
}

button {
    width: 100%;
    height: 40px;
    border-radius: 40px;
    border: none;
    outline: none;
    cursor: pointer;
    font-size: 1em;
    font-weight: 600;
    color: #fff;
}

.error {
    position: relative;
    margin-top: 10px;
    color: rgb(255, 0, 0);
}
</style>