import Vuex from "vuex";

export default new Vuex.Store({
  state: {
    user: {
      username: "",
      token: "",
      rol: ""
    },
    apiUrl: "https://fisioapi.onrender.com/api",
    apiUrlDev: "http://localhost:3000/api",
    frontUrl: "https://fisiofront.onrender.com",
    frontUrlDev: "http://localhost:8080"
  },
  getters: {
    isAuthenticated(state) {
      return state.user.token != ""
    },

    isAdmin(state) {
      return state.user.rol == "admin"
    },
  },
  mutations: {
    setUser(state, user) {
      state.user.username = user.username;
      state.user.token = user.token;
      state.user.rol = user.rol;
    },

    logOut(state) {
      state.user.username = "";
      state.user.token = "";
    }
  },
  actions: {
  },
  modules: {},
});
