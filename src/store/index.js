import Vuex from "vuex";
import axios from "axios";
import auth from './modules/auth';

export default new Vuex.Store({
  state: {
    user: {
      id: "",
      username: "",
    },
  },
  getters: {},
  mutations: {
    CURRENT_USER_FETCH(state, user) {
      state.user.id = user.id;
      state.user.username = user.username;
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
  modules: { auth },
});
