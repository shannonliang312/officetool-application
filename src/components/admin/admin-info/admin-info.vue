<template>
  <div class="router-box">
    <div class="router-box-header">
      管理员账户信息
    </div>
    <div class="router-box-body">
      <el-form :model="adminForm" ref="adminForm" :rules="formRule" label-width="100px"> 
        <el-form-item label="用户名：" > 
          <el-input class="form-input" v-model="adminForm.name" :disabled="true" ></el-input>
        </el-form-item>
        <el-form-item label="显示名称："> 
          <el-input class="form-input" v-model="adminForm.displayName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色："> 
          <el-input class="form-input" v-model="adminForm.role" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email"> 
          <el-input class="form-input" v-model="adminForm.email"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPsw"> 
          <el-input class="form-input" v-model="adminForm.newPsw" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="checkNewPsw"> 
          <el-input class="form-input" v-model="adminForm.checkNewPsw" type="password"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" style="margin-left: 100px;" @click="updateInfo">修改</el-button>
    </div>
  </div>
</template>

<script>
  import axios from'axios'
  import { mapMutations } from'vuex'
  import { handleAuthFail } from'../../../service/utils/utils'

  export default {
    name: "admin-info",
    data () {
      let self = this;
      let validateNewPsw = (rule, value, cb) => {
        let reg = /^(\w){6,20}$/;

        if(!value) {
          cb(new Error("请输入新密码"));
        } else {
          if(!reg.test(value)) {
            cb(new Error("只能输入6-20个字母、数字、下划线"))
          } else {
            cb();
          }
          
        }
      };
      let validateNewRepPsw = (rule, value, cb) => {
        if(!value) {
          cb(new Error("请再次输入新密码"));
        } 
        else {
          if(value != this.adminForm.newPsw) {
            cb(new Error("两次输入的密码不一致"));
          }
        }
        cb();
      };
      return {
        adminForm: {},
        checkPsw: "",
        formRule: {
          email: [
            { required: true }
          ],
          newPsw: [
            { required: true, validator: validateNewPsw,  trigger: "blur" }
          ],
          checkNewPsw: [
            { required: true, validator: validateNewRepPsw, trigger: "blur" }
          ]
        }
      }
    },
    created() {
      axios.get('/api/admin/info', {
        headers: {
          "x-access-token": sessionStorage.getItem("token")
        }
      })
        .then((res) => {
          this.adminForm = res.data;

        })
        .catch((err) => {
          if(err.response) {
            handleAuthFail.call(this, err.response);
          }
        });
    },
    methods: {
      ...mapMutations(["logoutSuccess"]),
      updateInfo() {
        this.$refs["adminForm"].validate((valid) => {
          let body = {
            _id : this.adminForm._id,
            email: this.adminForm.email,
            psw: this.adminForm.newPsw
          };
          axios.put("/api/admin/info", body, {
            headers: {
              "x-access-token": sessionStorage.getItem("token")
            }
          })
            .then((res) => {
              this.$notify({
                type: "success",
                title: "成功！",
                message: "修改成功, 请重新登录"
              });
              setTimeout(() => {
                sessionStorage.removeItem("token");
                this.$router.push({path: "/login"});
                this.logoutSuccess();
              }, 2000);
              
            })
            .catch((err) => {
              if(err.response) {
                handleAuthFail.call(this, err.response);
              }
            });
        });
        
      }
    }
  }
</script>

<style>
  .form-input {
    width: 30%;
  }
</style>