export default {
  state: {
    isLogin: JSON.parse(sessionStorage.getItem("isLogin"))
  },
  getters: {
    getLoginState(state) {
      return state.isLogin;
    }
  },
  mutations: {
    loginSuccess(state) {
      sessionStorage.setItem("isLogin", true);
      state.isLogin = true;
    },
    logoutSuccess(state) {
      sessionStorage.setItem("isLogin", false);
      state.isLogin = false;
    }
  },
  actions: {
    actLogin({ commit }) {
      commit("loginSuccess");
    },
    actLogout({ commit }) {
      commit("logoutSuccess");
    }
  }
}