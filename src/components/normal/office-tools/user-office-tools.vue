<template>
  <div class="router-box">
    <div class="router-box-header">
      办公用品申请
    </div>
    <div class="router-box-body">
      <el-button type="primary" style="margin-bottom: 10px;">提交</el-button>
      <el-table :data="currentPageData" border style="width: 100%;" class="table">
        <el-table-column prop="index" label="序号"></el-table-column>
        <el-table-column prop="item" label="名称"></el-table-column>
        <el-table-column prop="price" label="单价"></el-table-column>
        <el-table-column prop="unit" label="单位"></el-table-column>
        <el-table-column prop="amount" label="数量"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import { httpService } from '../../../service/utils/httpService'

  export default {
    name: "user-office-tools",
    data() {
      return {
        currentPageData: [],

      }
    },
    created() {
      httpService.get('/api/user/office-tool-data')
        .then((res) => {
          console.log(res.data);
        })
    }
  }
</script>