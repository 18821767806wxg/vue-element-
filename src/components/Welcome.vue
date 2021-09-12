<template>
  <div>
    <p>{{ firstNames }}</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fullName: ''
    }
  },
  computed: {
    // 简单的监听事件
    firstNames() {
      return '欢迎回来'
    }
  },
  mounted() {
    // this.fn('abcccccc')
  },
  methods: {
    fn(str) {
      var hash = {}
      for (let i = 0; i < str.length; i++) {
        // console.log('str[i]', str[i])
        console.log('hash[str[i]]', hash[str[i]]) //对象默认没有那一项undefined
        if (hash[str[i]]) {
          hash[str[i]]++
          // console.log('11', hash[str[i]])
        } else {
          hash[str[i]] = 1
        }
      }
      console.log(hash)
    }
  }
}
</script>
