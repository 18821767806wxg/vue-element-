<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <span style="color:red">{{ datetime }}</span>
      <br />
      <el-button
        type="text"
        :class="[isActive == '01' ? 'active' : 'normal-btn']"
        @click="onchangeTab('01')"
        >投保人1
      </el-button>
      <el-button
        type="text"
        :class="[isActive == '02' ? 'active' : 'normal-btn']"
        @click="onchangeTab('02')"
        >投保人 2</el-button
      >
      <el-button
        type="text"
        :class="[isActive == '03' ? 'active' : 'normal-btn']"
        @click="onchangeTab('03')"
        >投保人 3</el-button
      >
    </div>
    <div
      style="text-align:center;vertical-align:middle;height:20px;"
      v-if="date"
    >
      <span>时间：</span>
      <input type="text" v-model="date" style="outline:none;border:none" />
      <!-- <span v-pre>{{ this will not be compiled }}</span> -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isActive: '01',
      date: '20210906'
    }
  },
  mounted() {},
  computed: {
    datetime() {
      return (
        this.date.slice(0, 4) +
        '-' +
        this.date.slice(4, 6) +
        '-' +
        this.date.slice(6, 8)
      )
    }
  },
  methods: {
    onchangeTab(code) {
      console.log('code', code)
      this.isActive = code
    }
  },
  watch: {
    isActive: {
      handler(newVal, oldVal) {
        console.log('newVal', newVal)
        console.log('oldVal', oldVal)
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style scoped>
.active {
  color: red !important;
}
.normal-btn {
  color: #9999 !important;
}
</style>
