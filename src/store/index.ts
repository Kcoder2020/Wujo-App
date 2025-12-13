import { createStore } from "vuex";
import auth from "./modules/auth"; // Corrected to default import
import iqubs from "./modules/iqubs";
import member from "./modules/member";
import memberPayments from "./modules/memberPayments";

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    auth, // Use the default import
    iqubs,
    member,
    memberPayments,
  },
});
