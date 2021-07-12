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
          <el-button class="button" type="primary" @click="addUsers"
            >添加用户</el-button
          >
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
              @click="alterUserList(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserList(scope.row)"
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

    <!-- 增加用户按钮 -->
    <el-dialog title="添加用户" width="60%" :visible.sync="dialogVisible">
      <el-form
        ref="addFormRef"
        :model="addRuleForm"
        label-width="100px"
        class="demo-ruleForm"
        :rules="addRule"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addRuleForm.username"></el-input>
        </el-form-item>

        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addRuleForm.password" type="password"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addRuleForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addRuleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 验证邮箱规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
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
      userlist: [],
      // 控住弹窗
      dialogVisible: false,
      // 添加用户表单弹窗
      addRuleForm: {
        username: '', //用户名称
        password: '', //用户密码
        email: '', //邮箱
        mobile: '' //手机号
      },
      addRule: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
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
    },
    // 修改用户数据
    alterUserList(data) {
      console.log('888888tttt', data)
    },
    // 删除用户数据
    async deleteUserList(datas) {
      console.log('删除', datas)
      const { data: res } = await this.$http.delete(`users/${datas.id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户信息失败！')
      }
      this.$message.success('修改用户信息成功！')
      this.getUserList()
    },
    addUsers() {
      console.log('180')
      this.dialogVisible = true
    },
    // 增加弹窗确认按钮
    addSubmit() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        var { data: res } = await this.$http.post('users', this.addRuleForm)
        if (res.meta.status !== 201) return this.$message.error('添加失败！')
        this.$message.success('添加成功')
        this.dialogVisible = false
        this.getUserList()
      })
    }
  }
}
</script>
