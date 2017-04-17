import Vue from 'vue'
import Router from 'vue-router'

import LoginRoute from '../components/login/route'
import AdminUsersInfo from '../components/admin/user-info/route'
import AdminToolsInfo from '../components/admin/office-tools/route'
import AdminGiftsInfo from '../components/admin/gifts-info/route'
import AdminAccountInfo from '../components/admin/admin-info/route'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/login' },
    ...LoginRoute,
    ...AdminUsersInfo,
    ...AdminToolsInfo,
    ...AdminGiftsInfo,
    ...AdminAccountInfo
  ]
})
