<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-radio-group v-model="radio" @change="handleChang">
      <el-radio :label="'0'">否</el-radio>
      <el-radio :label="'1'">是</el-radio>
    </el-radio-group>
  </div>
</template>
<script>
export default {
  data() {
    return {
      radio: ''
    }
  },
  mounted() {
    this.radio = '0'
    console.log('radio', this.radio)
  },
  methods: {
    handleChang() {
      console.log('model', this.radio)
    }
  }
}
</script>
