<template>
  <nav class="fixed-navbar">
    <el-menu default-active="/admin/users-info" mode="horizontal" @select="handleSelect"> 
      <el-menu-item index="/admin/users-info"><i class="fa fa-id-card-o" aria-hidden="true"></i>用户信息</el-menu-item>
      <el-menu-item index="/admin/tools-info"><i class="fa fa-pencil" aria-hidden="true"></i>办公用品信息</el-menu-item>
      <el-menu-item index="/admin/gifts-info"><i class="fa fa-gift" aria-hidden="true"></i>生日礼物信息</el-menu-item>
      <el-submenu index="4" style="float: right; margin-right: 30px">        
        <template slot="title"><i class="fa fa-user" aria-hidden="true"></i>{{accountInfo.displayName}}</template>
        <el-menu-item index="/admin/admin-info"><i class="fa fa-info-circle" aria-hidden="true"></i>账户详情</el-menu-item>
        <el-menu-item index="logout"><i class="fa fa-sign-out" aria-hidden="true"></i>退出</el-menu-item>
      </el-submenu>
    </el-menu>
  </nav>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { mapGetters } from 'vuex'

  export default {
    name: "navbar-admin",
    computed: {
      ...mapGetters({
        accountInfo: "getAccountInfo"
      })
    },
    methods: {
      ...mapMutations(['logoutSuccess', 'setAccountInfo']),
      handleSelect(key, keyPath) {
        if("logout" == key) {
          this.logoutSuccess();
          this.setAccountInfo({});
          this.$router.push({path: '/login'});
        } else {
          this.$router.push({path: key});
        }        
      }
    }

  }
</script>

<style >
  .fixed-navbar{
    z-index: 9;
    width: 100%;
    position: fixed;
    top: 0;
    /*margin-bottom: 10px;*/
    opacity: 1;
    box-shadow: 0px 2px 5px #888888;
  }

  i {
    margin-right: 5px;
  }
</style>