<template>
  <nav class="fixed-navbar">
    <el-menu default-active="1" mode="horizontal"> 
      <el-menu-item index="1"><i class="fa fa-id-card-o" aria-hidden="true"></i>用户信息</el-menu-item>
      <el-menu-item index="2"><i class="fa fa-pencil" aria-hidden="true"></i>办公用品信息</el-menu-item>
      <el-menu-item index="3"><i class="fa fa-gift" aria-hidden="true"></i>生日礼物信息</el-menu-item>
      <el-submenu index="4" style="float: right">        
        <template slot="title"><i class="fa fa-user" aria-hidden="true"></i>admin</template>
        <el-menu-item index="4-1"><i class="fa fa-info-circle" aria-hidden="true"></i>账户详情</el-menu-item>
        <el-menu-item index="4-2"><i class="fa fa-sign-out" aria-hidden="true"></i>退出</el-menu-item>
      </el-submenu>
    </el-menu>
  </nav>
</template>

<script>
  export default {
    name: "navbar",

  }
</script>

<style >
  .fixed-navbar{
    z-index: 9999;
    width: 100%;
    position: fixed;
    top: 0;
    /*margin-bottom: 10px;*/
    opacity: 1;
    box-shadow: 1px 1px 5px #888888;
  }

  i {
    margin-right: 5px;
  }
</style>