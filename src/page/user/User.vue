/* *@Description: *@ClassAuthor: Wang Xiao Gang *@Date: 2021-08-06 16:07:41 */
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
      <el-table
        :data="userlist"
        border
        stripe
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        :sortable="true"
        @sort-change="sortState"
        @selection-change="handleSelectionChange"
        style="width:100%"
        :span-method="objectSpanMethod"
        @current-change="onCurrentRow"
      >
        <!-- <el-table-column type="selection"></el-table-column> -->

        <el-table-column prop="username" align="center" label="姓名">
        </el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column prop="mobile" align="center" label="电话">
        </el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column
          label="状态"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
          prop="mg_state"
        >
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
              @click="alterUserList(scope.row.id)"
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
        :page-sizes="[1, 4, 6, 8, 20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户 -->
    <el-dialog
      title="添加用户"
      width="50%"
      :visible.sync="dialogVisible"
      @close="addDialogClosed"
    >
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

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
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
      cities: [
        {
          value: 'Beijing',
          label: '北京'
        },
        {
          value: 'Shanghai',
          label: '上海'
        },
        {
          value: 'Nanjing',
          label: '南京'
        },
        {
          value: 'Chengdu',
          label: '成都'
        },
        {
          value: 'Shenzhen',
          label: '深圳'
        },
        {
          value: 'Guangzhou',
          label: '广州'
        }
      ],
      selectValue: '',
      // 条件
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 1
      },
      value2: '', //日期
      // 总条数
      total: 0,
      // 列表数据
      userlist: [],
      userDate: '',
      // 控住弹窗
      dialogVisible: false,
      // 添加用户表单弹窗
      addRuleForm: {
        username: '', //用户名称
        password: '', //用户密码
        email: '', //邮箱
        mobile: '' //手机号
      },
      // 表格多选框选中的数据
      multipleSelection: [],
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
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  mounted() {
    this.userDate = '20210818'
    console.log('route', this.$router.currentRoute.fullPath)
    console.log('hahahahahha', this.userDate.indexOf('2021') !== -1)
    var a = 3,
      b = 4,
      c = false
    if ((5 > a && 5 > b) || c == true) {
      console.log('342""""')
    }
  },
  methods: {
    sortState({ prop, order }) {
      console.log('prop', { prop })
      console.log('order', { order })
      this.userlist.sort(this.compare(prop, order))
      // this.userlist.sort(function(a, b) {
      //   // debugger
      //   console.log('a', a)
      //   console.log('b', b)
      // })
    },
    compare(propertyName, sort) {
      return function(obj1, obj2) {
        console.log('obj1', obj1)
        console.log('obj2', obj2)
        var value1 = obj1[propertyName]
        var value2 = obj2[propertyName]

        console.log('wangxiaogang ')
        if (typeof value1 === 'string' && typeof value2 === 'string') {
          const res = value1.localeCompare(value2, 'zh')
          return sort === 'ascending' ? res : -res
        } else {
          if (value1 <= value2) {
            return sort === 'ascending' ? -1 : 1
          } else if (value1 > value2) {
            return sort === 'ascending' ? 1 : -1
          }
        }
      }
    },
    selectclick() {
      console.log('222', this.selectValue)
    },
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
      this.$store.commit('setdetailList', res.data.users)
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
    async alterUserList(id) {
      // console.log(id)
      const { data: res } = await this.$http.get('users/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败！')
      }
      console.log('res.data', res.data)
      this.editForm = res.data
      this.editDialogVisible = true
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
      // this.$refs.addFormRef.validate(async valid => {
      //   if (!valid) return
      //   var { data: res } = await this.$http.post('users', this.addRuleForm)
      //   if (res.meta.status !== 201) return this.$message.error('添加失败！')
      //   // 关闭对话框
      //   this.dialogVisible = false
      //   // 刷新数据列表
      //   this.getUserList()
      //   this.$message.success('添加成功')
      // })
      console.log(this.$refs.addFormRef.model)
      // this.$refs.addFormRef.validate(valid => {
      //   if (!valid) return
      //   this.$http.post('users', this.addRuleForm).then(res => {
      //     console.log('res', res.data)
      //     if (res.data.meta.status !== 201)
      //       return this.$message.error('添加失败！')
      //     // 关闭对话框
      //     this.dialogVisible = false
      //     // 刷新数据列表
      //     this.getUserList()
      //     this.$message.success('添加成功')
      //   })
      // })
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败！')
        }

        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$message.success('更新用户信息成功！')
      })
    },
    // 监听弹窗关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 监听弹窗关闭事件
    addDialogClosed() {
      console.log('1111', 1111)
      this.$refs.addFormRef.resetFields()
    },
    //选中表格事件
    handleSelectionChange(val) {
      console.log('bbb', val)
      this.multipleSelection = val
    },
    onCurrentRow(val) {
      console.log('cccc', val)
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 里面包含当前行row、当前列column、当前行号rowIndex、当前列号columnIndex四个属性,表格合并行和合并列
      // if (columnIndex === 0) {
      //   if (rowIndex % 3 === 0) {
      //     return {
      //       rowspan: 3,
      //       colspan: 1
      //     }
      //   } else {
      //     return {
      //       rowspan: 0,
      //       colspan: 0
      //     }
      //   }
      // }
    }
  }
}
</script>
<style scoped lang="less">
/* 写法一深度选择器 */
/deep/ .el-input__prefix {
  right: 0px;
  text-align: right;
}
/* 写法二深度选择器 */
// ::v-deep .el-input__prefix {
//   right: 0px;
//   text-align: right;
// }
/* 写法三 >>> 操作符 */
// >>> .el-input__prefix {
//   right: 0px;
//   text-align: right;
// }
/* 写法四 :deep() */
// :deep(.el-input__prefix) {
//   right: 0px;
//   text-align: right;
// }
</style>
