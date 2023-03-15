<template>
    <div class="login">
        <div>
            <form @submit.prevent="login">
                <div>
                    <label for="username">Username:</label>
                    <input type="text" name="username" v-model="user.username" />
                </div>
                <div>
                    <label for="password">Password:</label>
                    <input type="password" name="password" v-model="user.password" />
                </div>
                <button type="submit">Login</button>
            </form>
            <p v-if="showError" id="error">Username or Password is incorrect</p>
            <p>{{ response }}</p>
        </div>
    </div>
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
            let url = "http://localhost:8080/users/login";
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

label {
    padding: 12px 12px 12px 0;
    display: inline-block;
}

button[type=submit] {
    background-color: #4CAF50;
    color: white;
    padding: 12px 20px;
    cursor: pointer;
    border-radius: 30px;
}

button[type=submit]:hover {
    background-color: #45a049;
}

input {
    margin: 5px;
    box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
    padding: 10px;
    border-radius: 30px;
}

#error {
    color: red;
}
</style>