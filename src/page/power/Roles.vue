<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      <h1>{{ isActive }}11111</h1>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesVisible = true"
            >添加角色</el-button
          >
          <div class="phoneNumber">
            <div
              v-for="(data, index) in keepList"
              :key="data"
              style="height:80px;"
              class="content"
            >
              <div class="person">
                <span class="index">{{ keepList.length - index }}</span>
              </div>
              <div style="margin-left:30px;">
                :天{{ index }}
                的归属于该i多喝水更好地说的就是就活动介绍还记得时间段和北京市江湖再见
              </div>
            </div>
            <!-- <div style="height: 300px;">
              <el-steps
                direction="vertical"
                :active="codeIndex"
                process-status="success"
                :simple="true"
              >
                <el-step title="步骤 1"></el-step>
                <el-step title="步骤 2"></el-step>
                <el-step
                  title="步骤 3"
                  description="这是一段很长很长很长的描述性文字"
                ></el-step>
              </el-steps>
            </div> -->
          </div>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环 嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editRolesBtn(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRolesBtn(scope.row)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRolesVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getRoles,
  deleteRole,
  getAllroles,
  allotRight_Api,
  addRoles,
  deleteRoles,
  editRolesSubmit
} from '@/api/roles.js'
export default {
  data() {
    return {
      isActive: '01',
      date: '20210906',
      // 所有角色列表
      rolelist: [],
      setRightDialogVisible: false,
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: '',
      editId: '',
      // 模拟数据
      keepList: [],
      codeIndex: 1,
      addRolesVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      }, //添加用户表单
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 5,
            max: 100,
            message: '长度在 5 到 100 个字符',
            trigger: 'blur'
          }
        ]
      },
      editRolesVisible: false, //编辑弹窗
      editForm: {
        roleName: '',
        roleDesc: ''
      }, //添加用户表单
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: false, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 5,
            max: 100,
            message: '长度在 5 到 100 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    this.getRolesList()
    this.isActive = '02'
  },
  computed: {},
  methods: {
    // 关闭弹窗
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑提交
    editRolesInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await editRolesSubmit(this.editId, this.editForm)
        if (res.meta.status !== 200) {
          return this.$message.error('编辑角色失败！')
        }

        this.$message.success('编辑角色成功')
        this.getRolesList()
        this.editRolesVisible = false
      })
    },
    // 编辑角色
    editRolesBtn(role) {
      console.log('555555', role)
      this.editId = role.id
      this.editRolesVisible = true
      this.editForm.roleName = role.roleName
      this.editForm.roleDesc = role.roleDesc
    },
    // 删除角色
    removeRolesBtn(role) {
      var roleID = role.id
      deleteRoles(roleID).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('删除角色失败！')
        } else {
          this.$message.success('删除角色成功')
          this.getRolesList()
        }
      })
    },
    // 添加角色
    addRolesInfo() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        // this.$http.post('users', this.addRuleForm)
        addRoles(this.addForm).then(res => {
          console.log('res', res.data)
          if (res.data.meta.status !== 201)
            return this.$message.error('添加失败！')
          // 关闭对话框
          this.addRolesVisible = false
          // 刷新数据列表
          this.getRolesList()
          this.$message.success('添加成功')
        })
      })
    },
    showSetRightDialog(role) {
      console.log('role', role)
      this.roleId = role.id
      getAllroles().then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取权限数据失败！')
        }
        this.rightslist = res.data.data

        this.setRightDialogVisible = true
        this.getLeafKeys(role, this.defKeys)
      })
    },
    // 所有角色列表
    getRolesList() {
      getRoles()
        .then(res => {
          console.log(res)
          if (res.data.meta.status !== 200) {
            return this.$message.error('获取角色列表失败！')
          }
          this.rolelist = res.data.data
        })
        .catch(err => {
          return this.$message.error('请求失败：' + err)
        })
    },
    async removeRightById(role, rightId) {
      console.log('删除对象权限')
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => {
        err
      })
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
      deleteRole(role.id, rightId).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('删除权限失败！')
        } else {
          role.children = res.data.data
        }
      })

      // const { data: res } = await deleteRole(role.id,rightId)
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 会话框关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 关闭弹窗事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    async allotRights() {
      console.log('555555555', this.$refs.treeRef.getCheckedKeys())
      console.log('6666666', this.$refs.treeRef.getHalfCheckedKeys())
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(' this.roleId', this.roleId)
      const idStr = keys.join(',') //数组变字符串
      const { data: res } = await allotRight_Api(this.roleId, idStr)

      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }

      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  },
  watch: {
    isActive: {
      handler(newVal, oldVal) {
        console.log('newVal', newVal)
        console.log('oldVal', oldVal)
        this.isActive = '03'
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style scoped lang="less">
.el-tag {
  margin: 8px;
}
.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
/*
*伪元素
*/
.phoneNumber {
  margin-top: 20px;
  height: 90%;
  position: relative;
  &::before {
    content: ''; //\260E
    font-size: 15px;
    margin-right: 5px;
    width: 1px;
    top: 20px;
    bottom: 84px;
    background: #e5e5e5;
    left: 10px;
    position: absolute;
  }
}
.person {
  font-size: 16px;
  color: #999;
  display: flex;
  flex-basis: auto;
  justify-content: space-between;
  position: relative;
  .index {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 20px;
    background: blue;
  }
}
.content {
  display: flex;
  flex-basis: auto;
  // justify-content: space-between;
}
</style>
