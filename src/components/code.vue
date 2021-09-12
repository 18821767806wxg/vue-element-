<template>
  <div>
    <h1>可以封装全局组件</h1>
    <h2>{{ date }}</h2>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    userDate: {
      type: String
    }
  },
  data() {
    return {
      date: null
    }
  },
  mounted() {
    console.log('userDate', this.userDate)
  },
  watch: {
    userDate: {
      handler(newV, oldV) {
        //newval   old
        console.log('44444', newV, oldV)
        if (newV) {
          this.date = newV
          this.init(newV)
          return
        } else {
          this.init(newV)
          return
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    init(value) {
      console.log('wangxiaogang')
      console.log('3737377', value)
      console.log('9999999', this.date)
    }
  }
}
</script>
