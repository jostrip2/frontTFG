<template>
    <section>
        <div class="container">
            <form @submit.prevent="login">
                <h2>Login</h2>
                <div class="inputbox">
                    <input type="text" name="username" v-model="user.username" />
                    <label for="username">Username</label>
                </div>
                <div class="inputbox">
                    <input type="password" name="password" v-model="user.password" />
                    <label for="password">Password</label>
                </div>
                <button>Login</button>
            </form>
        </div>
        <p v-if="showError" id="error">Username or Password is incorrect</p>
    </section>
</template>

<script>
export default {
    name: "Login",
    components: {},
    data() {
        return {
            user: {
                username: "user1",
                password: "pass"
            },
            showError: false
        };
    },
    methods: {
        login() {
            //let url = process.env.VUE_APP_API_URL + "/users/signIn";
            const url = "http://localhost:8080/users/signIn";
            this.axios.post(url, this.user, {
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
            })
                .then(response => {
                    if (response.status == 200 && response.data) {
                        this.$router.push("/home")
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.showError = true
                })
        },
    },
};
</script>

<style scoped>
* {
    box-sizing: border-box;
}

section {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    width: 100%;
}

.container {
    position: relative;
    width: 400px;
    height: 400px;
    border: 2px solid;
    display: flex;
    justify-content: center;
    align-items: center;
}

h2 {
    font-size: 2em;
    text-align: center;
}

.inputbox {
    position: relative;
    margin: 30px 0;
    width: 310px;
    border-bottom: 2px solid;
}

.inputbox label {
    position: absolute;
    top: 50%;
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
}

#error {
    color: red;
}
</style>