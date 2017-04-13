export default {
  state: {
    accountInfo: JSON.parse(sessionStorage.getItem("accountInfo"))
  },
  getters: {
    getAccountInfo(state) {
      return state.accountInfo;
    }
  },
  mutations: {
    setAccountInfo(state, payload) {
      sessionStorage.setItem("accountInfo", JSON.stringify(payload));
      state.accountInfo = payload;
    }    
  }  
}