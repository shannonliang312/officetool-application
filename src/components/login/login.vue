<template>
  <div style="position: relative;width:100%">
    <h1>登录</h1>
    <input type="text" placeholder="用户名" v-model="name">
    <input type="password" placeholder="密码" v-model="psw">
    <button class="customer-button" @click="onLogin">登录</button>
    <button class="customer-button" @click="onTest">测试 token</button>
  </div>
</template>

<script>
  import axios from 'axios'
  import { mapMutations } from 'vuex'

  export default {
    name: "login",
    data() {
      return {
        name: "",
        psw: ""
      }
    },
    methods: {      
      ...mapMutations(['loginSuccess', 'setAccountInfo']),
      onLogin() {
        // axios.post('/api/login', {
        //   name: this.name,
        //   psw: this.psw
        // })
        //   .then((res) => {
        //     console.log(res.data);
        //     sessionStorage.setItem("token", res.data.token);
        //   })
        this.loginSuccess();
        this.setAccountInfo({
          role: "admin",
          id: "58ec936292d549ee047b209a",
          name: "admin",
          displayName: "管理员"
        });
      },
      onTest() {
        let token = sessionStorage.getItem("token");
        
        axios.get('/api/testtoken', {
          headers: {
            "x-access-token": sessionStorage.getItem("token")
          }
        })
          .then((res) => {
            console.log(res.data);
          });
        // console.log(token);
      }
    }
  }
</script>
<style>
  h1 {
    margin-top: 200px;
    text-align: center;
  }

  input {
    display: block;
    outline: none;
    color: black;
    font-size: 2em;
    text-align: center;
    background-color: transparent;
    margin-top: 30px;
    margin-left: auto;
    margin-right: auto;
    width: 30%;
    border: 0;
    border-bottom: black 1px solid; 
  }

  .customer-button {
    display: block;
    padding: 5px 8px;
    width: 30%;
    margin-top: 30px;
    margin-left: auto;
    margin-right: auto;
    background-color: transparent;
    color: black;
    border-radius: 10%;
  }

  .customer-button:hover {
    cursor: pointer;
    box-shadow: 1px 1px 1px grey
  }
</style>