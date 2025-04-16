import { createStore } from "vuex";
import auth from "./modules/auth"; // Corrected to default import

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    auth, // Use the default import
  },
});
