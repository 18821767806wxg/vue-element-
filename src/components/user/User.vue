<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <template #append>
              <!-- slot="append" -->
              <el-button icon="el-icon-search" @click="getUserList"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button class="button" type="primary">操作按钮</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="handleSwitch(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190px">
          <template #default="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="info"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 4, 6]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 条件
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      // 总条数
      total: 0,
      // 列表数据
      userlist: []
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 用户数据列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 修改用户状态
    async handleSwitch(data) {
      console.log('888', data)
      const { data: res } = await this.$http.put(
        `users/${data.id}/state/${data.mg_state}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改用户状态失败！')
      }
      this.$message.success('修改用户状态成功！')
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(pagesize) {
      console.log('88888', pagesize)
      this.queryInfo.pagesize = pagesize
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(value) {
      console.log('99999', value)
      this.queryInfo.pagenum = value
      this.getUserList()
    }
  }
}
</script>
