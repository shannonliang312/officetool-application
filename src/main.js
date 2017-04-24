// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import './assets/css/styles.css'
import store from './store'

import ElementUI from 'element-ui'

import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI);

Vue.config.productionTip = false

/* 拦截路由 */
router.beforeEach((to, from, next) => {
  if(to.fullPath == "/login") {  //如果为登录页面，直接放行
    next();
  } else {
    if(!store.state.login.isLogin) {      
      next({path: '/login'});  //如果是非登录页面且登录状态为false，则跳转到登录页面
    } else {
      if(to.meta.requireAdmin) {
        if(store.state.account.accountInfo.role == "admin") {
          next();
        } else {
          next({path: '/login'}); //如果非admin用户访问了admin的路由，则跳转到登录页
        }
      } else {
        if(store.state.account.accountInfo.role != "admin") {
          next();
        } else {
          next({path: '/login'}); //如果admin用户访问了非admin的路由，则跳转到登录页
        }
      }      
    }  
  }
  
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store
})
