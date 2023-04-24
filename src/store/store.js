import Vuex from "vuex";

export default new Vuex.Store({
  state: {
    user: {
      username: '',
      rol: ''
    },
    token: '',
    selectedUser: null
  },
  getters: {
    isAuthenticated(state) {
      return state.token != ""
    },

    isAdmin(state) {
      return state.user.rol == "Administrador"
    },

    getSelectedUser(state) {
      return state.selectedUser
    }
  },
  mutations: {
    setUser(state, user) {
      state.user.username = user.username;
      state.token = user.token;
      state.user.rol = user.rol;
    },

    logOut(state) {
      state.user.username = "";
      state.user.rol = "";
      state.token = "";
      state.selectedUser = null;
    },

    setSelectedUser(state, userId) {
      state.selectedUser = userId;
    }
  },
  actions: {
  },
  modules: {},
});
