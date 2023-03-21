import Vuex from "vuex";
import auth from './modules/auth';

export default new Vuex.Store({
  state: {
    user: {
      username: "",
      token: "",
      rol: ""
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.user.token != ""
    },

    isAdmin(state) {
      return state.user.rol == "admin"
    },

    getToken(state) {
      return state.user.token
    }
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
  modules: { auth },
});
