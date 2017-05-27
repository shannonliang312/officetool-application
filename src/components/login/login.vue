<template>
  <div class="login-box">
    <h1>登录</h1>
    <el-form ref="loginForm" :model="loginForm" :rules="rules">
      <el-form-item class="input-item" prop="name">
        <el-input v-model="loginForm.name">
          <template slot="append"><i class="fa fa-user" aria-hidden="true"></i></template>
        </el-input>
      </el-form-item>
      <el-form-item class="input-item" prop="psw">
        <el-input type="password" v-model="loginForm.psw" @keyup.native.enter="onLogin">
          <template slot="append"><i class="fa fa-lock" aria-hidden="true"></i></template>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="err-message" v-if="errFlag">{{errMessage}}</div>
    <button class="customer-button" @click="onLogin" >登录</button>
    <!--<button class="customer-button" @click="onTest">测试 token</button>-->
  </div>
</template>

<script>
  import axios from 'axios'
  import { mapMutations } from 'vuex'

  export default {
    name: "login",
    data() {
      return {
        errFlag: false,
        errMessage: "",
        loginForm: {
          name: "",
          psw: ""
        },
        rules: {
          name: [
            { required: true, message: "请输入用户名", trigger: 'blur' }
          ],
          psw: [
            { required: true, message: "请输入密码", trigger: 'blur' }
          ]
        }
      }
    },
    methods: {      
      ...mapMutations(['loginSuccess', 'setAccountInfo']),
      onLogin() {
        this.$refs["loginForm"].validate((valid) => {
          if(valid) {
            axios.post('/api/login', {
              name: this.loginForm.name,
              psw: this.loginForm.psw
            })
              .then((res) => {
                this.errMessage = "";
                this.errFlag = false;
                sessionStorage.setItem("token", res.data.token);
                this.setAccountInfo(res.data.payload);
                this.loginSuccess();
                
                if(res.data.payload.role == "admin") {
                  this.$router.push({path: '/admin/users-info'});
                } else {
                  this.$router.push({path: '/normal/user-tools-info'});
                }
                
              })
              .catch((err) => {
                if(err.response) {
                  this.errMessage = err.response.data.errMessage;
                  this.errFlag = true;
                }
              });
          }
        });        
      }      
    }
  }
</script>
<style>
  .login-box {
    position: relative;
    width: 25%;
    margin-top: 150px;
    margin-left: auto;
    margin-right: auto;
    padding: 20px 10px;
    border: 2px solid #ccc;
    box-shadow: 0 5px 5px #ccc
  }

  h1 {
    text-align: center;
    margin-bottom: 20px;
  }

  .input-item {
    width: 80%;
    margin: 0  auto;
  }

  .err-message {
    color: red;
    text-align: center;
  }

  .customer-button {
    display: block;
    padding: 5px 8px;
    width: 80%;
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
    background-color: transparent;
    color: black;
    border: 1px solid grey;
    border-radius: 5px;
  }

  .customer-button:hover {
    cursor: pointer;
    box-shadow: 0px 1px 4px grey
  }
</style>