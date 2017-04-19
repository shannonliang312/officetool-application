<template>
  <div class="router-box">
    <div class="router-box-header">
      生日礼物信息
    </div>
    <div class="router-box-body">
      <el-button type="primary" style="margin-bottom: 10px;" @click="addGift">添加</el-button>
      <el-table :data="currentPageData" border style="width: 100%;" class="table">
        <el-table-column prop="item" label="名称" width="400"></el-table-column>
        <el-table-column prop="comment" label="描述" width="600"></el-table-column>
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
      <el-form :model="currentEditedData" ref="dialogForm" :rules="formRules" label-width="80px">
        <el-form-item label="编号:" prop="_id" v-if="dialogType == 'EDIT'">
          <el-input v-model="currentEditedData._id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="名称:" prop="item">
          <el-input v-model="currentEditedData.item"></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="comment">
          <el-input v-model="currentEditedData.comment" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" style="margin-left: 35px" @click="updateGift">提交</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import axios from'axios'
  import { handleAuthFail } from'../../../service/utils/utils'
  
  export default {
    name: "gifts-info",
    data() {
      return {
        currentPageData: [],
        giftData: [],
        dataNum: 0,
        currentPage: 1,
        dialogVisible: false,
        dialogType: "",
        dialogFormData: {},
        currentEditedData: {},
        formRules: {
          _id: [
            {required: true}
          ],
          item: [
            { required: true, type: 'string', message: "礼物名称不能为空", trigger: "blur" }
          ],
          comment: [
            { required: true, type: 'string', message: "礼物描述不能为空", trigger: "blur" }
          ],          
        }
      }
    },
    computed: {
      dialogTitle() {
        let title =  "";
        if(this.dialogType == "EDIT") {
          title = "生日礼物编辑";
        } else if(this.dialogType == "ADD") {
          title = "生日礼物添加";
        }

        return title;
      }
    },
    created() {
      let token = sessionStorage.getItem("token");
      axios.get('/api/admin/birthday-gift', {
        headers: {
          "x-access-token": token
        }
      })
        .then((res) => {
          console.log(res.data);
          this.giftData = res.data;
          this.dataNum = this.giftData.length;
          this.currentPageData = this.giftData.slice(0, 10);

        }).catch((err) => {
          if(err) {
            handleAuthFail.call(this, err.response);
            
          }
        });
    },
    methods: {
      editRow(index, row) {
        this.dialogType = "EDIT";
        this.currentEditedData = JSON.parse(JSON.stringify(row));//深拷贝
        this.dialogVisible = true;
      },
      deleteRow(index, row) {
        this.$confirm("此操作将删除该条目，是否继续？", "警告", {
          confirmButtonText: "确定",
          type: "warning"
        }).then(() => {
          axios.delete("/api/admin/birthday-gift", {
            params: {
              _id: row._id
            },
            headers: {
              "x-access-token": sessionStorage.getItem("token")
            }
          }).then((res) => {
               axios.get('/api/admin/birthday-gift', {
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
      pageChange(page) {
        this.currentPage = page;
        let start = (page - 1) * 10;
        let end = start + 10;
        this.currentPageData = this.giftData.slice(start, end);
      },
      addGift() {
        this.dialogType = "ADD";
        this.currentEditedData = {};
        this.dialogVisible = true;
      },
      updateGift() {
        if(this.dialogType == "EDIT") {
          this.$refs["dialogForm"].validate((valid) => {
            if(valid) {
              axios.put("/api/admin/birthday-gift", this.currentEditedData, {
                headers: {
                  "x-access-token": sessionStorage.getItem("token")
                }
              }).then((res) => {
                  this.dialogVisible = false;            

                  return axios.get('/api/admin/birthday-gift', {
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
              axios.post("/api/admin/birthday-gift", this.currentEditedData, {
                headers: {
                  "x-access-token": sessionStorage.getItem("token")
                }
              }).then((res) => {
                  this.dialogVisible = false;            

                  return axios.get('/api/admin/birthday-gift', {
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
        
      }
    },
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