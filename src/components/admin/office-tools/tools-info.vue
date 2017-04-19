<template>
  <div class="router-box">
    <div class="router-box-header">
      办公用品信息
    </div>
    <div class="router-box-body">
      <el-button type="primary" style="margin-bottom: 10px;" @click="addOfficeTool">添加</el-button>
      <el-table :data="currentPageData" border style="width: 100%;" class="table">
        <el-table-column prop="item" label="名称" width="550"></el-table-column>
        <el-table-column prop="price" label="单价"></el-table-column>
        <el-table-column prop="unit" label="单位"></el-table-column>
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
        <el-form-item label="单价:" prop="price">
          <el-input v-model="currentEditedData.price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="单位:" prop="unit">
          <el-input v-model="currentEditedData.unit"></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="comment">
          <el-input v-model="currentEditedData.comment"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" style="margin-left: 35px" @click="updateTool">提交</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import axios from 'axios'
  import { handleAuthFail } from'../../../service/utils/utils'

  export default {
    name: "tools-info",
    data() {
      let validatePrice = function(rule, value, callback) {
        if(!value) {
          callback(new Error("请正确输入物品价格"));
        } else if(typeof(+value) != 'number')  {
          callback(new Error("请正确输入物品价格"));
        } else {
          callback();
        }
      };

      return {
        toolsData: [],
        currentPageData: [],
        dataNum: 0,
        currentPage: 1,
        dialogVisible: false,
        dialogType: "",
        dialogFormData: {},
        currentEditedData: {},
        newToolData: {},
        formRules: {
          _id: [
            {required: true}
          ],
          item: [
            { required: true, type: 'string', message: "物品名称不能为空", trigger: "blur" }
          ],
          price: [
            { required: true, validator: validatePrice, trigger: "blur" }
          ],
          unit: [
            { required: true, type: 'string', message: "请正确输入物品单位", trigger: "blur" }
          ]
        }
      }
    },
    created() {
      let token = sessionStorage.getItem("token");
      axios.get('/api/admin/office-tool', {
        headers: {
          "x-access-token": token
        }
      })
        .then((res) => {
          this.toolsData = res.data;
          this.dataNum = this.toolsData.length;
          this.currentPageData = this.toolsData.slice(0, 10);
        }).catch((err) => {
          if(err) {
            handleAuthFail.call(this, err.response);
            
          }
        });

    },
    computed: {
      ...mapGetters({ accountInfo: "getAccountInfo" }),
      dialogTitle() {
        let title =  "";
        if(this.dialogType == "EDIT") {
          title = "办公用品编辑";
        } else if(this.dialogType == "ADD") {
          title = "办公用品添加";
        }

        return title;
      }
    },
    methods: {
      pageChange(page) {
        this.currentPage = page;
        let start = (page - 1) * 10;
        let end = start + 10;
        this.currentPageData = this.toolsData.slice(start, end);
      },
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
          axios.delete("/api/admin/office-tool", {
            params: {
              _id: row._id
            },
            headers: {
              "x-access-token": sessionStorage.getItem("token")
            }
          }).then((res) => {
               axios.get('/api/admin/office-tool', {
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
      addOfficeTool() {
        this.dialogType = "ADD";
        this.currentEditedData = {};
        this.dialogVisible = true;
      },
      updateTool() {
        if(this.dialogType == "EDIT") {
          this.$refs["dialogForm"].validate((valid) => {
            if(valid) {
              axios.put("/api/admin/office-tool", this.currentEditedData, {
                headers: {
                  "x-access-token": sessionStorage.getItem("token")
                }
              }).then((res) => {
                  this.dialogVisible = false;            

                  return axios.get('/api/admin/office-tool', {
                            headers: {
                              "x-access-token": sessionStorage.getItem("token")
                            }
                        })
                }).then((res) => {
                  this.toolsData = res.data;
                  this.dataNum = this.toolsData.length;

                  let start = (this.currentPage - 1) * 10;
                  let end = start + 10;
                  this.currentPageData = this.toolsData.slice(start, end);

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
              axios.post("/api/admin/office-tool", this.currentEditedData, {
                headers: {
                  "x-access-token": sessionStorage.getItem("token")
                }
              }).then((res) => {
                  this.dialogVisible = false;            

                  return axios.get('/api/admin/office-tool', {
                            headers: {
                              "x-access-token": sessionStorage.getItem("token")
                            }
                        })
                }).then((res) => {
                  this.toolsData = res.data;
                  this.dataNum = this.toolsData.length;

                  let start = (this.currentPage - 1) * 10;
                  let end = start + 10;
                  this.currentPageData = this.toolsData.slice(start, end);

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

  .router-box-body  .el-table{
    background-color: transparent;
  }
</style>