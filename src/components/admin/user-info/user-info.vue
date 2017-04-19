<template>
  <div class="router-box">
    <div class="router-box-header">
      用户信息
    </div>
    <div class="router-box-body">
      <el-button type="primary" style="margin-bottom: 10px;" @click="addUser">添加</el-button>
      <el-table :data="currentPageData" border style="width: 100%;" class="table">
        <el-table-column prop="name" label="用户名" ></el-table-column>
        <el-table-column prop="displayName" label="显示名称"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column prop="birthday" label="生日">
          <template scope="scope">
            {{ scope.row.birthday.slice(0, 10)}}
          </template>
        </el-table-column>                
        <el-table-column  label="操作">
          <template scope="scope">
            <el-button size="small" @click="editRow(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination small layout="prev,pager,next" :total="dataNum" @current-change="pageChange"></el-pagination>
      </div>
    </div>
    <el-dialog :title="dialogTitle" v-model="dialogVisible">
      <el-form :model="currentEditedData" ref="dialogForm" :rules="formRules" label-width="100px">
        <el-form-item label="编号:" prop="_id" v-if="dialogType == 'EDIT'">
          <el-input v-model="currentEditedData._id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用户名:" prop="name">
          <el-input v-model="currentEditedData.name"></el-input>
        </el-form-item>
        <el-form-item label="默认密码:" prop="psw" v-if="dialogType == 'ADD'">
          <el-input v-model="currentEditedData.psw" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="显示名称:" prop="displayName">
          <el-input v-model="currentEditedData.displayName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="currentEditedData.email"></el-input>
        </el-form-item>
        <el-form-item label="角色:" prop="role">
          <el-input v-model="currentEditedData.role" type="text" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="生日:" prop="birthday">
          <el-date-picker type="date" placeholder="选择日期" v-model="currentEditedData.birthday">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <el-button type="primary" style="margin-left: 35px" @click="updateUser">提交</el-button>
    </el-dialog>
  </div>
    </div>
  </div>
</template>

<script>
  import axios from'axios'
  import { handleAuthFail } from'../../../service/utils/utils'

  export default {
    name: "users-info",
    data() {
      let checkEmail = (rule, value, cb) => {
        if(!value) {
          return cb(new Error("邮箱不能为空"));
        } else {
          let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

          if(!re.test(value)) {
            return cb(new Error("邮箱格式不正确"));
          }
        }

        return cb();
      };

      return {
        currentPageData: [],
        userData: [],
        dataNum: 0,
        currentPage: 1,
        dialogVisible: false,
        dialogType: "",
        dialogFormData: {},
        currentEditedData: {},
        formRules: {
          _id: [
            { required: true }
          ],
          name: [
            { required: true, type: 'string', message: "用户名不能为空", trigger: "blur" }
          ],
          displayName: [
            { required: true, type: 'string', message: "显示名称不能为空", trigger: "blur" }
          ],
          psw: [
            { required: true }
          ],
          email: [
            { required: true, validator: checkEmail, trigger: "blur" }
          ], 
          role: [
            { required: true, type: 'string', message: "角色不能为空", trigger: "blur" }
          ],
          birthday: [
            { required: true, type: "date", message: "生日不能为空", trigger: "blur" }
          ],          
        }
      }
    },
    computed: {
      dialogTitle() {
        let title =  "";
        if(this.dialogType == "EDIT") {
          title = "用户编辑";
        } else if(this.dialogType == "ADD") {
          title = "添加新用户";
        }

        return title;
      }
    },
    created () {
      let token = sessionStorage.getItem("token");
      axios.get('/api/admin/user', {
        headers: {
          "x-access-token": token
        }
      })
        .then((res) => {
          console.log(res.data);
          this.userData = res.data;
          this.dataNum = this.userData.length;
          this.currentPageData = this.userData.slice(0, 10);

        }).catch((err) => {
          if(err) {
            handleAuthFail.call(this, err.response);
            
          }
        });
    },
    methods: {
      editRow(index, row) {

      },
      deleteRow(index, row) {
        this.$confirm("此操作将删除该用户，是否继续？", "警告", {
          confirmButtonText: "确定",
          type: "warning"
        }).then(() => {
          axios.delete("/api/admin/user", {
            params: {
              _id: row._id
            },
            headers: {
              "x-access-token": sessionStorage.getItem("token")
            }
          }).then((res) => {
               axios.get('/api/admin/user', {
                  headers: {
                    "x-access-token": sessionStorage.getItem("token")
                  }
               }).then((res) => {
                  this.toolsData = res.data;
                  this.dataNum = this.toolsData.length;

                  let start = (this.currentPage - 1) * 10;
                  let end = start + 10;
                  this.currentPageData = this.toolsData.slice(start, end);

                  this.$notify.success({
                    title: "成功",
                    message: "删除成功！"
                  });
                }).catch((err) => {
                  if(err) {
                    handleAuthFail.call(this, err.response);
                  }
                })
          }).catch(() => {});
        });        
      },
      addUser() {
        this.dialogType = "ADD";
        this.currentEditedData = {role: "normal", psw: "123456", birthday: ''};
        this.dialogVisible = true;
      },
      updateUser() {
        if(this.dialogType == "EDIT") {
          this.$refs["dialogForm"].validate((valid) => {
            if(valid) {
              axios.put("/api/admin/user", this.currentEditedData, {
                headers: {
                  "x-access-token": sessionStorage.getItem("token")
                }
              }).then((res) => {
                  this.dialogVisible = false;            

                  return axios.get('/api/admin/user', {
                            headers: {
                              "x-access-token": sessionStorage.getItem("token")
                            }
                        })
                }).then((res) => {
                  this.giftData = res.data;
                  this.dataNum = this.giftData.length;

                  let start = (this.currentPage - 1) * 10;
                  let end = start + 10;
                  this.currentPageData = this.giftData.slice(start, end);

                  this.$notify.success({
                    title: "成功",
                    message: "修改成功！"
                  });
                  
                }).catch((err) => {
                  if(err.response) {
                    handleAuthFail.call(this, err.response);
                  }
                });
            }
          });
          
        } else if(this.dialogType == "ADD") {
          this.$refs["dialogForm"].validate((valid) => {
            if(valid) {
              axios.post("/api/admin/user", this.currentEditedData, {
                headers: {
                  "x-access-token": sessionStorage.getItem("token")
                }
              }).then((res) => {
                  this.dialogVisible = false;            

                  return axios.get('/api/admin/user', {
                            headers: {
                              "x-access-token": sessionStorage.getItem("token")
                            }
                        })
                }).then((res) => {
                  this.giftData = res.data;
                  this.dataNum = this.giftData.length;

                  let start = (this.currentPage - 1) * 10;
                  let end = start + 10;
                  this.currentPageData = this.giftData.slice(start, end);

                  this.$notify.success({
                    title: "成功",
                    message: "添加成功！"
                  });
                }).catch((err) => {
                  if(err.response) {
                    handleAuthFail.call(this, err.response);
                  }
                });
            }
          });
        }
        
      },
      pageChange() {

      }
    }
  }
</script>

<style>
  .pagination {
    margin-top: 20px;
    text-align: right;
  }

  .dialog-form {
    width: 70%;
    margin: 0 auto;
  }
</style>