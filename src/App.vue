<template>
  <div id="app">
    <div id="bg"><img src="./assets/img/bg.jpg" alt=""></div>
    <header v-if="isLogin">
      <navbar-admin v-if="userInfo.role == 'admin'"></navbar-admin>
      <navbar-normal v-if="userInfo.role == 'normal'"></navbar-normal>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>
  import Login from './components/login/login.vue'
  import NavbarAdmin from './components/utils/navbar/navbar-admin.vue'
  import NavbarNormal from './components/utils/navbar/navbar-normal.vue'

  import { mapGetters } from 'vuex'

  export default {
    name: 'app',
    data() {
      return {
      }
    },
    computed: {
      ...mapGetters({
        isLogin: 'getLoginState'
      }),
      ...mapGetters({
        userInfo: 'getAccountInfo'
      })
    },
    components: {
      NavbarAdmin,
      NavbarNormal    
    }
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

  #bg {
    position:fixed;
    top:0;
    left:0;
    bottom:0;
    right:0;
    z-index:-999;
    opacity: 0.1;
  }

  #bg > img {
    height:100%;
    width:100%;
    border:0;
  }
</style>
