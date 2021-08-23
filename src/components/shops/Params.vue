<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <div v-for="(item, index) in userList" :key="index">
      <el-card>
        <p>{{ item.email }}</p>
        <p>{{ item.username }}</p>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  mounted() {
    console.log('2222', this.$store.state.detailList)
  },
  computed: {
    userList() {
      return this.$store.state.detailList
    }
  }
}
</script>
<style scoped>
.el-card {
  margin-bottom: 5px;
}
</style>
