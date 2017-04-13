import Vue from 'vue'
import Vuex from 'vuex'
import Promise from 'promise-polyfill'

import login from './login'
import account from './account'

/* 兼容IE */
if (!window.Promise) {
  window.Promise = Promise;
  // console.log("polifill");
}

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production', //在非生产环境下，使用严格模式
  modules: {
    login,
    account
  }
})