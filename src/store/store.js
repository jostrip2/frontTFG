import Vuex from "vuex";

export default new Vuex.Store({
  state: {
    user: {
      username: '',
      email: '',
      numMobil: 0,
      rol: ''
    },
    token: ''
  },
  getters: {
    isAuthenticated(state) {
      return state.token != ""
    },

    isAdmin(state) {
      return state.user.rol == "Administrador"
    },
  },
  mutations: {
    setUser(state, user) {
      state.user.username = user.username;
      state.token = user.token;
      state.user.rol = user.rol;
    },

    logOut(state) {
      state.user.username = "";
      state.token = "";
    }
  },
  actions: {
  },
  modules: {},
});
