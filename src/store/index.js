import Vuex from "vuex";
import axios from "axios";

export default new Vuex.Store({
  state: {
    user: {
      username: "",
      email: "",
    },
  },
  getters: {},
  mutations: {
    CURRENT_USER_FETCH(state, user) {
      state.user.username = user.username;
      state.user.email = user.email;
    },
  },
  actions: {
    async initialLoad(context) {
      if (localStorage.token) {
          axios.defaults.headers.common.Authorization = "Bearer ${localStorage.token}";
          const res = await axios.get("/api/auth/currentUser");
          context.commit("CURRENT_USER_FETCH", res.data.user);
      }
    },
  },
  modules: {}, 
});
